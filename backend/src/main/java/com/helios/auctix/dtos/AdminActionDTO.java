package com.helios.auctix.dtos;


import com.azure.json.implementation.jackson.core.JsonToken;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.helios.auctix.domain.user.AdminAction;
import com.helios.auctix.domain.user.AdminActionsEnum;
import com.helios.auctix.domain.user.UserRoleEnum;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class AdminActionDTO {

    @JsonIgnore
    private UUID id;
    private UUID adminId;
    private String adminUsername;
    private String adminEmail;
    private String adminFirstName;
    private String adminLastName;
    private UserRoleEnum adminRole;
    private UUID adminProfilePhotoId;

    private UUID userId;
    private String userUsername;
    private String userEmail;
    private String userFirstName;
    private String userLastName;
    private UserRoleEnum userRole;
    private UUID userProfilePhotoId;

    private AdminActionsEnum activityType;
    private String description;
    private LocalDateTime createdAt;



}