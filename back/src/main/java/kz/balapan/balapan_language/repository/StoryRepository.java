// back/src/main/java/kz/balapan/balapan_language/repository/StoryRepository.java
package kz.balapan.balapan_language.repository;

import kz.balapan.balapan_language.model.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {
    
    List<Story> findByIsActiveTrue();
    
    List<Story> findByDifficultyLevelAndIsActiveTrue(String difficultyLevel);
    
    List<Story> findByCategoryAndIsActiveTrue(String category);
    
    List<Story> findByDifficultyLevelAndCategoryAndIsActiveTrue(String difficultyLevel, String category);
}