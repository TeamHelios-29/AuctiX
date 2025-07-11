package com.helios.auctix.domain.complaint;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "complaint_activity")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplaintActivity {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private UUID id;

    @ManyToOne
    private Complaint complaint;

    @Enumerated(EnumType.STRING)
    private ActivityType type;

    private String message;

    private String performedBy;

    private LocalDateTime timestamp;
}
