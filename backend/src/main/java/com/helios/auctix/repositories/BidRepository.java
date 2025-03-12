package com.example.biddingapp.repository;

import com.example.biddingapp.entity.Bid;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BidRepository extends CrudRepository<Bid, Long> {

}