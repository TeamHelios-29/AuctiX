package com.helios.auctix.mappers.impl;

import com.helios.auctix.domain.upload.Upload;
import com.helios.auctix.domain.user.*;
import com.helios.auctix.dtos.AdminActionDTO;
import com.helios.auctix.dtos.AdminDTO;
import com.helios.auctix.dtos.UserDTO;
import com.helios.auctix.mappers.Mapper;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Log4j2
@Component
public class AdminActionMapperImpl implements Mapper<AdminAction, AdminActionDTO> {


    @Override
    public AdminActionDTO mapTo(AdminAction adminAction) {
        if (adminAction == null) {
            return null;
        }

        User admin = adminAction.getAdmin().getUser();
        User user = adminAction.getUser();

        return AdminActionDTO.builder()
                .id(adminAction.getId())
                .adminId(adminAction.getAdmin().getId())
                .adminUsername(admin.getUsername())
                .adminEmail(admin.getEmail())
                .adminFirstName(admin.getFirstName())
                .adminLastName(admin.getLastName())
                .adminRole(admin.getRoleEnum())
                .adminProfilePhotoId(admin.getUpload() != null ? admin.getUpload().getId(): null)

                .userId(user.getId())
                .userUsername(user.getUsername())
                .userEmail(user.getEmail())
                .userFirstName(user.getFirstName())
                .userLastName(user.getLastName())
                .userRole(user.getRoleEnum())
                .userProfilePhotoId(user.getUpload() != null ? user.getUpload().getId(): null)


                .activityType(adminAction.getActivityType())
                .description(adminAction.getDescription())
                .createdAt(adminAction.getCreatedAt() != null ? adminAction.getCreatedAt() : null)

                .build();
    }

    @Override
    public AdminAction mapFrom(AdminActionDTO adminActionDTO) {
        if (adminActionDTO == null) {
            return null;
        }

        UserRole userRole = UserRole.builder().name(adminActionDTO.getUserRole()).build();
        UserRole adminRole = UserRole.builder().name(adminActionDTO.getAdminRole()).build();

Admin admin = Admin.builder()
                  .id(adminActionDTO.getAdminId())
                  .user(User.builder()
                          .id(adminActionDTO.getAdminId())
                          .username(adminActionDTO.getAdminUsername())
                          .email(adminActionDTO.getAdminEmail())
                          .firstName(adminActionDTO.getAdminFirstName())
                          .lastName(adminActionDTO.getAdminLastName())
                          .role(adminRole)
                          .upload(
                                  Upload.builder()
                                          .id(adminActionDTO.getAdminProfilePhotoId() != null ? adminActionDTO.getAdminProfilePhotoId() : null)
                                          .build()
                          )
                          .build())
                  .build();

        User user = User.builder()
                .id(adminActionDTO.getUserId())
                .username(adminActionDTO.getUserUsername())
                .email(adminActionDTO.getUserEmail())
                .firstName(adminActionDTO.getUserFirstName())
                .lastName(adminActionDTO.getUserLastName())
                .role(userRole)
                .upload(
                        Upload.builder()
                                .id(adminActionDTO.getUserProfilePhotoId() != null ? adminActionDTO.getUserProfilePhotoId(): null)
                                .build()
                )
                .build();

        return AdminAction.builder()
                .id(adminActionDTO.getId())
                .admin(admin)
                .user(user)
                .build();
    }
}
