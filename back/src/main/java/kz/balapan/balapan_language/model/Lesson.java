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
        @UniqueConstraint(columnNames = { "level_id", "lesson_number" })
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

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "title_ru", length = 200)
    private String titleRu;

    @Column(name = "title_kk", length = 200)
    private String titleKk;

    @Column(name = "title_en", length = 200)
    private String titleEn;

    @Column(name = "lesson_icon", length = 100)
    private String lessonIcon;

    @Column(name = "lesson_type", nullable = false, length = 20)
    private String lessonType;

    @Column(name = "xp_reward")
    private Integer xpReward = 10;

    @Column(name = "linked_video_id")
    private Long linkedVideoId;

    @Column(name = "linked_story_id")
    private Long linkedStoryId;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL)
    @JsonManagedReference("lesson-exercises")
    private List<Exercise> exercises;

    @OneToOne(mappedBy = "lesson", cascade = CascadeType.ALL)
    @JsonManagedReference("lesson-content")
    private LessonContent content;
}