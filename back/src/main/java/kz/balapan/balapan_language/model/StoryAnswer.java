// back/src/main/java/kz/balapan/balapan_language/model/StoryAnswer.java
package kz.balapan.balapan_language.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "story_answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoryAnswer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    @JsonBackReference("question-answers")
    private StoryQuestion question;
    
    @Column(name = "answer_text", nullable = false)
    private String answerText;
    
    @Column(name = "answer_order")
    private Integer answerOrder;
    
    @Column(name = "is_correct")
    private Boolean isCorrect = false;
}