package com.helios.auctix.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UploadDTO {
    private String fileName;
    private String fileType;
    private String id;
    private Boolean isPublic;
    private long fileSize;
    private String fileHash256;
    private String Category;
}
