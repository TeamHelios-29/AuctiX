package com.helios.auctix.dtos;

import com.helios.auctix.domain.user.SellerVerificationStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class VerificationStatusDTO {
    private SellerVerificationStatusEnum status;
    private List<VerificationRequestDTO> submissions;
}
