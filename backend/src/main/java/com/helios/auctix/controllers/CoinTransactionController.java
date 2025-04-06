package com.helios.auctix.controllers;

import com.helios.auctix.dtos.TransactionResponseDTO;
import com.helios.auctix.services.CoinTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/coins")
public class CoinTransactionController {

    private final CoinTransactionService transactionService;

    @Autowired
    public CoinTransactionController(CoinTransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/process-transaction/{transactionId}")
    public ResponseEntity<?> processTransaction(@PathVariable Long transactionId) {
        try {
            TransactionResponseDTO transaction = transactionService.processTransaction(transactionId);
            return ResponseEntity.ok(transaction);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing transaction: " + e.getMessage());
        }
    }

    @GetMapping("/transaction-history")
    public ResponseEntity<?> getTransactionHistory(@RequestParam("userId") UUID userId) {
        try {
            List<TransactionResponseDTO> transactions = transactionService.getTransactionHistory(userId);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching transaction history: " + e.getMessage());
        }
    }
}
