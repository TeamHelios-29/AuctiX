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
import org.springframework.data.domain.Pageable;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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

    public boolean isWatchedByUser(User user, Auction auction) {
        return watchRepo.existsByUserAndAuction(user, auction);
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
    public Page<AuctionDetailsDTO> getWatchedAuctions(UUID userId, Pageable pageable) {
        return watchRepo.findAllByUser_Id(userId, pageable)
                .map(AuctionWatchList::getAuction)
                .map(this::toDto);
    }

    private AuctionDetailsDTO toDto(Auction auction) {
       return auctionService.convertToDTO(auction);
    }
}
