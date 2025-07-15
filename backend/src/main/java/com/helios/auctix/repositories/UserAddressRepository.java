package com.helios.auctix.repositories;

import com.helios.auctix.domain.user.User;
import com.helios.auctix.domain.user.UserAddress;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress,UUID> {
}
