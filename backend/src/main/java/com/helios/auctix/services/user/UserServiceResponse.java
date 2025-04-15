package com.helios.auctix.services.user;


import com.helios.auctix.domain.upload.Upload;
import com.helios.auctix.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@AllArgsConstructor
@Data
public class UserServiceResponse {
    private boolean success;
    private String message;

    private User user = null;
}
