package com.helios.auctix.dtos.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPreferenceUpdateDto {
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