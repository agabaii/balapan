// back/src/main/java/kz/balapan/balapan_language/service/ProgressService.java
package kz.balapan.balapan_language.service;

import kz.balapan.balapan_language.model.*;
import kz.balapan.balapan_language.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProgressService {

    @Autowired
    private UserProgressRepository progressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private StreakService streakService;

    @Transactional
    public UserProgress completeLesson(Long userId, Long lessonId, int correctAnswers, int totalQuestions,
            int xpEarned) {
        @SuppressWarnings("null")
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        @SuppressWarnings("null")
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        // Находим или создаем прогресс
        UserProgress progress = progressRepository.findByUserIdAndLessonId(userId, lessonId)
                .orElse(new UserProgress());

        boolean isFirstCompletion = !progress.getIsCompleted();

        progress.setUser(user);
        progress.setLesson(lesson);
        progress.setIsCompleted(true);
        progress.setCorrectAnswers(correctAnswers);
        progress.setTotalQuestions(totalQuestions);

        if (totalQuestions > 0) {
            progress.setScore((correctAnswers * 100) / totalQuestions);
        } else {
            progress.setScore(100);
        }

        progress.setCompletedAt(LocalDateTime.now());

        System.out.println("Saving progress for user " + userId + " lesson " + lessonId + " isCompleted: "
                + progress.getIsCompleted());
        UserProgress savedProgress = progressRepository.save(progress);

        // Gem Rewards
        int gemsToAward = 0;
        if (isFirstCompletion) {
            gemsToAward = (progress.getScore() >= 100) ? 5 : 2;
        } else {
            gemsToAward = 1; // 1 gem for repeating a lesson
        }

        int currentGems = user.getGems() != null ? user.getGems() : 0;
        user.setGems(currentGems + gemsToAward);
        userRepository.save(user);

        // Записываем ежедневную активность
        // При первом прохождении даем полное XP, при последующих только 3 XP за
        // повторение
        int xpToRecord = isFirstCompletion ? xpEarned : 3;

        int exercisesCount = lesson.getExercises() != null ? lesson.getExercises().size() : 0;
        streakService.recordDailyActivity(userId, xpToRecord, isFirstCompletion ? 1 : 0, exercisesCount);

        return savedProgress;
    }

    public List<UserProgress> getUserProgress(Long userId) {
        return progressRepository.findByUserId(userId);
    }

    public boolean isLessonCompleted(Long userId, Long lessonId) {
        Optional<UserProgress> progress = progressRepository.findByUserIdAndLessonId(userId, lessonId);
        return progress.isPresent() && progress.get().getIsCompleted();
    }

    public long getCompletedLessonsCount(Long userId) {
        return progressRepository.countByUserIdAndIsCompleted(userId, true);
    }
}