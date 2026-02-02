// back/src/main/java/kz/balapan/balapan_language/model/UserStoryProgress.java
package kz.balapan.balapan_language.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_story_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "story_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStoryProgress {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"passwordHash", "createdAt", "lastLogin"})
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "story_id", nullable = false)
    @JsonIgnoreProperties({"chapters"})
    private Story story;
    
    @Column(name = "is_completed")
    private Boolean isCompleted = false;
    
    @Column(name = "current_chapter")
    private Integer currentChapter = 1;
    
    @Column(name = "correct_answers")
    private Integer correctAnswers = 0;
    
    @Column(name = "total_questions")
    private Integer totalQuestions = 0;
    
    @Column(name = "completion_percentage")
    private Integer completionPercentage = 0;
    
    @Column(name = "started_at")
    private LocalDateTime startedAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @PrePersist
    protected void onCreate() {
        if (startedAt == null) {
            startedAt = LocalDateTime.now();
        }
    }
}