package kz.balapan.balapan_language.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "lesson_content")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonContent {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "lesson_id", nullable = false)
    @JsonBackReference("lesson-content")
    private Lesson lesson;
    
    @Column(name = "theory_title")
    private String theoryTitle;
    
    @Column(name = "theory_text", columnDefinition = "TEXT")
    private String theoryText;
    
    @Column(name = "grammar_rules", columnDefinition = "TEXT")
    private String grammarRules;
    
    @Column(name = "examples", columnDefinition = "TEXT")
    private String examples;
    
    @Column(name = "tips", columnDefinition = "TEXT")
    private String tips;
    
    @Column(name = "pronunciation_guide", columnDefinition = "TEXT")
    private String pronunciationGuide;
}