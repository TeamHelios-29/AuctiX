package com.helios.auctix.mappers.impl;

import com.helios.auctix.domain.upload.FileTypeEnum;
import com.helios.auctix.domain.upload.Upload;
import com.helios.auctix.dtos.UploadDTO;
import com.helios.auctix.services.fileUpload.FileUploadUseCaseEnum;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Log4j2
@Component
public class UploadMapperImpl {

    public UploadDTO mapTo(Upload upload) {
        UploadDTO uploadDTO = new UploadDTO();
        uploadDTO.setId(String.valueOf(upload.getId()));
        uploadDTO.setFileName(upload.getFileName());
        uploadDTO.setFileType(upload.getFileType().toString());
        uploadDTO.setFileSize(upload.getFileSize());
        uploadDTO.setFileHash256(upload.getHash256());
        uploadDTO.setIsPublic(upload.getIsPublic());
        uploadDTO.setCategory(upload.getCategory());
        return uploadDTO;
    }

    public Upload mapFrom(UploadDTO uploadDTO) {
        Upload upload = Upload.builder()
                .id(UUID.fromString(uploadDTO.getId()))
                .fileName(uploadDTO.getFileName())
                .fileType(FileTypeEnum.valueOf(uploadDTO.getFileType()))
                .fileSize(uploadDTO.getFileSize())
                .hash256(uploadDTO.getFileHash256())
                .isPublic(uploadDTO.getIsPublic())
                .category(FileUploadUseCaseEnum.valueOf(uploadDTO.getCategory()).name())
                .build();
        return upload;
    }
}
