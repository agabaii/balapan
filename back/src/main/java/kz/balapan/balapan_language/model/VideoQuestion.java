package kz.balapan.balapan_language.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.List;

@Entity
@Table(name = "video_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "video_lesson_id", nullable = false)
    @JsonBackReference("video-lesson-questions")
    private VideoLesson videoLesson;

    @Column(name = "question_number", nullable = false)
    private Integer questionNumber;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String questionText;

    @Column(name = "question_text_kk", columnDefinition = "TEXT")
    private String questionTextKk;

    @Column(name = "question_text_ru", columnDefinition = "TEXT")
    private String questionTextRu;

    @Column(name = "question_text_en", columnDefinition = "TEXT")
    private String questionTextEn;

    @Column(name = "question_type")
    private String questionType = "multiple_choice";

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    @JsonManagedReference("video-question-answers")
    @OrderBy("answerOrder ASC")
    private List<VideoAnswer> answers;

    @Column(name = "correct_answer_id")
    private Long correctAnswerId;
}
