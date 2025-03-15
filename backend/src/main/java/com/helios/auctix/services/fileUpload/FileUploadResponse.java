package com.helios.auctix.services.fileUpload;

import com.helios.auctix.domain.upload.Upload;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FileUploadResponse {
    private boolean success;
    private String message;
    private Upload upload;
}