// back/src/main/java/kz/balapan/balapan_language/repository/VideoLessonRepository.java
package kz.balapan.balapan_language.repository;

import kz.balapan.balapan_language.model.VideoLesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VideoLessonRepository extends JpaRepository<VideoLesson, Long> {
    List<VideoLesson> findByIsActiveTrueOrderByOrderNumber();

    List<VideoLesson> findByDifficultyLevelAndIsActiveTrueOrderByOrderNumber(String difficultyLevel);

    List<VideoLesson> findByLanguageAndIsActiveTrueOrderByOrderNumber(String language);

    List<VideoLesson> findByLanguageAndDifficultyLevelAndIsActiveTrueOrderByOrderNumber(String language,
            String difficultyLevel);
}