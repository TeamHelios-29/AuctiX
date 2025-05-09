package com.helios.auctix.services.fileUpload;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobContainerClientBuilder;
import com.azure.storage.common.StorageSharedKeyCredential;
import com.helios.auctix.config.AzureStorageConfig;
import com.helios.auctix.domain.upload.Upload;
import com.helios.auctix.repositories.UploadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Limit;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.List;
import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class FileUploadDeleteService {

    private final UploadRepository uploadRepository;
    private final AzureStorageConfig azureStorageConfig;
    private static final Logger log = Logger.getLogger(FileUploadDeleteService.class.getName());

    /**
     * Scheduled task to delete all files marked as isDeleted = true.
     * This method runs periodically based on the cron expression.
     */
    @Scheduled(cron = "10 32 21 * * ?")
    public void deleteMarkedFiles() {
        log.info("Starting scheduled task to delete marked files");

        // Fetch all files marked as isDeleted = true
        List<Upload> deletedFiles = uploadRepository.findByIsDeleted(true, Limit.of(100));

        for (Upload file : deletedFiles) {
            try {
                log.info("Deleting file: " + file.getFileId());
                // Delete the file from Azure Blob Storage
                URI StorageContainer = azureStorageConfig.getStorageContainerURI();

                BlobContainerClient containerClient = new BlobContainerClientBuilder()
                        .endpoint(StorageContainer.toString())
                        .credential(new StorageSharedKeyCredential(azureStorageConfig.getAccountName(), azureStorageConfig.getAccountKey()))
                        .buildClient();

                // check whether the file is used as another upload
                Integer count = uploadRepository.countByFileId(file.getFileId());
                if(count > 1) {
                    log.warning("File is still in another upload, not deleting file:" + file.getFileId());
                }
                else{
                    BlobClient blobClient = containerClient.getBlobClient(file.getFileId().toString());

                    if (blobClient.exists()) {
                        blobClient.delete();
                        log.info("File deleted from Azure Blob Storage: " + file.getFileId());
                    }
                }

                // Remove the file record from the database
                uploadRepository.delete(file);
                log.info("File record deleted from database: " + file.getId());
            } catch (Exception e) {
                log.warning("Failed to delete file: " + file.getFileId() + ". Error: " + e.getMessage());
            }
        }

        log.info("Scheduled task to delete marked files completed");
    }


}
