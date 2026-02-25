package kz.balapan.balapan_language.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "native_language", length = 10)
    private String nativeLanguage = "ru";

    @Column(name = "current_streak")
    private Integer currentStreak = 0;

    @Column(name = "longest_streak")
    private Integer longestStreak = 0;

    @Column(name = "total_xp")
    private Integer totalXp = 0;

    @Column(name = "gems")
    private Integer gems = 500;

    @Column(name = "streak_freezes")
    private Integer streakFreezes = 0;

    @Column(name = "unlocked_items", columnDefinition = "TEXT")
    private String unlockedItems = "";

    @Column(name = "avatar_data", columnDefinition = "TEXT")
    private String avatarData;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;

    @Column(name = "verification_code")
    private String verificationCode;

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    @Column(name = "is_banned")
    private Boolean isBanned = false;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}