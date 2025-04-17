package com.helios.auctix.services.fileUpload;

import com.helios.auctix.domain.upload.FileTypeEnum;
import lombok.experimental.UtilityClass;
import org.springframework.stereotype.Service;

import java.util.Formatter;
import java.util.logging.Logger;

@UtilityClass
public class FileUploadUtilService {

    Logger log = Logger.getLogger(FileUploadUtilService.class.getName());

    protected static String byteArrayToHex(byte[] bytes) {
        try (Formatter formatter = new Formatter()) {
            for (byte b : bytes) {
                formatter.format("%02x", b);
            }
            return formatter.toString();
        }
    }

    protected static FileTypeEnum getFileType(String contentType) {
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
