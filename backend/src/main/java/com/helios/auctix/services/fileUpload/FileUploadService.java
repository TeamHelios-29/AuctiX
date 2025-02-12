package com.helios.auctix.services.fileUpload;

import com.helios.auctix.services.ResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Formatter;
import java.util.UUID;

public class FileUploadService {
    private static final String BASE_DIR = "uploads/";

    public ResponseDTO uploadFile(MultipartFile file,String upload_dir) {
        try {
            Path uploadPath = Paths.get(BASE_DIR+upload_dir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] filebytes = file.getBytes();
            byte[] digestmsg = digest.digest(filebytes);
            String sha256 = byteArrayToHex(digestmsg);
            String fileName = UUID.nameUUIDFromBytes(digestmsg).toString();
            Path filePath = uploadPath.resolve(fileName);
            Files.write(filePath,filebytes );

            return new ResponseDTO("File uploaded: " + file.getOriginalFilename() +"\n path: "+uploadPath.toString()+"\n name: "+fileName+"\n sha-256: "+sha256+"\n ext: "+file.getContentType(),true);
        }
        catch (NoSuchAlgorithmException e) {
            return new ResponseDTO("File upload failed: " + e.getMessage(),false);
        }
        catch (IOException e) {
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

}
