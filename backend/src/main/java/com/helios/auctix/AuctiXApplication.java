package com.helios.auctix;

import com.helios.auctix.domain.notification.NotificationCategory;
import com.helios.auctix.domain.user.User;
import com.helios.auctix.events.notification.NotificationEventPublisher;
import com.helios.auctix.repositories.NotificationRepository;
import com.helios.auctix.repositories.UserRepository;
import com.helios.auctix.services.user.UserRegisterService;
import lombok.extern.java.Log;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.helios.auctix.domain.auction.Auction;
import com.helios.auctix.repositories.AuctionRepository; // Add this
import com.helios.auctix.services.AuctionService; // Add this
import org.springframework.scheduling.annotation.EnableScheduling;

import java.time.LocalDateTime;

@SpringBootApplication
@Log
@EnableScheduling
public class AuctiXApplication implements CommandLineRunner {

	private final UserRepository userRepository;
	private final NotificationEventPublisher notificationEventPublisher;
	private final AuctionRepository auctionRepository; // Add this
	private final AuctionService auctionService; // Add this
	private final UserRegisterService userRegisterService;

	public AuctiXApplication(
			UserRepository userRepository,
			NotificationRepository notificationRepository,
			NotificationEventPublisher notificationEventPublisher,
			AuctionRepository auctionRepository, // Add this
			AuctionService auctionService, // Add this
			UserRegisterService userRegisterService
	) {
		this.userRepository = userRepository;
		this.notificationEventPublisher = notificationEventPublisher;
		this.auctionRepository = auctionRepository; // Add this
        this.auctionService = auctionService; // Add this
		this.userRegisterService = userRegisterService;
	}

	public static void main(String[] args) {
		SpringApplication.run(AuctiXApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		userRegisterService.registerSupperAdmin();
		log.info("AuctiX backend started successfully!");

		// Existing code for user and notification modules
		// Uncomment and use as needed

//        System.out.println("Starting application...");
//        userRepository.findAll().forEach(user -> {
//            System.out.println("User info: " + user.toString());
//        });
//
//        System.out.println("Test if notifications can be fetched");
//        notificationRepository.findAll().forEach(notification -> {
//            System.out.println("Notification: " + notification.toString());
//        });
//
//        User user = User.builder()
//                .id("01")
//                .username("Jake")
//                .email("jake@example.com")
//                .passwordHash("sdljfdsf")
//                .build();
//
//        userRepository.save(user);

//		User user = userRepository.findByEmail("testb1@test.com");
//
//		notificationEventPublisher.publishNotificationEvent(
//				"Hi from AuctiX",
//				"Hello this is test email",
//				NotificationCategory.DEFAULT,
//				user
//        );


		// Add initialization logic for Bidding module

//		initializeSampleAuctions();

//	}

		// Method to initialize sample auctions (optional)
//		private void initializeSampleAuctions() {
//			System.out.println("Initializing sample auctions...");
//
//			Auction auction1 = Auction.builder()
//					.title("Vintage Camera")
//					.description("A rare vintage camera from the 1950s.")
//					.startingPrice(100.0)
//					.startTime(LocalDateTime.now())
//					.endTime(LocalDateTime.now().plusDays(7))
//					.isPublic(true)
//					.category("electronics")
//					.createdAt(LocalDateTime.now())
//					.updatedAt(LocalDateTime.now())
//					.build();
//
//			Auction auction2 = Auction.builder()
//					.title("Antique Watch")
//					.description("An antique watch from the 1920s.")
//					.startingPrice(200.0)
//					.startTime(LocalDateTime.now())
//					.endTime(LocalDateTime.now().plusDays(7))
//					.isPublic(true)
//					.category("fashion")
//					.createdAt(LocalDateTime.now())
//					.updatedAt(LocalDateTime.now())
//					.build();
//
//			auctionRepository.save(auction1);
//			auctionRepository.save(auction2);
//
//			System.out.println("Sample auctions initialized:");
//			auctionRepository.findAll().forEach(auction -> {
//				System.out.println("Auction: " + auction.toString());
//			});
//		}
	}
}