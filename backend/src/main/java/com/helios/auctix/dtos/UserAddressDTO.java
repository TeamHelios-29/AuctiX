package com.helios.auctix.dtos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserAddressDTO {
    @JsonIgnore
    private UUID id;
    private String addressNumber;
    private String addressLine1;
    private String addressLine2;
    private String country;
}
