package kz.balapan.balapan_language.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_video_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "video_lesson_id"})
})
@Data
@NoArgsConstructor
public class UserVideoProgress {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"passwordHash", "createdAt", "lastLogin"})
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "video_lesson_id", nullable = false)
    @JsonIgnoreProperties({"createdAt"})
    private VideoLesson videoLesson;
    
    @Column(name = "is_completed")
    private Boolean isCompleted = false;
    
    @Column(name = "correct_answers")
    private Integer correctAnswers = 0;
    
    @Column(name = "total_questions")
    private Integer totalQuestions = 0;
    
    // 🟢 Добавляем это поле
    @Column(name = "watch_time_seconds")
    private Integer watchTimeSeconds = 0;

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
