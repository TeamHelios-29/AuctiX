package com.helios.auctix.dtos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BidderDTO {
    @JsonIgnore
    private UUID bidderId;
    private Boolean isActive;
}
