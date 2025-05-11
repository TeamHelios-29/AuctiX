package com.helios.auctix.services.user;

import com.helios.auctix.domain.upload.Upload;
import com.helios.auctix.domain.user.*;
import com.helios.auctix.repositories.UploadRepository;
import com.helios.auctix.repositories.UserRepository;
import com.helios.auctix.services.fileUpload.FileUploadResponse;
import com.helios.auctix.services.fileUpload.FileUploadService;
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
    private final FileUploadService fileUploadService;

    Logger log = Logger.getLogger(UserRegisterService.class.getName());

    /**
     * Updates the profile photo of a user by their UUID.
     *
     * @param userId The UUID of the user whose profile photo is to be updated.
     * @param upload The new upload object representing the profile photo. you can obtain this using fild upload service
     * @return A UserServiceResponse indicating success or failure of the operation.
     */
    public UserServiceResponse UserProfilePhotoUpdate(UUID userId,Upload upload) {
        User user = userRepository.findById(userId).orElse(null);
        return UserProfilePhotoUpdate(user,upload);
    }

    /**
     * Updates the profile photo of a user by their email.
     *
     * @param email The email of the user whose profile photo is to be updated.
     * @param upload The new upload object representing the profile photo. you can obtain this using fild upload service
     * @return A UserServiceResponse indicating success or failure of the operation.
     */
    public UserServiceResponse UserProfilePhotoUpdate(String email,Upload upload) {
        User user = userRepository.findByEmail(email);
        return UserProfilePhotoUpdate(user,upload);
    }

    /**
     * Updates the profile photo of a user object.
     *
     * @param user The user object whose profile photo is to be updated.
     * @param upload The new upload object representing the profile photo.
     * @return A UserServiceResponse indicating success or failure of the operation.
     */
    @Transactional
    public UserServiceResponse UserProfilePhotoUpdate(User user,Upload upload) {
            if(user == null) {
                return new UserServiceResponse(false, "User not found");
            }

            // Delete the previous profile picture if it exists
            Upload previousProfilePicture = user.getUpload();
            if(previousProfilePicture != null) {
                FileUploadResponse res = fileUploadService.deleteFile(previousProfilePicture, user);
                if(!res.isSuccess()){
                    return new UserServiceResponse(false, res.getMessage());
                }
            }

            // Save the new profile picture
            uploadRepository.save(upload);
            log.info("UserProfilePhotoUpdate successful onUploads");
            user.setUpload(upload);
            userRepository.save(user);
            log.info("UserProfilePhotoUpdate successful onUser");

            return new UserServiceResponse(true, "Upload saved",user);
    }

    /**
     * Deletes the profile photo of a user by their UUID.
     *
     * @param userId The UUID of the user whose profile photo is to be deleted.
     * @return A UserServiceResponse indicating success or failure of the operation.
     */
    public UserServiceResponse UserProfilePhotoDelete(UUID userId) {
        User user = userRepository.findById(userId).orElse(null);
        return UserProfilePhotoDelete(user);
    }

    /**
     * Deletes the profile photo of a user by their email.
     *
     * @param email The email of the user whose profile photo is to be deleted.
     * @return A UserServiceResponse indicating success or failure of the operation.
     */
    public UserServiceResponse UserProfilePhotoDelete(String email) {
        User user = userRepository.findByEmail(email);
        return UserProfilePhotoDelete(user);
    }

    /**
     * Deletes the profile photo of a user object.
     *
     * @param user The user object whose profile photo is to be deleted.
     * @return A UserServiceResponse indicating success or failure of the operation.
     */
    @Transactional
    public UserServiceResponse UserProfilePhotoDelete(User user) {
        if(user == null) {
            return new UserServiceResponse(false, "User not found");
        }

        // mark as deleted
        FileUploadResponse res = fileUploadService.deleteFile(user.getUpload(), user);
        // set profile photo to null
        user.setUpload(null);

        userRepository.save(user);

        if(!res.isSuccess()){
            return new UserServiceResponse(false, res.getMessage());
        }

        return new UserServiceResponse(true, "profile photo deleted",user);
    }
}


