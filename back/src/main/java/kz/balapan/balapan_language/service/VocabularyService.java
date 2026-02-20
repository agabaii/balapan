package kz.balapan.balapan_language.service;

import kz.balapan.balapan_language.model.UserVocabularyProgress;
import kz.balapan.balapan_language.repository.UserVocabularyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class VocabularyService {

    @Autowired
    private UserVocabularyRepository vocabularyRepository;

    public List<UserVocabularyProgress> getDueReviews(Long userId) {
        return vocabularyRepository.findDueForReview(userId, LocalDateTime.now());
    }

    @Transactional
    public void recordResult(Long progressId, boolean success) {
        if (progressId == null)
            throw new IllegalArgumentException("Id cannot be null");
        UserVocabularyProgress progress = vocabularyRepository.findById(progressId)
                .orElseThrow(() -> new RuntimeException("Progress not found"));

        if (success) {
            progress.setSuccessCount(progress.getSuccessCount() + 1);
            progress.setSrsLevel(Math.min(progress.getSrsLevel() + 1, 5));
        } else {
            progress.setFailCount(progress.getFailCount() + 1);
            progress.setSrsLevel(Math.max(progress.getSrsLevel() - 1, 1));
        }

        // Calculate next review time based on level
        int hours = (int) Math.pow(2, progress.getSrsLevel()) * 12; // Level 1: 24h, Level 2: 48h, Level 3: 96h...
        progress.setNextReviewAt(LocalDateTime.now().plusHours(hours));
        progress.setLastReviewedAt(LocalDateTime.now());

        vocabularyRepository.save(progress);
    }
}
