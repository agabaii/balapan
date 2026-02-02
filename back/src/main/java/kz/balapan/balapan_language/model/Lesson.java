package kz.balapan.balapan_language.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.List;

@Entity
@Table(name = "lessons", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"level_id", "lesson_number"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lesson {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "level_id", nullable = false)
    @JsonBackReference("level-lessons")
    private Level level;
    
    @Column(name = "lesson_number", nullable = false)
    private Integer lessonNumber;
    
    @Column(nullable = false, length = 100)
    private String title;
    
    @Column(name = "lesson_type", nullable = false, length = 20)
    private String lessonType;
    
    @Column(name = "xp_reward")
    private Integer xpReward = 10;
    
    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL)
    @JsonManagedReference("lesson-exercises")
    private List<Exercise> exercises;
    
    @OneToOne(mappedBy = "lesson", cascade = CascadeType.ALL)
    @JsonManagedReference("lesson-content")
    private LessonContent content;
}