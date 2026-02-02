// back/src/main/java/kz/balapan/balapan_language/repository/LessonRepository.java
package kz.balapan.balapan_language.repository;

import kz.balapan.balapan_language.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
}