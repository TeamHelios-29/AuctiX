package com.helios.auctix.domain.user;

public enum SellerVerificationStatusEnum {
    NO_VERIFICATION_REQUESTED,
    REJECTED,
    PENDING,
    APPROVED;
    // Value must be ordered, more powerful Status must be at the end
}
