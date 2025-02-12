package com.helios.auctix.repositories;

import com.helios.auctix.domain.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<User,String> {

    User findByEmail(String email);

}
