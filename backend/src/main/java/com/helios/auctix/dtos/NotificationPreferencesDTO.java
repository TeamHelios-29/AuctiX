package com.helios.auctix.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationPreferencesDTO {
    private Map<String, Boolean> global;
    private Map<String, Map<String, Boolean>> events;
}

/*
{
  "global": {
    "EMAIL": true,
    "PUSH": true
  },
  "events": {
    "PROMO": {
      "EMAIL": true,
      "PUSH": false
    },
    "BID_WIN": {
      "EMAIL": false,
      "PUSH": true
    }
  }
}

 */