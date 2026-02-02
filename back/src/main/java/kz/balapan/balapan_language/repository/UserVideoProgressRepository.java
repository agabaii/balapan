// back/src/main/java/kz/balapan/balapan_language/repository/UserVideoProgressRepository.java
package kz.balapan.balapan_language.repository;

import kz.balapan.balapan_language.model.UserVideoProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserVideoProgressRepository extends JpaRepository<UserVideoProgress, Long> {
    Optional<UserVideoProgress> findByUserIdAndVideoLessonId(Long userId, Long videoLessonId);
    List<UserVideoProgress> findByUserId(Long userId);
    long countByUserIdAndIsCompleted(Long userId, Boolean isCompleted);
}