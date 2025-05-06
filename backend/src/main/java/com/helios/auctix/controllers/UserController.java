package com.helios.auctix.controllers;

import com.azure.core.util.BinaryData;
import com.helios.auctix.config.ErrorConfig;
import com.helios.auctix.config.JwtAuthenticationFilter;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.domain.user.UserRoleEnum;
import com.helios.auctix.repositories.UserRepository;
import com.helios.auctix.services.CustomUserDetailsService;
import com.helios.auctix.services.fileUpload.FileUploadResponse;
import com.helios.auctix.services.fileUpload.FileUploadService;
import com.helios.auctix.services.fileUpload.FileUploadUseCaseEnum;
import com.helios.auctix.services.user.*;
import org.apache.tomcat.websocket.AuthenticationException;
import org.eclipse.angus.mail.iap.ByteArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.security.Principal;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

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
    @Autowired
    private FileUploadService fileUploadService;

    @Autowired
    private UserDetailsService userDetailsService ;


    public UserController(UserRepository userRepository, UserRegisterService userRegisterService) {
        this.userRepository = userRepository;
        this.userRegisterService = userRegisterService;
    }

    @GetMapping("/hello")
    public String hello() {
        return "hello world!";
    }

    @GetMapping("/isUserExists")
    public String isUserExcist(@RequestParam(required = false) String username, @RequestParam(required = false) UUID id, @RequestParam(required = false) String email) {
        boolean hasUname = !(username==null || username.isBlank());
        boolean hasId = id != null;
        boolean hasEmail = !(email==null || email.isBlank());
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

        User currentUser = null;
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            currentUser = userDetailsService.getAuthenticatedUser(authentication);
            FileUploadResponse res = uploader.uploadFile(file, FileUploadUseCaseEnum.VERIFICATION_DOCUMENTS.toString() , currentUser.getId(), false);
            if (res.isSuccess()) {
                return res.getMessage();
            } else {
                log.warning(res.getMessage());
                return "File upload failed";
            }
        }
        catch(Exception e){
            log.warning(e.getMessage());
            return "File upload failed";
        }
    }

    @Profile("dev")
    @PostMapping("/createSeller")
    public ResponseEntity<String> createUser(@RequestParam("username") String username, @RequestParam("email") String email, @RequestParam("password") String password, @RequestParam("firstName") String firstName, @RequestParam("lastName") String lastName) {
        try {
            log.info("Seller creation request: " + username);
            UserServiceResponse res = userRegisterService.addUser(username, email, password, firstName, lastName, UserRoleEnum.SELLER,null);
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

    @Profile("dev")
    @PostMapping("/createBidder")
    public String createBidder(@RequestParam("username") String username, @RequestParam("email") String email, @RequestParam("password") String password, @RequestParam("firstName") String firstName, @RequestParam("lastName") String lastName) {
        log.info("Bidder creation request: " + username);
        UserServiceResponse res = userRegisterService.addUser(username, email, password, firstName, lastName, UserRoleEnum.BIDDER,null);
        if (res.isSuccess()) {
            return "Success: Bidder Created";
        } else {
            return res.getMessage();
        }
    }

    @Profile("dev")
    @PostMapping("/createAdmin")
    public String createAdmin(@RequestParam("username") String username, @RequestParam("email") String email, @RequestParam("password") String password, @RequestParam("firstName") String firstName, @RequestParam("lastName") String lastName) {
        log.info("Admin creation request: " + username);
        User currentUser = null;
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            currentUser = userDetailsService.getAuthenticatedUser(authentication);
        }
        catch(Exception e){
            log.warning(e.getMessage());
        }
        UserServiceResponse res = userRegisterService.addUser(username, email, password, firstName, lastName, UserRoleEnum.ADMIN,currentUser);
        if (res.isSuccess()) {
            return "Success: Admin Created";
        } else {
            return res.getMessage();
        }
    }

    @Profile("dev")
    @GetMapping("/getAuthUser")
    public ResponseEntity<?> getUser() {
        User currentUser = null;
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            currentUser = userDetailsService.getAuthenticatedUser(authentication);
        }
        catch (AuthenticationException e){
            return ResponseEntity.status(403).body("User not authenticated");
        }
        catch (Exception e){
            return ResponseEntity.status(500).body("Internal server error");
        }

        return ResponseEntity.ok(currentUser);

    }

    @GetMapping("/getUsers")
    public ResponseEntity<?> getUsers(
            @RequestParam(value = "limit", required = false, defaultValue = "10") Integer limit,
            @RequestParam(value = "offset", required = false, defaultValue = "0") Integer offset,
            @RequestParam(value = "sortby", required = false, defaultValue = "id") String sortBy,
            @RequestParam(value = "order", required = false, defaultValue = "asc") String order,
            @RequestParam(value = "search", required = false) String search) {

        try{
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User user = userDetailsService.getAuthenticatedUser(authentication);
            String userRole = user.getRole().getName().toString();
            log.info("user data requested by "+user.getEmail()+","+userRole);
            if(!(UserRoleEnum.valueOf(userRole)==UserRoleEnum.ADMIN || UserRoleEnum.valueOf(userRole)==UserRoleEnum.SUPER_ADMIN)){
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("FORBIDDEN");
            }
            Page userPage = userDetailsService.getAllUsers(limit,offset,order,sortBy,search);
            return ResponseEntity.ok(userPage);
        }
        catch (IllegalArgumentException e){
            return ResponseEntity.badRequest().body("Bad request");
        }
        catch(AuthenticationException e){
            return ResponseEntity.status(403).body("User not authenticated");
        }
    }

    @GetMapping("/getCurrentUser")
    public ResponseEntity<?> getCurrentUser() {
        User currentUser = null;
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            currentUser = userDetailsService.getAuthenticatedUser(authentication);
        }
        catch (AuthenticationException e){
            return ResponseEntity.status(403).body("User not authenticated");
        }
        catch (Exception e){
            log.warning(e.getMessage());
            return ResponseEntity.status(500).body("Internal server error");
        }

        return ResponseEntity.ok(currentUser);
    }

    @GetMapping("/getUser")
    public ResponseEntity<?> getUser(
            @RequestParam(value = "username", required = false) String username,
            @RequestParam(value = "email" , required = false) String email,
            @RequestParam(value = "userId" , required = false) UUID userId
    ) {
        User user = null;
        boolean hasUname = !(username==null || username.isBlank());
        boolean hasId = userId != null;
        boolean hasEmail = !(email==null || email.isBlank());
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
            return ResponseEntity.badRequest().body("Error: must provide only one of username,id or email");
        } else {
            if (hasEmail) {
                user = userDetailsService.getUserByEmail(email);
            } else if (hasUname) {
                user = userDetailsService.getUserByUsername(username);
            } else if (hasId) {
                user = userDetailsService.getUserById(userId);
            }
        }
        if(user==null){
            return ResponseEntity.status(404).body("User not found");
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping("/uploadUserProfilePhoto")
    public ResponseEntity<String> uploadUserProfilePhoto(@RequestParam("file") MultipartFile file) {

        User currentUser = null;
        try{
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            currentUser = userDetailsService.getAuthenticatedUser(authentication);

            log.info("File upload by user " + currentUser.getUsername());


            // Upload file
            log.info("Trying to upload file");
            FileUploadResponse uploadRes = uploader.uploadFile(file, FileUploadUseCaseEnum.PROFILE_PHOTO.toString() , currentUser.getEmail() , true );

            if (uploadRes.isSuccess()) {
                // save file upload data
                log.info("Trying to save file upload data");
                UserServiceResponse res = userUploadsService.UserProfilePhotoUpdate(currentUser.getEmail(), uploadRes.getUpload());
                log.info("File upload data saved");

                if (res.isSuccess()) {
                    return ResponseEntity.ok().body("Profile photo uploaded successfully "+ res.getUser().getUpload().getId());
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


    @GetMapping("/getUserProfilePhoto")
    public ResponseEntity<?> getUserProfilePhoto(@RequestParam("file_uuid") UUID file_uuid) {
        log.info("file id requested: "+ file_uuid);

        // Authenticate user
        User currentUser = null;
        try{
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            currentUser = userDetailsService.getAuthenticatedUser(authentication);
            FileUploadResponse res;
            log.info("getting File by user " + currentUser.getEmail());

            // Get file upload data
            res = fileUploadService.getFile(file_uuid, currentUser.getEmail());

            if (!res.isSuccess()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res.getMessage());
            }


            BinaryData binaryFile = res.getBinaryData();

            String fileName = res.getUpload().getFileName();
            String contentType = res.getUpload().getFileType().getContentType();


            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .body(binaryFile.toBytes());

        }
        catch(UsernameNotFoundException e){
            log.warning(e.getMessage());
        }
        catch(AuthenticationException e){
            log.warning(e.getMessage());
        }
        catch (Exception e) {
            log.warning(e.getMessage());
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload data retrieval failed");
    }

    @DeleteMapping("/deleteUserProfilePhoto")
    public ResponseEntity<String> deleteUserProfilePhoto(@RequestParam("username") String username) {
        try {
            // Authenticate user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userDetailsService.getAuthenticatedUser(authentication);
            log.info("File upload by user " + currentUser.getEmail());

            // Delete file
            UserServiceResponse res = userUploadsService.UserProfilePhotoDelete(currentUser.getEmail());
            if (res.isSuccess()) {
                return ResponseEntity.ok().body("Profile photo deleted successfully");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res.getMessage());
            }

        } catch (Exception e) {
            log.warning(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload data retrieval failed");
        }
    }


}