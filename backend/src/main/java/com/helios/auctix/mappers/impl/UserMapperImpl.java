package com.helios.auctix.mappers.impl;

import com.helios.auctix.domain.upload.Upload;
import com.helios.auctix.domain.user.*;
import com.helios.auctix.dtos.AdminDTO;
import com.helios.auctix.dtos.UploadDTO;
import com.helios.auctix.dtos.UserDTO;
import com.helios.auctix.dtos.UserRoleDTO;
import com.helios.auctix.mappers.Mapper;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;

@Log4j2
@Component
@AllArgsConstructor
public class UserMapperImpl implements Mapper<User, UserDTO> {

    private final AdminMapperImpl adminMapper;
    private final BidderMapperImpl bidderMapper;
    private final SellerMapperImpl sellerMapper;
    private final UserRoleMapperImpl userRoleMapper;
    private final UploadMapperImpl uploadMapper;
    private final UserAddresseMapperImpl userAddressMapper;

    @Override
    public UserDTO mapTo(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
//        userDTO.setProfileComplete(user.isProfileComplete());

        UserRole userRole = user.getRole();
        if (userRole != null) {
            UserRoleDTO userRoleDTO = new UserRoleDTO();
            userRoleDTO.setUserRole(userRole.getName().name());
            userDTO.setUserRole(userRoleDTO);
        } else {
            userDTO.setUserRole(null);
        }

        Upload upload = user.getUpload();
        if (upload != null) {
            UploadDTO uploadDTO = uploadMapper.mapTo(upload);
            userDTO.setProfilePicture(uploadDTO);
        } else {
            userDTO.setProfilePicture(null);
        }

        Admin admin = user.getAdmin();
        if (admin != null) {
            AdminDTO adminDTO = adminMapper.mapTo(admin);
            userDTO.setAdmin(adminDTO);
        } else {
            userDTO.setAdmin(null);
        }

        Bidder bidder = user.getBidder();
        if (bidder != null) {
            userDTO.setBidder(bidderMapper.mapTo(bidder));
        } else {
            userDTO.setBidder(null);
        }

        Seller seller = user.getSeller();
        if (seller != null) {
            userDTO.setSeller(sellerMapper.mapTo(seller));
        } else {
            userDTO.setSeller(null);
        }

        UserAddress userAddress = user.getUserAddress();
        if (userAddress != null) {
            userDTO.setUserAddress(userAddressMapper.mapTo(userAddress));
        } else {
            userDTO.setUserAddress(null);
        }

        return userDTO;
    }

    @Override
    public User mapFrom(UserDTO userDTO) {

        Admin admin = adminMapper.mapFrom(userDTO.getAdmin());
        Bidder bidder = bidderMapper.mapFrom(userDTO.getBidder());
        Seller seller = sellerMapper.mapFrom(userDTO.getSeller());
        UserRole userRole = userRoleMapper.mapFrom(userDTO.getUserRole());
        Upload upload = uploadMapper.mapFrom(userDTO.getProfilePicture());
        UserAddress userAddress = userAddressMapper.mapFrom(userDTO.getUserAddress());

        return User.builder()
                .username(userDTO.getUsername())
                .email(userDTO.getEmail())
                .firstName(userDTO.getFirstName())
                .lastName(userDTO.getLastName())
//                .isProfileComplete(userDTO.isProfileComplete())
                .role(userRole)
                .admin(admin)
                .bidder(bidder)
                .seller(seller)
                .upload(upload)
                .userAddress(userAddress)
                .build();
    }

}
