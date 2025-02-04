package com.helios.auctix;

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

	public AuctiXApplication( UserRepository userRepository) {
		this.userRepository = userRepository;
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

	}

}
