package com.helios.auctix.dtos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class BidderDTO {
    @JsonIgnore
    private UUID id;  // Add this
    private String name;
    private String avatar;
    private Boolean isActive;
}
