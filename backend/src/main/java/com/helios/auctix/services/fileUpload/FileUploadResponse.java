package com.helios.auctix.services.fileUpload;

import com.azure.core.util.BinaryData;
import com.helios.auctix.domain.upload.Upload;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.OutputStream;

@Data
public class FileUploadResponse {
    private boolean success;
    private String message;
    private Upload upload;
    private BinaryData binaryData;

    public FileUploadResponse(boolean success, String message, Upload upload) {
        this.success = success;
        this.message = message;
        this.upload = upload;
    }

    public FileUploadResponse(boolean success, String message, BinaryData binaryData) {
        this.success = success;
        this.message = message;
        this.binaryData = binaryData;
    }

    public FileUploadResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

}
