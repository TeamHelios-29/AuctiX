package com.helios.auctix;

import com.helios.auctix.domain.user.User;
import com.helios.auctix.domain.notification.NotificationCategory;
import com.helios.auctix.events.notification.NotificationEventPublisher;
import com.helios.auctix.repositories.NotificationRepository;
import com.helios.auctix.repositories.UserRepository;
import com.helios.auctix.events.notification.NotificationEventPublisher;
import lombok.extern.java.Log;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@Log
public class AuctiXApplication implements CommandLineRunner {

	private final UserRepository userRepository;
//	private final NotificationRepository notificationRepository;
	private final NotificationEventPublisher notificationEventPublisher;

	public AuctiXApplication(UserRepository userRepository, NotificationRepository notificationRepository, NotificationEventPublisher notificationEventPublisher) {
		this.userRepository = userRepository;
//		this.notificationRepository = notificationRepository;
        this.notificationEventPublisher = notificationEventPublisher;
    }

	public static void main(String[] args) {
		SpringApplication.run(AuctiXApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception{

//		System.out.println("Starting aplication...");
//		userRepository.findAll().forEach(abc->{
//			System.out.println("user info: " + abc.toString());
//		});
//
//
//		System.out.println("Test if notifications can be fetched");
//		notificationRepository.findAll().forEach( n -> {
//			System.out.println("Notificaiton " + n.toString());
//		});

//		User user = User.builder()
//				.id("01")
//				.username("Jake")
//				.email("jake@example.com")
//				.passwordHash("sdljfdsf")
//				.build();

//		userRepository.save(user);

		// notificationEventPublisher.publishNotificationEvent(
		// 		"Hi from AuctiX",
		// 	"Hello this is test email",
		// 			NotificationCategory.DEFAULT,
		// 			user
		// );

//	    User u = userRepository.findByEmail("tom2@test.com");
//
//		log.info("User found: " + u.toString());
//		System.out.println("User found-: " + u.toString());


	}

}
