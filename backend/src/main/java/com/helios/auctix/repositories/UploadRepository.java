package com.helios.auctix.repositories;

import com.helios.auctix.domain.upload.Upload;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UploadRepository extends JpaRepository<Upload, UUID> {
}
