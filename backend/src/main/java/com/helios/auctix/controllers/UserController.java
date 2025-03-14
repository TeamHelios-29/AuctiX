package com.helios.auctix.controllers;

import com.helios.auctix.config.ErrorConfig;
import com.helios.auctix.domain.user.UserRoleEnum;
import com.helios.auctix.repositories.UserRepository;
import com.helios.auctix.services.ResponseDTO;
import com.helios.auctix.services.fileUpload.FileUploadService;
import com.helios.auctix.services.user.UserService;
import lombok.extern.java.Log;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;
import java.util.logging.Logger;

@RestController
@RequestMapping("api/user")
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final Logger log = Logger.getLogger(UserController.class.getName());

    public UserController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @GetMapping("/info")
    public ResponseDTO getUserInfo() {
        return new ResponseDTO("test message",true);
    }

//    @GetMapping("/addUser")
//    public String addSampleUser(@RequestParam String username, @RequestParam String email, @RequestParam String password){
//        String res = userService.addUser(username, email, password);
//        System.out.println("user create request: "+ username+" "+ res);
//        return res;
//    }

    @PostMapping("/userExcist")
    public String isUserExcist( @RequestParam(required = false) String username, @RequestParam(required = false) UUID id, @RequestParam(required = false) String email){
        boolean hasUname = !username.isBlank();
        boolean hasId = id!=null;
        boolean hasEmail = !email.isBlank();
        byte providedParamsCount = 0;
        if(hasUname){
            providedParamsCount++;
        }
        if(hasId){
            providedParamsCount++;
        }
        if(hasEmail){
            providedParamsCount++;
        }
        if( providedParamsCount != 1 ){
            return "Error: must provide only one of username/id or email";
        }else{
            boolean userExists = false;
            if(hasEmail){
                userExists = userService.isUserExistsOnEmail(email);
            } else if (hasUname) {
                userExists = userService.isUserExistsOnUsername(username);
            } else if (hasId) {
                userExists = userService.isUserExistsOnId(id);
            }
            return String.valueOf(userExists);
        }
    }

    @PostMapping("/uploadVerificationDocs")
    public String uploadVerificationDocs(@RequestParam("file") MultipartFile file){
        ErrorConfig errorConf = new ErrorConfig();
        FileUploadService uploader = new FileUploadService();
        ResponseDTO res = uploader.uploadFile(file,"userVerifications");
        if(res.isSuccess){
            return res.message;
        }else{
            if(errorConf.isShowDetailed()) {
                return res.message;
            }
            else{
                return "File upload failed";
            }
        }
    }

    @PostMapping("/createSeller")
    public String createUser(@RequestParam("username") String username, @RequestParam("email") String email, @RequestParam("password") String password, @RequestParam("firstName") String firstName, @RequestParam("lastName") String lastName){
        log.info("Seller creation request: "+username);
        String res = userService.addUser(username, email, password, firstName, lastName, UserRoleEnum.SELLER);
        if(res.contains("Success")){
            return "Success: Seller Created";
        }else{
            return res;
        }
    }

    @PostMapping("/createBidder")
    public String createBidder(@RequestParam("username") String username, @RequestParam("email") String email, @RequestParam("password") String password, @RequestParam("firstName") String firstName, @RequestParam("lastName") String lastName){
        log.info("Bidder creation request: "+username);
        String res = userService.addUser(username, email, password, firstName, lastName, UserRoleEnum.BIDDER);
        if(res.contains("Success")){
            return "Success: Bidder Created";
        }else{
            return res;
        }
    }

    @PostMapping("/createAdmin")
    public String createAdmin(@RequestParam("username") String username, @RequestParam("email") String email, @RequestParam("password") String password, @RequestParam("firstName") String firstName, @RequestParam("lastName") String lastName){
        log.info("Admin creation request: "+username);
        String res = userService.addUser(username, email, password, firstName, lastName, UserRoleEnum.ADMIN);
        if(res.contains("Success")){
            return "Success: Admin Created";
        }else{
            return res;
        }
    }

}