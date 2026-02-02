package kz.balapan.balapan_language.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.List;

@Entity
@Table(name = "levels", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"course_id", "level_number"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Level {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    @JsonBackReference("course-levels")
    private Course course;
    
    @Column(name = "level_number", nullable = false)
    private Integer levelNumber;
    
    @Column(nullable = false, length = 100)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "required_xp")
    private Integer requiredXp = 100;
    
    @OneToMany(mappedBy = "level", cascade = CascadeType.ALL)
    @JsonManagedReference("level-lessons")
    private List<Lesson> lessons;
}