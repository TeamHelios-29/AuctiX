package com.helios.auctix;

import com.helios.auctix.repositories.NotificationRepository;
import com.helios.auctix.repositories.UserRepository;
import lombok.extern.java.Log;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import javax.sql.DataSource;

@SpringBootApplication
@Log
public class AuctiXApplication implements CommandLineRunner {

	private final UserRepository userRepository;
	private final NotificationRepository notificationRepository;

	public AuctiXApplication( UserRepository userRepository, NotificationRepository notificationRepository) {
		this.userRepository = userRepository;
		this.notificationRepository = notificationRepository;
	}

	public static void main(String[] args) {
		SpringApplication.run(AuctiXApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception{

		System.out.println("Starting aplication...");
		userRepository.findAll().forEach(abc->{
			System.out.println("user info: " + abc.toString());
		});


		System.out.println("Test if notifications can be fetched");
		notificationRepository.findAll().forEach( n -> {
			System.out.println("Notificaiton " + n.toString());
		});



	}

}
