package com.helios.auctix.mappers.impl;

import com.helios.auctix.domain.user.Admin;
import com.helios.auctix.dtos.AdminDTO;
import com.helios.auctix.mappers.Mapper;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

@Log4j2
@Component
public class AdminMapperImpl implements Mapper<Admin, AdminDTO> {

    @Override
    public AdminDTO mapTo(Admin admin) {
        if (admin == null) {
            return null;
        }

        AdminDTO adminDTO = new AdminDTO();
        adminDTO.setAdminId(admin.getId());
        adminDTO.setIsActive(admin.isActive());
        return adminDTO;
    }

    @Override
    public Admin mapFrom(AdminDTO adminDTO) {
        if (adminDTO == null) {
            return null;
        }

        return Admin.builder()
                .id(adminDTO.getAdminId())
                .isActive(adminDTO.getIsActive())
                .build();
    }
}