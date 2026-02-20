package kz.balapan.balapan_language.repository;

import kz.balapan.balapan_language.model.UserVocabularyProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface UserVocabularyRepository extends JpaRepository<UserVocabularyProgress, Long> {
    List<UserVocabularyProgress> findByUserId(Long userId);

    @Query("SELECT v FROM UserVocabularyProgress v WHERE v.user.id = :userId AND (v.nextReviewAt <= :now OR v.nextReviewAt IS NULL)")
    List<UserVocabularyProgress> findDueForReview(Long userId, LocalDateTime now);
}
