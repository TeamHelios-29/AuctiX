package com.helios.auctix.services.user;


import com.helios.auctix.domain.upload.Upload;
import com.helios.auctix.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
public class UserServiceResponse {
    private boolean success;
    private String message;

    private User user = null;
    private Upload upload = null;

    public UserServiceResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public UserServiceResponse(boolean success, String message, User user) {
        this.success = success;
        this.message = message;
        this.user = user;
    }


}
