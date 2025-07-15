package com.helios.auctix.services.fileUpload;

public class UploadedFileSizeMaxLimitExceedException extends RuntimeException {
    public UploadedFileSizeMaxLimitExceedException(String message) {
        super(message);
    }
}
