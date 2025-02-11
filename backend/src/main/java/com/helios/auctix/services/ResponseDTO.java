package com.helios.auctix.services;

public class ResponseDTO {
    private String message;
    private boolean isSuccess;

    public ResponseDTO(String message,boolean isSuccess){
        this.message = message;
        this.isSuccess = isSuccess;
    }
}
