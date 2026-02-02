// back/src/main/java/kz/balapan/balapan_language/repository/UserProgressRepository.java
package kz.balapan.balapan_language.repository;

import kz.balapan.balapan_language.model.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    
    Optional<UserProgress> findByUserIdAndLessonId(Long userId, Long lessonId);
    
    List<UserProgress> findByUserIdAndIsCompleted(Long userId, Boolean isCompleted);
    
    List<UserProgress> findByUserId(Long userId);
    
    long countByUserIdAndIsCompleted(Long userId, Boolean isCompleted);
}