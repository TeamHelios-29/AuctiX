package com.helios.auctix.mappers.impl;

import com.helios.auctix.domain.user.UserAddress;
import com.helios.auctix.dtos.UserAddressDTO;
import com.helios.auctix.mappers.Mapper;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

@Log4j2
@Component
@AllArgsConstructor
public class UserAddresseMapperImpl implements Mapper<UserAddress, UserAddressDTO> {

    @Override
    public UserAddress mapFrom(UserAddressDTO userAddressDTO) {
        UserAddress userAddress = UserAddress.builder()
                .id(userAddressDTO.getId())
                .addressNumber(userAddressDTO.getAddressNumber())
                .addressLine1(userAddressDTO.getAddressLine1())
                .addressLine2(userAddressDTO.getAddressLine2())
                .country(userAddressDTO.getCountry())
                .build();
        return userAddress;
    }

    @Override
    public UserAddressDTO mapTo(UserAddress userAddress) {

        UserAddressDTO userAddressDTO = new UserAddressDTO();
        if (userAddress == null) {
            return userAddressDTO;
        }

        userAddressDTO.setId(userAddress.getId());
        userAddressDTO.setAddressNumber(userAddress.getAddressNumber());
        userAddressDTO.setAddressLine1(userAddress.getAddressLine1());
        userAddressDTO.setAddressLine2(userAddress.getAddressLine2());
        userAddressDTO.setCountry(userAddress.getCountry());

        return userAddressDTO;
    }
}
