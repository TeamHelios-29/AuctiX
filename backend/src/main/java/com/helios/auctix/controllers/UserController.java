package com.helios.auctix.controllers;

import com.helios.auctix.config.ErrorConfig;
import com.helios.auctix.config.JwtAuthenticationFilter;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.domain.user.UserRole;
import com.helios.auctix.domain.user.UserRoleEnum;
import com.helios.auctix.repositories.UserRepository;
import com.helios.auctix.services.fileUpload.FileUploadResponse;
import com.helios.auctix.services.fileUpload.FileUploadService;
import com.helios.auctix.services.user.UserRegisterService;
import com.helios.auctix.services.user.UserServiceResponse;
import com.helios.auctix.services.user.UserUploadsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.*;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/user")
public class UserController {

    private final UserRepository userRepository;
    private final UserRegisterService userRegisterService;
    private final Logger log = Logger.getLogger(UserController.class.getName());

    @Autowired
    private FileUploadService uploader;

    @Autowired
    private UserUploadsService userUploadsService;

    @Autowired
    private ErrorConfig errorConf;
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    public UserController(UserRepository userRepository, UserRegisterService userRegisterService) {
        this.userRepository = userRepository;
        this.userRegisterService = userRegisterService;
    }

    @GetMapping("/hello")
    public String hello() {
        return "hello world!";
    }

    @GetMapping("/user-exists")
    public String isUserExcist(@RequestParam(required = false) String username, @RequestParam(required = false) UUID id, @RequestParam(required = false) String email) {
        boolean hasUname = !username.isBlank();
        boolean hasId = id != null;
        boolean hasEmail = !email.isBlank();
        byte providedParamsCount = 0;
        if (hasUname) {
            providedParamsCount++;
        }
        if (hasId) {
            providedParamsCount++;
        }
        if (hasEmail) {
            providedParamsCount++;
        }
        if (providedParamsCount != 1) {
            return "Error: must provide only one of username/id or email";
        } else {
            boolean userExists = false;
            if (hasEmail) {
                userExists = userRegisterService.isUserExistsOnEmail(email);
            } else if (hasUname) {
                userExists = userRegisterService.isUserExistsOnUsername(username);
            } else if (hasId) {
                userExists = userRegisterService.isUserExistsOnId(id);
            }
            return String.valueOf(userExists);
        }
    }

    @PostMapping("/uploadVerificationDocs")
    public String uploadVerificationDocs(@RequestParam("file") MultipartFile file) {
        ErrorConfig errorConf = new ErrorConfig();
        FileUploadResponse res = uploader.uploadFile(file, "userVerifications");
        if (res.isSuccess()) {
            return res.getMessage();
        } else {
            if (errorConf.isShowDetailed()) {
                return res.getMessage();
            } else {
                return "File upload failed";
            }
        }
    }

    @PostMapping("/createSeller")
    public ResponseEntity<String> createUser(@RequestParam("username") String username, @RequestParam("email") String email, @RequestParam("password") String password, @RequestParam("firstName") String firstName, @RequestParam("lastName") String lastName) {
        try {
            log.info("Seller creation request: " + username);
            UserServiceResponse res = userRegisterService.addUser(username, email, password, firstName, lastName, UserRoleEnum.SELLER);
            if (res.isSuccess()) {
                return ResponseEntity.ok("Success: Seller Created");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(res.getMessage());
            }
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: Failed to create seller");
        }
    }

    @PostMapping("/createBidder")
    public String createBidder(@RequestParam("username") String username, @RequestParam("email") String email, @RequestParam("password") String password, @RequestParam("firstName") String firstName, @RequestParam("lastName") String lastName) {
        log.info("Bidder creation request: " + username);
        UserServiceResponse res = userRegisterService.addUser(username, email, password, firstName, lastName, UserRoleEnum.BIDDER);
        if (res.isSuccess()) {
            return "Success: Bidder Created";
        } else {
            return res.getMessage();
        }
    }

