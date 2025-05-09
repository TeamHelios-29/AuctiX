package com.helios.auctix.mappers.impl;


import com.helios.auctix.domain.user.UserRole;
import com.helios.auctix.domain.user.UserRoleEnum;
import com.helios.auctix.dtos.UserRoleDTO;
import com.helios.auctix.mappers.Mapper;
import com.helios.auctix.repositories.UserRoleRepository;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

@Log4j2
@Component
@AllArgsConstructor
public class UserRoleMapperImpl implements Mapper<UserRole, UserRoleDTO> {

    private final UserRoleRepository userRoleRepository;

    @Override
    public UserRoleDTO mapTo(UserRole userRole) {
        if (userRole == null) {
            return null;
        }

        UserRoleDTO userRoleDTO = new UserRoleDTO();
        userRoleDTO.setUserRole(userRole.getName().name());
        return userRoleDTO;
    }

    @Override
    public UserRole mapFrom(UserRoleDTO userRoleDTO) {
        if (userRoleDTO == null) {
            return null;
        }
        UserRoleEnum userRoleEnum = UserRoleEnum.valueOf(userRoleDTO.getUserRole());
        UserRole userRole = userRoleRepository.findByName(userRoleEnum);
        return userRole;
    }
}
