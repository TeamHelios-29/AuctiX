package com.helios.auctix.dtos;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.helios.auctix.domain.user.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    @JsonIgnore
    private UUID id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private boolean isProfileComplete;

    private UserRoleDTO userRole;
    private UploadDTO profilePicture;

    private AdminDTO admin;
    private BidderDTO bidder;
    private SellerDTO seller;
    private UserAddressDTO userAddress;

}
