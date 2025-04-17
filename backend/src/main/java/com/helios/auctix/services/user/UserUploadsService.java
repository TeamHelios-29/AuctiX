package com.helios.auctix.services.user;

import com.helios.auctix.domain.upload.Upload;
import com.helios.auctix.domain.user.*;
import com.helios.auctix.repositories.UploadRepository;
import com.helios.auctix.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class UserUploadsService {

    private final UploadRepository uploadRepository;
    private final UserRepository userRepository;
    Logger log = Logger.getLogger(UserRegisterService.class.getName());

    public UserServiceResponse UserProfilePhotoUpdate(UUID userId,Upload upload) {
        User user = userRepository.findById(userId).orElse(null);
        return UserProfilePhotoUpdate(user,upload);
    }

    public UserServiceResponse UserProfilePhotoUpdate(String email,Upload upload) {
        User user = userRepository.findByEmail(email);
        return UserProfilePhotoUpdate(user,upload);
    }

    @Transactional
    public UserServiceResponse UserProfilePhotoUpdate(User user,Upload upload) {
            if(user == null) {
                return new UserServiceResponse(false, "User not found",null);
            }

            uploadRepository.save(upload);
            log.info("UserProfilePhotoUpdate successfully");
            user.setUpload(upload);
            userRepository.save(user);
            log.info("UserProfilePhotoUpdate successfully");

            return new UserServiceResponse(true, "Upload saved",user);
    }
}
