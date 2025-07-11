package com.helios.auctix.repositories;

import com.helios.auctix.domain.user.User;
import com.helios.auctix.dtos.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface UserRepository extends CrudRepository<User,UUID> {
    boolean existsById(UUID Id);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    User findByEmail(String email);
    Page<User> findAll(Pageable pageable);

    User findByUsername(String username);

    long countByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(String search,String search1);

    Page<User> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String username, String email, String firstName, String lastName, Pageable pageable);
}
