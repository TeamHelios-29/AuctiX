package com.helios.auctix.services.fileUpload;

public class UploadedFileCountMaxLimitExceedException extends RuntimeException {
    public UploadedFileCountMaxLimitExceedException(String message) {
        super(message);
    }
}
