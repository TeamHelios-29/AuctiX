package com.helios.auctix;

import lombok.extern.java.Log;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import javax.sql.DataSource;

@SpringBootApplication
@Log
public class AuctiXApplication {

	private final DataSource dataSource;

	public AuctiXApplication(final DataSource dataSource) {
		this.dataSource = dataSource;
	}

	public static void main(String[] args) {
		SpringApplication.run(AuctiXApplication.class, args);
	}

}
