package com.helios.auctix.services.user;

import com.helios.auctix.domain.user.*;
import com.helios.auctix.repositories.SellerRepository;
import com.helios.auctix.repositories.SellerVerificationRequestRepository;
import com.helios.auctix.services.fileUpload.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SellerService {

    private final SellerRepository sellerRepository;
    private final SellerVerificationRequestRepository sellerVerificationRequestRepository;
    private final FileUploadService fileUploadService;

    public SellerVerificationStatusEnum submitSellerVerifications(User user, MultipartFile[] files) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        Seller seller = user.getSeller();
        if (seller == null) {
            throw new IllegalArgumentException("Seller cannot be null");
        }

        // upload Files
        // validate file count
        if(files.length == 0 || files.length >5){
            throw new UploadedFileCountMaxLimitExceedException("Uploaded file count is too large. submit less than 6 documents");
        }

        // validate file size
        for (MultipartFile file : files) {
            int filesize = (int)file.getSize()/(1024*1024);
            if (filesize > 5) {
                throw new UploadedFileSizeMaxLimitExceedException("file size is greater than 5MB");
            }
        }

        // upload files
        List<SellerVerificationRequest> submitedReqs = new ArrayList<>();
        for (MultipartFile file : files) {
            FileUploadResponse res = fileUploadService.uploadFile(file, FileUploadUseCaseEnum.VERIFICATION_DOCUMENT, seller.getId(), false);
            if(!res.isSuccess()){
                throw new RuntimeException("Upload failed");
            }

            SellerVerificationRequest sellerVerificationRequest = SellerVerificationRequest.builder()
                    .seller(seller)
                    .description("no review notes")
                    .verificationStatus(SellerVerificationStatusEnum.PENDING)
                    .build();

            submitedReqs.add(sellerVerificationRequest);

        }

        sellerVerificationRequestRepository.saveAll(submitedReqs);


//            SellerVerificationRequest verifyRequest = sellerVerificationRequestRepository.findById(UUID.fromString("5acdb56d-4269-4414-9ebe-8ea39a4af9a5")).orElse(null);

//        SellerVerificationDocs docs = sellerVerificationDocsRepository.findById(UUID.fromString("2d9ff3b0-4f4e-40f7-b8fb-4c4c09dde8df"));

//        log.info("seller verification Status: {}",seller.toString());

        return SellerVerificationStatusEnum.NO_VERIFICATION_REQUESTED;

    }

    public SellerVerificationStatusEnum sellerVerifiedStatus(User currentUser) {
        if (currentUser == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        Seller seller = currentUser.getSeller();
        if (seller == null) {
            throw new IllegalArgumentException("Seller cannot be null");
        }

        SellerVerificationStatusEnum status = SellerVerificationStatusEnum.NO_VERIFICATION_REQUESTED;
        List<SellerVerificationRequest> requests = sellerVerificationRequestRepository.findAllBySellerId(seller.getId());

        for (var request:requests) {
            if (request.getVerificationStatus().ordinal() == SellerVerificationStatusEnum.APPROVED.ordinal() && status.ordinal() < request.getVerificationStatus().ordinal()) {
                status = SellerVerificationStatusEnum.APPROVED;
            } else if (request.getVerificationStatus().ordinal() == SellerVerificationStatusEnum.PENDING.ordinal() && status.ordinal() < request.getVerificationStatus().ordinal()) {
                status = SellerVerificationStatusEnum.PENDING;
            } else if (request.getVerificationStatus().ordinal() == SellerVerificationStatusEnum.REJECTED.ordinal() && status.ordinal() < request.getVerificationStatus().ordinal()) {
                status = SellerVerificationStatusEnum.REJECTED;
            }
        }
        return status;
    }

    public List<SellerVerificationRequest> getSellerVerificationRequests(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        Seller seller = user.getSeller();
        if (seller == null) {
            throw new IllegalArgumentException("Seller cannot be null");
        }

        return sellerVerificationRequestRepository.findAllBySellerId(seller.getId());
    }
}
