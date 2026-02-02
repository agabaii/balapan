package kz.balapan.balapan_language.repository;

import kz.balapan.balapan_language.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    Optional<Course> findByLanguageCode(String languageCode);
    
    List<Course> findAllByOrderByCreatedAtDesc();
}