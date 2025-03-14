package com.helios.auctix.services.fileUpload;

import com.helios.auctix.domain.upload.FileTypeEnum;
import com.helios.auctix.domain.upload.Upload;
import com.helios.auctix.repositories.BidderRepository;
import com.helios.auctix.repositories.UploadRepository;
import com.helios.auctix.repositories.UserRepository;
import com.helios.auctix.services.ResponseDTO;
import jdk.jfr.ContentType;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.flogger.Flogger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Formatter;
import java.util.UUID;
import java.util.logging.Logger;

@Service
@RequiredArgsConstructor
public class FileUploadService {
    private static final String BASE_DIR = "uploads/";
    private final UploadRepository uploadRepository;
    private final UserRepository userRepository;

    private Logger log = Logger.getLogger(FileUploadService.class.getName());

    public ResponseDTO uploadFile(MultipartFile file,String upload_dir) {
        try {
            Path uploadPath = Paths.get(BASE_DIR+upload_dir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            log.info("File upload request: "+file.getOriginalFilename());
            FileTypeEnum filetype = getFileType(file.getContentType());
            log.info("File type: "+filetype);
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] filebytes = file.getBytes();
            byte[] digestmsg = digest.digest(filebytes);
            String sha256 = byteArrayToHex(digestmsg);
            log.info("File sha-256: "+sha256);
            String fileName = UUID.nameUUIDFromBytes(digestmsg).toString();
            Path filePath = uploadPath.resolve(fileName);
            Files.write(filePath,filebytes );

            log.info("File writed to: "+filePath.toString());
            log.info("Trying to save file info to database");
            Upload uploadInfo = Upload.builder()
                    .fileName(fileName)
                    .fileSize(file.getSize())
                    .fileType(filetype)
                    .hash256(sha256)
                    .url(filePath.toString())
                    .build();

            uploadRepository.save(uploadInfo);
            log.info("File info saved to database");

            return new ResponseDTO("File uploaded: " + file.getOriginalFilename() +"\n path: "+uploadPath.toString()+"\n name: "+fileName+"\n sha-256: "+sha256+"\n ext: "+file.getContentType(),true);
        }
        catch (NoSuchAlgorithmException e) {
            log.warning(e.getMessage());
            return new ResponseDTO("File upload failed: " + e.getMessage(),false);
        }
        catch (IllegalArgumentException e) {
            log.warning(e.getMessage());
            return new ResponseDTO("File upload failed: " + e.getMessage(),false);
        }
        catch (IOException e) {
            log.warning(e.getMessage());
            return new ResponseDTO("File upload failed: " + e.getMessage(),false);
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
          for(FileTypeEnum type : FileTypeEnum.values()) {
              if(contentType.contains(type.toString())) {
                  return type;
              }
          }
            return FileTypeEnum.Unknown;
    }

}
