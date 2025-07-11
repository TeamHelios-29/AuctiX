package com.helios.auctix.services;

import com.helios.auctix.domain.auction.Auction;
import com.helios.auctix.domain.delivery.Delivery;
import com.helios.auctix.domain.delivery.DeliveryStatus;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.domain.user.UserAddress;
import com.helios.auctix.domain.user.UserRoleEnum;
import com.helios.auctix.dtos.DeliveryCreateDTO;
import com.helios.auctix.dtos.DeliveryDTO;
import com.helios.auctix.dtos.DeliveryUpdateDTO;
import com.helios.auctix.repositories.AuctionRepository;
import com.helios.auctix.repositories.DeliveryRepository;
import com.helios.auctix.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final AuctionRepository auctionRepository;
    private final UserRepository userRepository;
    private static final Logger logger = Logger.getLogger(DeliveryService.class.getName());

    @Transactional
    public DeliveryDTO createDelivery(DeliveryCreateDTO createDTO, User currentUser) {
        logger.info("Creating delivery for auction: " + createDTO.getAuctionId());

        Auction auction = auctionRepository.findById(createDTO.getAuctionId())
                .orElseThrow(() -> new IllegalArgumentException("Auction not found"));

        // Check if current user is the seller of the auction
        if (!auction.getSeller().getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("Only the seller can create a delivery for this auction");
        }

        // Check if auction is completed and has a winning bid
        if (auction.getWinningBidId() == null) {
            throw new IllegalArgumentException("Cannot create delivery for an auction without a winning bid");
        }

        // Find the buyer (either specified or from the winning bid)
        User buyer;
        if (createDTO.getBuyerId() != null) {
            buyer = userRepository.findById(createDTO.getBuyerId())
                    .orElseThrow(() -> new IllegalArgumentException("Buyer not found"));
        } else {
            // Get buyer from the winning bid
            throw new IllegalArgumentException("Buyer ID is required");
        }

        // Parse delivery date
        LocalDate deliveryDate;
        try {
            deliveryDate = LocalDate.parse(createDTO.getDeliveryDate(), DateTimeFormatter.ISO_DATE);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid delivery date format. Use YYYY-MM-DD");
        }

        // Create delivery entity
        Delivery delivery = Delivery.builder()
                .auction(auction)
                .seller(currentUser)
                .buyer(buyer)
                .deliveryDate(deliveryDate)
                .status(DeliveryStatus.PACKING)
                .deliveryAddress(createDTO.getDeliveryAddress())
                .notes(createDTO.getNotes())
                .amount(auction.getStartingPrice()) // Use the auction price
                .build();

        delivery = deliveryRepository.save(delivery);

        return mapToDTO(delivery);
    }

    public List<DeliveryDTO> getAllDeliveriesForUser(User user) {
        logger.info("Fetching all deliveries for user: " + user.getId());

        List<Delivery> deliveries = deliveryRepository.findAllByUser(user.getId());

        return deliveries.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<DeliveryDTO> getAllDeliveriesForSeller(User seller) {
        logger.info("Fetching all deliveries for seller: " + seller.getId());

        // Check if user is a seller
        if (seller.getRoleEnum() != UserRoleEnum.SELLER &&
                seller.getRoleEnum() != UserRoleEnum.ADMIN &&
                seller.getRoleEnum() != UserRoleEnum.SUPER_ADMIN) {
            throw new IllegalArgumentException("User is not a seller");
        }

        List<Delivery> deliveries = deliveryRepository.findBySellerId(seller.getId());

        return deliveries.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<DeliveryDTO> getAllDeliveriesForBuyer(User buyer) {
        logger.info("Fetching all deliveries for buyer: " + buyer.getId());

        List<Delivery> deliveries = deliveryRepository.findByBuyerId(buyer.getId());

        return deliveries.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public DeliveryDTO getDeliveryById(UUID id, User currentUser) {
        logger.info("Fetching delivery by ID: " + id);

        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found"));

        // Check if user is buyer or seller of the delivery
        boolean isAuthorized = delivery.getBuyer().getId().equals(currentUser.getId()) ||
                delivery.getSeller().getId().equals(currentUser.getId()) ||
                currentUser.getRoleEnum() == UserRoleEnum.ADMIN ||
                currentUser.getRoleEnum() == UserRoleEnum.SUPER_ADMIN;

        if (!isAuthorized) {
            throw new IllegalArgumentException("You are not authorized to view this delivery");
        }

        return mapToDTO(delivery);
    }

    @Transactional
    public DeliveryDTO updateDelivery(UUID id, DeliveryUpdateDTO updateDTO, User currentUser) {
        logger.info("Updating delivery: " + id);

        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found"));

        // Check if user is seller of the delivery or admin
        boolean isAuthorized = delivery.getSeller().getId().equals(currentUser.getId()) ||
                currentUser.getRoleEnum() == UserRoleEnum.ADMIN ||
                currentUser.getRoleEnum() == UserRoleEnum.SUPER_ADMIN;

        if (!isAuthorized) {
            throw new IllegalArgumentException("Only the seller or admin can update this delivery");
        }

        // Update delivery date if provided
        if (updateDTO.getDeliveryDate() != null && !updateDTO.getDeliveryDate().isEmpty()) {
            try {
                LocalDate deliveryDate = LocalDate.parse(updateDTO.getDeliveryDate(), DateTimeFormatter.ISO_DATE);
                delivery.setDeliveryDate(deliveryDate);
            } catch (Exception e) {
                throw new IllegalArgumentException("Invalid delivery date format. Use YYYY-MM-DD");
            }
        }

        // Update status if provided
        if (updateDTO.getStatus() != null && !updateDTO.getStatus().isEmpty()) {
            try {
                DeliveryStatus status = DeliveryStatus.valueOf(updateDTO.getStatus().toUpperCase());
                delivery.setStatus(status);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid delivery status");
            }
        }

        // Update other fields if provided
        if (updateDTO.getDeliveryAddress() != null) {
            delivery.setDeliveryAddress(updateDTO.getDeliveryAddress());
        }

        if (updateDTO.getNotes() != null) {
            delivery.setNotes(updateDTO.getNotes());
        }

        if (updateDTO.getTrackingNumber() != null) {
            delivery.setTrackingNumber(updateDTO.getTrackingNumber());
        }

        delivery = deliveryRepository.save(delivery);

        return mapToDTO(delivery);
    }

    @Transactional
    public DeliveryDTO updateDeliveryStatus(UUID id, DeliveryStatus status, User currentUser) {
        logger.info("Updating delivery status to " + status + " for delivery: " + id);

        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found"));

        // Check if user is seller of the delivery or admin
        boolean isAuthorized = delivery.getSeller().getId().equals(currentUser.getId()) ||
                currentUser.getRoleEnum() == UserRoleEnum.ADMIN ||
                currentUser.getRoleEnum() == UserRoleEnum.SUPER_ADMIN;

        if (!isAuthorized) {
            throw new IllegalArgumentException("Only the seller or admin can update this delivery status");
        }

        // Update status
        delivery.setStatus(status);
        delivery = deliveryRepository.save(delivery);

        return mapToDTO(delivery);
    }

    @Transactional
    public DeliveryDTO updateDeliveryDate(UUID id, String dateStr, User currentUser) {
        logger.info("Updating delivery date for delivery: " + id);

        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found"));

        // Check if user is seller of the delivery or admin
        boolean isAuthorized = delivery.getSeller().getId().equals(currentUser.getId()) ||
                currentUser.getRoleEnum() == UserRoleEnum.ADMIN ||
                currentUser.getRoleEnum() == UserRoleEnum.SUPER_ADMIN;

        if (!isAuthorized) {
            throw new IllegalArgumentException("Only the seller or admin can update this delivery date");
        }

        // Parse and update delivery date
        try {
            LocalDate deliveryDate = LocalDate.parse(dateStr, DateTimeFormatter.ISO_DATE);
            delivery.setDeliveryDate(deliveryDate);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid delivery date format. Use YYYY-MM-DD");
        }

        delivery = deliveryRepository.save(delivery);

        return mapToDTO(delivery);
    }

    @Transactional
    public void deleteDelivery(UUID id, User currentUser) {
        logger.info("Deleting delivery: " + id);

        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found"));

        // Check if user is seller of the delivery or admin
        boolean isAuthorized = delivery.getSeller().getId().equals(currentUser.getId()) ||
                currentUser.getRoleEnum() == UserRoleEnum.ADMIN ||
                currentUser.getRoleEnum() == UserRoleEnum.SUPER_ADMIN;

        if (!isAuthorized) {
            throw new IllegalArgumentException("Only the seller or admin can delete this delivery");
        }

        deliveryRepository.delete(delivery);
    }

    // Helper method to map Delivery entity to DeliveryDTO
    private DeliveryDTO mapToDTO(Delivery delivery) {
        DeliveryDTO dto = DeliveryDTO.builder()
                .id(delivery.getId())
                .auctionId(delivery.getAuction().getId())
                .auctionTitle(delivery.getAuction().getTitle())
                .sellerId(delivery.getSeller().getId())
                .sellerName(delivery.getSeller().getUsername())
                .buyerId(delivery.getBuyer().getId())
                .buyerName(delivery.getBuyer().getUsername())
                .deliveryDate(delivery.getDeliveryDate())
                .status(delivery.getStatus().name())
                .deliveryAddress(delivery.getDeliveryAddress())
                .notes(delivery.getNotes())
                .amount(delivery.getAmount())
                .trackingNumber(delivery.getTrackingNumber())
                .createdAt(delivery.getCreatedAt())
                .updatedAt(delivery.getUpdatedAt())
                .build();

        // Try to get buyer location from user address if available
        UserAddress buyerAddress = delivery.getBuyer().getUserAddress();
        if (buyerAddress != null) {
            dto.setBuyerLocation(buyerAddress.getCity() + ", " + buyerAddress.getCountry());
        }

        // Try to get auction image if available
        if (delivery.getAuction().getImagePaths() != null && !delivery.getAuction().getImagePaths().isEmpty()) {
            dto.setAuctionImage(delivery.getAuction().getImagePaths().get(0).toString());
        }

        // Get auction category if available
        dto.setAuctionCategory(delivery.getAuction().getCategory());

        return dto;
    }
}