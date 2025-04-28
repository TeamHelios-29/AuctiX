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

    @PostMapping("/create")
    public ResponseEntity<?> createWallet(@RequestParam("userId") UUID userId) {
        try {
            TransactionResponseDTO walletResponse = transactionService.createWallet(userId);
            return ResponseEntity.ok(walletResponse);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating wallet: " + e.getMessage());
        }
    }

    @PostMapping("/freeze-amount")
    public ResponseEntity<?> freezeAmount(
            @RequestParam("userId") UUID userId,
            @RequestParam("freezeAmount") double freezeAmount) {
        try {
            TransactionResponseDTO response = transactionService.freezeAmount(userId, freezeAmount);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error freezing amount: " + e.getMessage());
        }
    }

    @PostMapping("/process-transaction/{transactionId}")
    public ResponseEntity<?> processTransaction(@PathVariable UUID transactionId) {
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
