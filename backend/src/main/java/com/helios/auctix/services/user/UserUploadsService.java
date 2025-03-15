package com.helios.auctix.services.user;

import com.helios.auctix.domain.upload.Upload;
import com.helios.auctix.domain.user.*;
import com.helios.auctix.repositories.UploadRepository;
import com.helios.auctix.repositories.UserProfilePhotoRepository;
import com.helios.auctix.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class UserUploadsService {

    private final UploadRepository uploadRepository;
    private final UserRepository userRepository;
    private final UserProfilePhotoRepository userProfilePhotoRepository;
    Logger log = Logger.getLogger(UserRegisterService.class.getName());

    public UserServiceResponse UserProfilePhotoUpdate(UUID userId,Upload upload) {
        User user = userRepository.findById(userId.toString()).orElse(null);
        return UserProfilePhotoUpdate(user,upload);
    }

    public UserServiceResponse UserProfilePhotoUpdate(String email,Upload upload) {
        User user = userRepository.findByEmail(email);
        return UserProfilePhotoUpdate(user,upload);
    }

    public UserServiceResponse UserProfilePhotoUpdate(User user,Upload upload) {
            if(user == null) {
                return new UserServiceResponse(false, "User not found");
            }

            log.info("setting profile photo owner data");
            upload.setOwner(user);
            log.info("Saving profile photo data to uploads table");
            upload = uploadRepository.save(upload);

            log.info("Saved profile photo data to uploads table");
            log.info(upload.toString()+" "+user.toString());
            UserProfilePhoto userProfilePhoto = UserProfilePhoto.builder()
                    .upload(upload)
                    .user(user)
                    .photoRef(upload.getId())
                    .build();
            userProfilePhotoRepository.save(userProfilePhoto);
            log.info("Saved profile photo data to user profile photos table");

            return new UserServiceResponse(true, "Upload saved");
    }
}
