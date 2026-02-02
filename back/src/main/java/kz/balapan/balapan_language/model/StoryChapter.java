// back/src/main/java/kz/balapan/balapan_language/model/StoryChapter.java
package kz.balapan.balapan_language.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.List;

@Entity
@Table(name = "story_chapters")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoryChapter {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "story_id", nullable = false)
    @JsonBackReference("story-chapters")
    private Story story;
    
    @Column(name = "chapter_number", nullable = false)
    private Integer chapterNumber;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String textKk; // Текст на казахском
    
    @Column(columnDefinition = "TEXT")
    private String textRu; // Перевод на русский
    
    @Column(name = "audio_url")
    private String audioUrl;
    
    @Column(name = "character_name")
    private String characterName; // Имя персонажа говорящего
    
    @Column(name = "character_image_url")
    private String characterImageUrl;
    
    @OneToMany(mappedBy = "chapter", cascade = CascadeType.ALL)
    @JsonManagedReference("chapter-questions")
    @OrderBy("questionNumber ASC")
    private List<StoryQuestion> questions;
}