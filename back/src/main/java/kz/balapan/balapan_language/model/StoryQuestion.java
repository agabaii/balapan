// back/src/main/java/kz/balapan/balapan_language/model/StoryQuestion.java
package kz.balapan.balapan_language.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.List;

@Entity
@Table(name = "story_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoryQuestion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "chapter_id", nullable = false)
    @JsonBackReference("chapter-questions")
    private StoryChapter chapter;
    
    @Column(name = "question_number", nullable = false)
    private Integer questionNumber;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String questionText;
    
    @Column(name = "question_type")
    private String questionType; // multiple_choice, true_false, fill_blank
    
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    @JsonManagedReference("question-answers")
    @OrderBy("answerOrder ASC")
    private List<StoryAnswer> answers;
    
    @Column(name = "correct_answer_id")
    private Long correctAnswerId;
}