// back/src/main/java/kz/balapan/balapan_language/model/VideoLesson.java
package kz.balapan.balapan_language.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "video_lessons")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoLesson {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 200)
    private String title;
    
    @Column(name = "title_kk", length = 200)
    private String titleKk;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "youtube_url", nullable = false)
    private String youtubeUrl; // Полная ссылка или ID
    
    @Column(name = "youtube_id")
    private String youtubeId; // Только ID для embed
    
    @Column(name = "difficulty_level", nullable = false)
    private String difficultyLevel; // beginner, intermediate, advanced
    
    @Column(name = "duration_minutes")
    private Integer durationMinutes;
    
    @Column(name = "xp_reward")
    private Integer xpReward = 30;
    
    @Column(name = "order_number")
    private Integer orderNumber; // Порядок в списке
    
    @Column(name = "thumbnail_url")
    private String thumbnailUrl;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}