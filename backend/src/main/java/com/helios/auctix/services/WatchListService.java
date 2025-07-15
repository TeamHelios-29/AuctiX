package com.helios.auctix.services;

import com.helios.auctix.domain.auction.Auction;
import com.helios.auctix.domain.notification.NotificationCategory;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.domain.watchlist.AuctionWatchList;
import com.helios.auctix.dtos.AuctionDetailsDTO;
import com.helios.auctix.events.notification.BulkNotificationPublisher;
import com.helios.auctix.repositories.AuctionRepository;
import com.helios.auctix.repositories.AuctionWatchListRepository;
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
    private final BulkNotificationPublisher bulkNotificationPublisher;

    /**
     * Notifies all users who have subscribed (watchlisted) the given auction.
     * <p>
     * This method retrieves the list of users watching the auction and publishes
     * a bulk notification event to inform them about updates such as changes in
     * auction status, time, or other important events.
     * <p>
     * The bulk notification event is saved in bulk by NotificationManagerService,
     * and then user preferences are resolved and notifications are sent in parallel.
     *
     * @param auction  the auction whose subscribers should be notified
     * @param title    the title of the notification
     * @param message  the detailed message content to be sent
     * @param category the notification category
     */

    public void notifySubscribers(Auction auction, String title, String message, NotificationCategory category, @Nullable String partialUrl) {
        if (auction == null) {
            throw new IllegalArgumentException("Auction cannot be null");
        }
        
        List<User> users = watchRepo.findUsersByAuction_Id(auction.getId());
        bulkNotificationPublisher.publish(users, title, message, category, partialUrl);
    }

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
    public Page<AuctionDetailsDTO> getWatchedAuctions(UUID userId, String search, Pageable pageable) {
        Page<AuctionWatchList> page;

        if (search != null && !search.trim().isEmpty()) {
            page = watchRepo.findWatchedAuctionsWithSearch(userId, search, pageable);
        } else {
            page = watchRepo.findByUserId(userId, pageable);
        }

        return page.map(wl -> toDto(wl.getAuction()));
    }

    private AuctionDetailsDTO toDto(Auction auction) {
        return auctionService.convertToDTO(auction);
    }
}
