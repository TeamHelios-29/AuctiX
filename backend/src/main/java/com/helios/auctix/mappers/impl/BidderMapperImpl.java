package com.helios.auctix.mappers.impl;

import com.helios.auctix.domain.user.Bidder;
import com.helios.auctix.dtos.BidderDTO;
import com.helios.auctix.mappers.Mapper;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

@Log4j2
@Component
public class BidderMapperImpl implements Mapper<Bidder, BidderDTO> {

    @Override
    public BidderDTO mapTo(Bidder bidder) {
        if (bidder == null) {
            return null;
        }

        BidderDTO bidderDTO = new BidderDTO();
        bidderDTO.setId(bidder.getId());
        bidderDTO.setIsActive(bidder.isActive());
        return bidderDTO;
    }

    @Override
    public Bidder mapFrom(BidderDTO bidderDTO) {
        if (bidderDTO == null) {
            return null;
        }

        return Bidder.builder()
                .id(bidderDTO.getId())
                .isActive(bidderDTO.getIsActive())
                .build();
    }
}