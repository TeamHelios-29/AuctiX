package com.helios.auctix.dtos;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ProfileUpdateDataDTO {
    private String bio;
    private List<String> urls;
    private String firstName;
    private String lastName;
    private UserAddressDTO address;

}