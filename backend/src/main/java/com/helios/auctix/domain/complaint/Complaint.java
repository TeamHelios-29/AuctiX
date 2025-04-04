package com.helios.auctix.domain.complaint;

import com.helios.auctix.domain.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "complaints")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "reported_user_id", referencedColumnName = "id", nullable = false)
    private User reportedUser;

    @ManyToOne
    @JoinColumn(name = "reported_by_id", referencedColumnName = "id", nullable = false)
    private User reportedBy;

    @NotBlank
    @Column(length = 1000)
    private String reason;

    @NotNull
    private LocalDateTime dateReported;

    @Enumerated(EnumType.STRING)
    private ComplaintStatus status;

}

