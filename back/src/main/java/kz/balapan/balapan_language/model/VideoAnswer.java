package kz.balapan.balapan_language.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "video_answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    @JsonBackReference("video-question-answers")
    private VideoQuestion question;

    @Column(name = "answer_text", nullable = false)
    private String answerText;

    @Column(name = "answer_text_kk")
    private String answerTextKk;

    @Column(name = "answer_text_ru")
    private String answerTextRu;

    @Column(name = "answer_text_en")
    private String answerTextEn;

    @Column(name = "answer_order")
    private Integer answerOrder;

    @Column(name = "is_correct")
    private Boolean isCorrect = false;
}
