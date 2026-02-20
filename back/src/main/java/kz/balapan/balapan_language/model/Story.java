// back/src/main/java/kz/balapan/balapan_language/model/Story.java
package kz.balapan.balapan_language.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "stories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Story {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "title_ru", length = 200)
    private String titleRu; // Название на русском

    @Column(name = "title_en", length = 200)
    private String titleEn; // Название на английском

    @Column(name = "title_kk", length = 200)
    private String titleKk; // Название на казахском

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String descriptionRu;

    @Column(columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(name = "difficulty_level", nullable = false)
    private String difficultyLevel; // beginner, intermediate, advanced

    @Column(name = "estimated_time")
    private Integer estimatedTime; // в минутах

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    @Column(name = "xp_reward")
    private Integer xpReward = 30;

    @Column(name = "category")
    private String category; // culture, daily_life, history, etc.

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "language", length = 20)
    private String language = "kazakh";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "story", cascade = CascadeType.ALL)
    @JsonManagedReference("story-chapters")
    @OrderBy("chapterNumber ASC")
    private List<StoryChapter> chapters;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}