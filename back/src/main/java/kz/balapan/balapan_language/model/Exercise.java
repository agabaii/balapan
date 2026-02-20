package kz.balapan.balapan_language.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.List;

@Entity
@Table(name = "exercises", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "lesson_id", "exercise_number" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = false)
    @JsonBackReference("lesson-exercises")
    private Lesson lesson;

    @Column(name = "exercise_number", nullable = false)
    private Integer exerciseNumber;

    @Column(name = "exercise_type", nullable = false, length = 30)
    private String exerciseType;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "question_audio_url")
    private String questionAudioUrl;

    @Column(name = "correct_answer", nullable = false, columnDefinition = "TEXT")
    private String correctAnswer;

    @Column(name = "difficulty")
    private Integer difficulty = 1;

    @OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL)
    @JsonManagedReference("exercise-options")
    private List<ExerciseOption> options;

    @Column(name = "mappings", columnDefinition = "TEXT")
    private String mappings; // JSON: {"word": "translation"}
}