    @PostMapping("/createAdmin")
    public String createAdmin(@RequestParam("username") String username, @RequestParam("email") String email, @RequestParam("password") String password, @RequestParam("firstName") String firstName, @RequestParam("lastName") String lastName) {
        log.info("Admin creation request: " + username);
        UserServiceResponse res = userRegisterService.addUser(username, email, password, firstName, lastName, UserRoleEnum.ADMIN);
        if (res.isSuccess()) {
            return "Success: Admin Created";
        } else {
            return res.getMessage();
        }
    }

    @Profile("dev")
    @GetMapping("/getAuthUser")
    public String getUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("auth details: " + authentication.getPrincipal().getClass().getName());
        // get user role
        UserRoleEnum userRole = null;
        if (authentication != null || authentication.getAuthorities() != null) {
            log.info("getAuthUser: " + authentication.getName());
            Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
            Optional<GrantedAuthority> grantedAuthority = (Optional<GrantedAuthority>) authorities.stream().findFirst();
            if (grantedAuthority.isPresent()) {
                String tmp = grantedAuthority.get().getAuthority().replace("ROLE_", "");
                userRole = UserRoleEnum.valueOf(tmp);
            }
        }

        return userRole.toString();

    }

    @GetMapping("/getUsers")
    public ResponseEntity<?> getUsers(
            @RequestParam(value = "limit", required = false, defaultValue = "10") Integer limit,
            @RequestParam(value = "offset", required = false, defaultValue = "0") Integer offset,
            @RequestParam(value = "sortby", required = false, defaultValue = "id") String sortBy,
            @RequestParam(value = "order", required = false, defaultValue = "asc") String order,
            @RequestParam(value = "search", required = false) String search) {

        if (limit < 0 || offset < 0) {
            return ResponseEntity.badRequest().body("Error: limit and offset must be positive");
        }
        if(limit > 100) {
            return ResponseEntity.badRequest().body("Error: limit must be less than or equal to 100");
        }

        List<String> validSortFields = Arrays.asList("id", "username", "email", "role");
        if (!validSortFields.contains(sortBy)) {
            return ResponseEntity.badRequest().body("Error: Invalid sortBy value. Valid values: id, username, email, role");
        }

        if (!order.equalsIgnoreCase("asc") && !order.equalsIgnoreCase("desc")) {
            return ResponseEntity.badRequest().body("Error: Invalid order value. Valid values: asc, desc");
        }

        Sort.Direction direction = order.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(offset, limit, Sort.by(direction, sortBy));

        Page<User> userPage;
        if (search != null && !search.trim().isEmpty()) {
            userPage = userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search, pageable);
        } else {
            userPage = userRepository.findAll(pageable);
        }

        return ResponseEntity.ok(userPage);
    }


    @PostMapping("/uploadUserProfilePhoto")
    public ResponseEntity<String> uploadUserProfilePhoto(@RequestParam("file") MultipartFile file) {

        try {
            // Authenticate user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = null;
            if (authentication == null || authentication.getAuthorities() == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication required");
            }
            userEmail = authentication.getName();
            if (userEmail == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication required");
            }
            log.info("File upload by user " + userEmail);


            // Upload file
            log.info("Trying to upload file");
            FileUploadResponse uploadRes = uploader.uploadFile(file, "userProfilePhotos", userEmail , true );

            if (uploadRes.isSuccess()) {
                // save file upload data
                log.info("Trying to save file upload data");
                UserServiceResponse res = userUploadsService.UserProfilePhotoUpdate(userEmail, uploadRes.getUpload());
                log.info("File upload data saved");

                if (res.isSuccess()) {
                    return ResponseEntity.ok().body("Profile photo uploaded successfully");
                } else {
                    log.warning(res.getMessage());
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload data saving failed");
                }

            } else {
                log.warning(uploadRes.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed");
            }
        }
        catch (Exception e) {
            log.warning(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload failed");
        }

    }
}