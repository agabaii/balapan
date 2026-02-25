package kz.balapan.balapan_language.repository;

import kz.balapan.balapan_language.model.LessonContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface LessonContentRepository extends JpaRepository<LessonContent, Long> {
    Optional<LessonContent> findByLessonId(Long lessonId);
}
