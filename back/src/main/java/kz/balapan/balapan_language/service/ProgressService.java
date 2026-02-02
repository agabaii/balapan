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
    public UserProgress completeLesson(Long userId, Long lessonId, int correctAnswers, int totalQuestions, int xpEarned) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
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
        
        UserProgress savedProgress = progressRepository.save(progress);
        
        // Записываем ежедневную активность (только при первом прохождении урока)
        if (isFirstCompletion) {
            int exercisesCount = lesson.getExercises() != null ? lesson.getExercises().size() : 0;
            streakService.recordDailyActivity(userId, xpEarned, 1, exercisesCount);
        }
        
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