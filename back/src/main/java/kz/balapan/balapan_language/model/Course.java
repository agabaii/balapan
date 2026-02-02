package kz.balapan.balapan_language.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "target_language_id", nullable = false)
    private Language targetLanguage;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "language_code", nullable = false, length = 20)
    private String languageCode;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "level_count")
    private Integer levelCount = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    @JsonManagedReference("course-levels")
    private List<Level> levels;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}