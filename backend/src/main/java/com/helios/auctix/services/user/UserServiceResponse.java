package com.helios.auctix.services.user;


import com.helios.auctix.domain.upload.Upload;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@AllArgsConstructor
@Data
public class UserServiceResponse {
    private boolean success;
    private String message;
}
