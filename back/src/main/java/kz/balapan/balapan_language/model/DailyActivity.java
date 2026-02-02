// back/src/main/java/kz/balapan/balapan_language/model/DailyActivity.java
package kz.balapan.balapan_language.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDate;

@Entity
@Table(name = "daily_activities", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "activity_date"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyActivity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"passwordHash", "createdAt", "lastLogin"})
    private User user;
    
    @Column(name = "activity_date", nullable = false)
    private LocalDate activityDate;
    
    @Column(name = "lessons_completed")
    private Integer lessonsCompleted = 0;
    
    @Column(name = "xp_earned")
    private Integer xpEarned = 0;
    
    @Column(name = "exercises_completed")
    private Integer exercisesCompleted = 0;
    
    @Column(name = "practice_time_minutes")
    private Integer practiceTimeMinutes = 0;
    
    @PrePersist
    protected void onCreate() {
        if (activityDate == null) {
            activityDate = LocalDate.now();
        }
    }
}