package com.helios.auctix.repositories;

import com.helios.auctix.domain.user.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends CrudRepository<User,String> {

    boolean existsById(UUID Id);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    User findByEmail(String email);

}
