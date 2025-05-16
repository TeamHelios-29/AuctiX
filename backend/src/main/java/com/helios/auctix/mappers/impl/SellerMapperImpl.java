package com.helios.auctix.mappers.impl;

import com.helios.auctix.domain.user.Seller;
import com.helios.auctix.dtos.SellerDTO;
import com.helios.auctix.mappers.Mapper;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

@Log4j2
@Component
public class SellerMapperImpl implements Mapper<Seller, SellerDTO> {

    @Override
    public SellerDTO mapTo(Seller seller) {
        if (seller == null) {
            return null;
        }

        SellerDTO sellerDTO = new SellerDTO();
        sellerDTO.setSellerId(seller.getId());
        sellerDTO.setIsVerified(seller.isVerified());
        sellerDTO.setIsActive(seller.isActive());
        sellerDTO.setBannerId(seller.getBannerId());
        return sellerDTO;
    }

    @Override
    public Seller mapFrom(SellerDTO sellerDTO) {
        if (sellerDTO == null) {
            return null;
        }

        return Seller.builder()
                .id(sellerDTO.getSellerId())
                .isVerified(sellerDTO.getIsVerified())
                .isActive(sellerDTO.getIsActive())
                .bannerId(sellerDTO.getBannerId())
                .build();
    }
}