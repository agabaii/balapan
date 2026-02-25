// back/src/main/java/kz/balapan/balapan_language/model/VideoLesson.java
package kz.balapan.balapan_language.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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

    @Column(name = "title_ru", length = 200)
    private String titleRu;

    @Column(name = "title_en", length = 200)
    private String titleEn;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "description_kk", columnDefinition = "TEXT")
    private String descriptionKk;

    @Column(name = "description_ru", columnDefinition = "TEXT")
    private String descriptionRu;

    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;

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

    @Column(name = "language", length = 20)
    private String language = "kk";

    @OneToMany(mappedBy = "videoLesson", cascade = CascadeType.ALL)
    @JsonManagedReference("video-lesson-questions")
    @OrderBy("questionNumber ASC")
    private List<VideoQuestion> questions;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}