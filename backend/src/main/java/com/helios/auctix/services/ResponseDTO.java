package com.helios.auctix.services;

public class ResponseDTO {
    public String message;
    public boolean isSuccess;

    public ResponseDTO(String message,boolean isSuccess){
        this.message = message;
        this.isSuccess = isSuccess;
    }
}
