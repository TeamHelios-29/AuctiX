package com.helios.auctix.services;

import com.helios.auctix.domain.auction.Auction;
import com.helios.auctix.domain.auction.Bid;
import com.helios.auctix.domain.notification.NotificationCategory;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.domain.watchlist.AuctionWatchList;
import com.helios.auctix.dtos.AuctionDetailsDTO;
import com.helios.auctix.dtos.BidDTO;
import com.helios.auctix.dtos.UserDTO;
import com.helios.auctix.dtos.WatchListAuctionDTO;
import com.helios.auctix.events.notification.BulkNotificationPublisher;
import com.helios.auctix.repositories.AuctionRepository;
import com.helios.auctix.repositories.AuctionWatchListRepository;
import com.helios.auctix.repositories.BidRepository;
import com.helios.auctix.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WatchListService {

    private final AuctionWatchListRepository watchRepo;
    private final AuctionRepository auctionRepo;
    private final UserRepository userRepo;
    private final AuctionService auctionService;
    private final BidRepository bidRepository;

    public boolean isWatchedByUser(User user, UUID auctionId) {
        Optional<Auction> auctionOpt = auctionRepo.findById(auctionId);
        if (auctionOpt.isEmpty()) {
            return false;
        }
        return watchRepo.existsByUserAndAuction(user, auctionOpt.get());
    }

    @Transactional
    public void subscribe(UUID userId, UUID auctionId) {
        User user = userRepo.findById(userId).orElseThrow();
        Auction auction = auctionRepo.findById(auctionId).orElseThrow();

        if (!watchRepo.existsByUserAndAuction(user, auction)) {
            AuctionWatchList watch = AuctionWatchList.builder()
                    .user(user)
                    .auction(auction)
                    .build();
            watchRepo.save(watch);
        }
    }

    @Transactional
    public void unsubscribe(UUID userId, UUID auctionId) {
        User user = userRepo.findById(userId).orElseThrow();
        Auction auction = auctionRepo.findById(auctionId).orElseThrow();

        watchRepo.findByUserAndAuction(user, auction).ifPresent(watchRepo::delete);
    }

    @Transactional(readOnly = true)
    public Page<WatchListAuctionDTO> getWatchList(UUID userId, String search, Pageable pageable) {
        Page<AuctionWatchList> watched = watchRepo.findWatchedAuctionsWithSearch(userId, search, pageable);

        return watched.map(wl -> {
            Auction auction = wl.getAuction();

            AuctionDetailsDTO auctionDetailsDTO = auctionService.convertToDTO(auction);

            BidDTO currentHighestBid = auctionDetailsDTO.getCurrentHighestBid();
            UUID currentHighestBidderId = currentHighestBid != null ? currentHighestBid.getBidderId() : null;
            double currentHighestBidAmount = currentHighestBid != null ? currentHighestBid.getAmount() : 0.0;

            Optional<Bid> userBidOpt = bidRepository.findTopByAuctionIdAndBidderIdOrderByAmountDesc(
                    auction.getId(), userId
            );

            Bid userBid = userBidOpt.orElse(null);
            Double userBidAmount = userBid != null ? userBid.getAmount() : null;

            boolean isOutbid = userBidAmount != null && userBidAmount < currentHighestBidAmount;

            boolean isHighestBidder = userBid != null &&
                    currentHighestBidderId != null &&
                    currentHighestBidderId.equals(userId);

            return WatchListAuctionDTO.builder()
                    .auction(auctionDetailsDTO)
                    .isOutbid(isOutbid)
                    .isHighestBidder(isHighestBidder)
                    .userBidAmount(userBidAmount)
                    .build();
        });

    }
}
