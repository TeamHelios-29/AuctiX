package com.helios.auctix;

import com.helios.auctix.domain.user.User;
import com.helios.auctix.domain.notification.NotificationCategory;
import com.helios.auctix.events.notification.NotificationEventPublisher;
import com.helios.auctix.repositories.NotificationRepository;
import com.helios.auctix.repositories.UserRepository;
import com.helios.auctix.repositories.BidRepository; // Add this
import com.helios.auctix.services.BidService; // Add this
import com.helios.auctix.domain.bid.Bid; // Add this
import lombok.extern.java.Log;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.time.LocalDateTime;

@SpringBootApplication
@Log
public class AuctiXApplication implements CommandLineRunner {

	private final UserRepository userRepository;
	private final NotificationEventPublisher notificationEventPublisher;
	private final BidRepository bidRepository; // Add this
	private final BidService bidService; // Add this

	public AuctiXApplication(
			UserRepository userRepository,
			NotificationRepository notificationRepository,
			NotificationEventPublisher notificationEventPublisher,
			BidRepository bidRepository, // Add this
			BidService bidService // Add this
	) {
		this.userRepository = userRepository;
		this.notificationEventPublisher = notificationEventPublisher;
		this.bidRepository = bidRepository; // Add this
		this.bidService = bidService; // Add this
	}

	public static void main(String[] args) {
		SpringApplication.run(AuctiXApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// Existing code for user and notification modules
		// Uncomment and use as needed
        /*
        System.out.println("Starting application...");
        userRepository.findAll().forEach(user -> {
            System.out.println("User info: " + user.toString());
        });

        System.out.println("Test if notifications can be fetched");
        notificationRepository.findAll().forEach(notification -> {
            System.out.println("Notification: " + notification.toString());
        });

        User user = User.builder()
                .id("01")
                .username("Jake")
                .email("jake@example.com")
                .passwordHash("sdljfdsf")
                .build();

        userRepository.save(user);

        notificationEventPublisher.publishNotificationEvent(
                "Hi from AuctiX",
                "Hello this is test email",
                NotificationCategory.DEFAULT,
                user
        );

        User u = userRepository.findByEmail("tom2@test.com");
        log.info("User found: " + u.toString());
        System.out.println("User found: " + u.toString());
        */

		// Add initialization logic for Bidding module
		initializeSampleBids();
	}

	// Method to initialize sample bids (optional)
//	private void initializeSampleBids() {
//		System.out.println("Initializing sample bids...");
//
//		Bid bid1 = Bid.builder()
//				.amount(100.0)
//				.bidTime(LocalDateTime.now())
//				.createdAt(LocalDateTime.now())
//				.updatedAt(LocalDateTime.now())
//				.build();
//
//		Bid bid2 = Bid.builder()
//				.amount(200.0)
//				.bidTime(LocalDateTime.now())
//				.createdAt(LocalDateTime.now())
//				.updatedAt(LocalDateTime.now())
//				.build();
//
//		bidRepository.save(bid1);
//		bidRepository.save(bid2);
//
//		System.out.println("Sample bids initialized:");
//		bidRepository.findAll().forEach(bid -> {
//			System.out.println("Bid: " + bid.toString());
//		});
	}
}