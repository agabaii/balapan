package kz.balapan.balapan_language.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "exercise_options")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseOption {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "exercise_id", nullable = false)
    @JsonBackReference("exercise-options")
    private Exercise exercise;
    
    @Column(name = "option_text", nullable = false, columnDefinition = "TEXT")
    private String optionText;
    
    @Column(name = "is_correct")
    private Boolean isCorrect = false;
    
    @Column(name = "option_order", nullable = false)
    private Integer optionOrder;
}