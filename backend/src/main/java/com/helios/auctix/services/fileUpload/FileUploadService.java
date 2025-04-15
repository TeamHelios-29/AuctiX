package com.helios.auctix.services.fileUpload;

import com.azure.core.util.BinaryData;
import com.azure.storage.blob.BlobClient;
import com.helios.auctix.config.AzureStorageConfig;
import com.helios.auctix.domain.upload.FileTypeEnum;
import com.helios.auctix.domain.upload.Upload;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.domain.user.UserRole;
import com.helios.auctix.domain.user.UserRoleEnum;
import com.helios.auctix.repositories.BidderRepository;
import com.helios.auctix.repositories.UploadRepository;
import com.helios.auctix.repositories.UserRepository;
import jdk.jfr.ContentType;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.flogger.Flogger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobContainerClientBuilder;
import com.azure.storage.common.StorageSharedKeyCredential;
import org.springframework.web.util.InvalidUrlException;


import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Collection;
import java.util.Formatter;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class FileUploadService {
    private final UploadRepository uploadRepository;
    private final UserRepository userRepository;
    private final AzureStorageConfig azureStorageConfig;

    private static Logger log = Logger.getLogger(FileUploadService.class.getName());


    public FileUploadResponse uploadFile(MultipartFile file,String upload_dir){
        log.warning("unauthorized file upload request");
        return uploadFile(file, upload_dir, (UUID) null , true);
    }

    public FileUploadResponse uploadFile(MultipartFile file, String upload_dir, String ownerEmail , boolean isPublic) {
        User user = userRepository.findByEmail(ownerEmail);
        if(user == null) {
            return new FileUploadResponse(false,"User not found");
        }
        return uploadFile(file, upload_dir, user.getId() , isPublic );
    }

    public FileUploadResponse uploadFile(MultipartFile file,String upload_dir,UUID ownerUserId, boolean isPublic) {
        try {

            if(azureStorageConfig.getAccountName() == null || azureStorageConfig.getAccountKey() == null || azureStorageConfig.getContainerName() == null) {
                throw new IllegalArgumentException("Blob account configurations not found");
            }

            String originalFilename = file.getOriginalFilename();
            log.info("File upload request: "+originalFilename);

            FileTypeEnum filetype = getFileType(file.getContentType());
            log.info("File type: "+filetype);

            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] fileBytes = file.getBytes();
            byte[] digestMsg = digest.digest(fileBytes);
            String sha256 = byteArrayToHex(digestMsg);
            log.info("File sha-256: "+sha256);

            String fileName = UUID.nameUUIDFromBytes(digestMsg).toString();

            Long filesize = file.getSize();
//            TODO: Rate limit mechanism

            log.info("File Uploading to Azure Blob Storage");
            URI StorageContainer = new URI(
                    azureStorageConfig.getSslEnabled()?"https:":"http:" +
                    "//" +
                    azureStorageConfig.getHost() +
                    ":" +
                    azureStorageConfig.getPort() +
                    "/devstoreaccount1/" +
                    azureStorageConfig.getContainerName());

            BlobContainerClient containerClient = new BlobContainerClientBuilder()
                    .endpoint(StorageContainer.toString())
                    .credential(new StorageSharedKeyCredential(azureStorageConfig.getAccountName(), azureStorageConfig.getAccountKey() ))
                    .buildClient();

            containerClient.createIfNotExists();

            String blobPath = upload_dir + "/" + fileName;
            BlobClient blobClient = containerClient.getBlobClient(blobPath);

            try (InputStream inputStream = file.getInputStream()) {
                blobClient.upload(inputStream, filesize, true);
                log.info("File uploaded to Azure Blob Storage: " + blobClient.getBlobUrl());
            }

            log.info("File Uploaded to : "+ StorageContainer.toString());
            Upload uploadInfo = Upload.builder()
                    .fileName(originalFilename)
                    .fileSize(filesize)
                    .fileType(filetype)
                    .hash256(sha256)
                    .url(blobPath)
                    .ownerId(ownerUserId)
                    .isPublic(isPublic)
                    .build();

            uploadRepository.save(uploadInfo);

            return new FileUploadResponse(true,"File uploaded successfully",uploadInfo) ;
        }
        catch (NoSuchAlgorithmException e) {
            log.warning(e.getMessage());
            return new FileUploadResponse(false,"File upload failed: " + e.getMessage());
        }
        catch(URISyntaxException e) {
            log.warning(e.getMessage());
            return new FileUploadResponse(false,"File upload failed: " + e.getMessage());
        }
        catch (IllegalArgumentException e) {
            log.warning(e.getMessage());
            return new FileUploadResponse(false, "File upload failed: " + e.getMessage());
        }
        catch (IOException e) {
            log.warning(e.getMessage());
            return new FileUploadResponse(false,"File upload failed: " + e.getMessage());
        }
    }

    public FileUploadResponse getFile(UUID fileId, String requestedUserEmail) {
        User user = userRepository.findByEmail(requestedUserEmail);
        if(user == null) {
            return new FileUploadResponse(false,"User not found");
        }
        return getFile(fileId, user.getId());
    }

    public FileUploadResponse getFile(UUID fileId) {
        return getFile(fileId, (UUID) null);
    }

    private FileUploadResponse getFile(UUID fileId, UUID requestedUserId ){
            if(azureStorageConfig.getAccountName() == null || azureStorageConfig.getAccountKey() == null || azureStorageConfig.getContainerName() == null) {
                throw new IllegalArgumentException("Blob account configurations not found");
            }

            Upload uploadedFileInfo = uploadRepository.findById(fileId).orElse(null);
            if(uploadedFileInfo == null) {
                return new FileUploadResponse(false,"File not found");
            }

            log.info("checking file ownership");
            if(uploadedFileInfo.getIsPublic()==false){
                User requestedUser = userRepository.findById(requestedUserId.toString()).orElse(null);
                if(requestedUser == null) {
                    return new FileUploadResponse(false,"Unautherized");
                }
                if(requestedUser.getId()!=uploadedFileInfo.getOwnerId() || !requestedUser.getRole().equals(UserRoleEnum.ADMIN)) {
                    return new FileUploadResponse(false,"Only file owner and admins can access the private files");
                }

                log.info("File ownership verified");
            }

            log.info("Trying to get file from Azure Blob Storage");
            try {
                URI StorageContainer = new URI(
                        azureStorageConfig.getSslEnabled() ? "https:" : "http:" +
                                "//" +
                                azureStorageConfig.getHost() +
                                ":" +
                                azureStorageConfig.getPort() +
                                "/devstoreaccount1/" +
                                azureStorageConfig.getContainerName());

                BlobContainerClient containerClient = new BlobContainerClientBuilder()
                        .endpoint(StorageContainer.toString())
                        .credential(new StorageSharedKeyCredential(azureStorageConfig.getAccountName(), azureStorageConfig.getAccountKey()))
                        .buildClient();

                BlobClient blobClient = containerClient.getBlobClient(uploadedFileInfo.getUrl());
                if(!blobClient.exists()) {
                    log.warning("File not found in blob storage: " + blobClient.getBlobUrl());
                    return new FileUploadResponse(false,"File not found");
                }
                log.info("File found in Azure Blob Storage: " + blobClient.getBlobUrl());

                BinaryData binaryData =  blobClient.downloadContent();

                return new FileUploadResponse(true,"File found", binaryData);

            }
            catch(URISyntaxException e){
                log.warning(e.getMessage());
                return new FileUploadResponse(false,"Storage container url invalied: " );
            }
            catch (Exception e) {
                log.warning(e.getMessage());
                return new FileUploadResponse(false, "File upload failed: ");
            }

    }

    private static String byteArrayToHex(byte[] bytes) {
        try (Formatter formatter = new Formatter()) {
            for (byte b : bytes) {
                formatter.format("%02x", b);
            }
            return formatter.toString();
        }
    }

    private static FileTypeEnum getFileType(String contentType) {
        if(contentType == null) {
            return FileTypeEnum.Unknown;
        }
        contentType = contentType.split("/").length>1?contentType.split("/")[1].toLowerCase():contentType.toLowerCase();
        log.info("getting FileType for: "+contentType);
          for(FileTypeEnum type : FileTypeEnum.values()) {
              log.info("Checking for: "+type.toString());
              if(contentType.equals(type.toString().toLowerCase())) {
                  return type;
              }
          }
            log.warning("Unknown file type: "+contentType);
            return FileTypeEnum.Unknown;
    }

}
