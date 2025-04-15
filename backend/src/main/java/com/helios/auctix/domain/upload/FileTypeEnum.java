package com.helios.auctix.domain.upload;

public enum FileTypeEnum {
    PNG("image/png"),
    JPG("image/jpeg"),
    JPEG("image/jpeg"),
    GIF("image/gif"),
    BMP("image/bmp"),
    SVG("image/svg+xml"),
    ICO("image/x-icon"),
    WEBP("image/webp"),
    ICON("image/vnd.microsoft.icon"),
    PDF("application/pdf"),
    DOC("application/msword"),
    DOCX("application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
    XLS("application/vnd.ms-excel"),
    XLSX("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
    PPT("application/vnd.ms-powerpoint"),
    PPTX("application/vnd.openxmlformats-officedocument.presentationml.presentation"),
    TXT("text/plain"),
    CSV("text/csv"),
    ZIP("application/zip"),
    Unknown("application/octet-stream");

    private final String contentType;

    FileTypeEnum(String contentType) {
        this.contentType = contentType;
    }

    public String getContentType() {
        return contentType;
    }
}