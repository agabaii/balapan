// back/src/main/java/kz/balapan/balapan_language/repository/UserStoryProgressRepository.java
package kz.balapan.balapan_language.repository;

import kz.balapan.balapan_language.model.UserStoryProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserStoryProgressRepository extends JpaRepository<UserStoryProgress, Long> {
    
    Optional<UserStoryProgress> findByUserIdAndStoryId(Long userId, Long storyId);
    
    List<UserStoryProgress> findByUserId(Long userId);
    
    List<UserStoryProgress> findByUserIdAndIsCompleted(Long userId, Boolean isCompleted);
    
    long countByUserIdAndIsCompleted(Long userId, Boolean isCompleted);
}