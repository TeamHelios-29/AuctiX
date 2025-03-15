package com.helios.auctix.repositories;

import com.helios.auctix.domain.upload.Upload;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UploadRepository extends JpaRepository<Upload, Long> {
}
