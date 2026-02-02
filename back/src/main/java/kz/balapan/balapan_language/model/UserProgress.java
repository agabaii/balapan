// back/src/main/java/kz/balapan/balapan_language/model/UserProgress.java
package kz.balapan.balapan_language.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "lesson_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProgress {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"passwordHash", "createdAt", "lastLogin"})
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = false)
    @JsonIgnoreProperties({"level", "exercises", "content"})
    private Lesson lesson;
    
    @Column(name = "is_completed")
    private Boolean isCompleted = false;
    
    @Column(name = "score")
    private Integer score = 0;
    
    @Column(name = "correct_answers")
    private Integer correctAnswers = 0;
    
    @Column(name = "total_questions")
    private Integer totalQuestions = 0;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "started_at")
    private LocalDateTime startedAt;
    
    @PrePersist
    protected void onCreate() {
        if (startedAt == null) {
            startedAt = LocalDateTime.now();
        }
    }
}