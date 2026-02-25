// back/src/main/java/kz/balapan/balapan_language/service/StreakService.java
package kz.balapan.balapan_language.service;

import kz.balapan.balapan_language.model.DailyActivity;
import kz.balapan.balapan_language.model.User;
import kz.balapan.balapan_language.repository.DailyActivityRepository;
import kz.balapan.balapan_language.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class StreakService {

    @Autowired
    private DailyActivityRepository dailyActivityRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Записывает активность пользователя за сегодня
     */
    @Transactional
    public DailyActivity recordDailyActivity(Long userId, int xpEarned, int lessonsCompleted, int exercisesCompleted) {
        LocalDate today = LocalDate.now();

        // Находим или создаем запись за сегодня
        Optional<DailyActivity> existingActivity = dailyActivityRepository.findByUserIdAndActivityDate(userId, today);

        DailyActivity activity;
        if (existingActivity.isPresent()) {
            activity = existingActivity.get();
            activity.setXpEarned(activity.getXpEarned() + xpEarned);
            activity.setLessonsCompleted(activity.getLessonsCompleted() + lessonsCompleted);
            activity.setExercisesCompleted(activity.getExercisesCompleted() + exercisesCompleted);
        } else {
            @SuppressWarnings("null")
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            activity = new DailyActivity();
            activity.setUser(user);
            activity.setActivityDate(today);
            activity.setXpEarned(xpEarned);
            activity.setLessonsCompleted(lessonsCompleted);
            activity.setExercisesCompleted(exercisesCompleted);
        }

        // Check if daily goal reached (e.g. 50 XP)
        int oldXp = existingActivity.map(DailyActivity::getXpEarned).orElse(0);
        int newXp = oldXp + xpEarned;

        if (oldXp < 50 && newXp >= 50) {
            // Award daily goal bonus gems
            @SuppressWarnings("null")
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                user.setGems((user.getGems() != null ? user.getGems() : 0) + 10);
                userRepository.save(user);
            }
        }

        DailyActivity savedActivity = dailyActivityRepository.save(activity);

        // Обновляем streak
        updateStreak(userId);

        return savedActivity;
    }

    /**
     * Обновляет streak пользователя на основе активности
     */
    @Transactional
    public void updateStreak(Long userId) {
        @SuppressWarnings("null")
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate today = LocalDate.now();
        // Check activity today
        Optional<DailyActivity> todayActivity = dailyActivityRepository.findByUserIdAndActivityDate(userId, today);

        if (!todayActivity.isPresent()) {
            // Нет активности сегодня - streak не меняется
            return;
        }

        // Получаем последние 365 дней активности
        LocalDate yearAgo = today.minusDays(365);
        List<DailyActivity> recentActivities = dailyActivityRepository.findRecentActivities(userId, yearAgo);

        // Подсчитываем текущий streak
        int currentStreak = calculateCurrentStreak(recentActivities, today);

        // Обновляем пользователя
        user.setCurrentStreak(currentStreak);
        if (currentStreak > user.getLongestStreak()) {
            user.setLongestStreak(currentStreak);
        }

        userRepository.save(user);
    }

    /**
     * Вычисляет текущий streak на основе списка активностей
     */
    private int calculateCurrentStreak(List<DailyActivity> activities, LocalDate today) {
        if (activities.isEmpty()) {
            return 0;
        }

        int streak = 0;
        LocalDate checkDate = today;

        // Идем назад по дням и считаем непрерывную последовательность
        for (DailyActivity activity : activities) {
            if (activity.getActivityDate().equals(checkDate)) {
                streak++;
                checkDate = checkDate.minusDays(1);
            } else if (activity.getActivityDate().isBefore(checkDate)) {
                // Пропущен день - streak прервался
                break;
            }
        }

        return streak;
    }

    /**
     * Получает статистику streak пользователя
     */
    public Map<String, Object> getStreakStats(Long userId) {
        @SuppressWarnings("null")
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate today = LocalDate.now();
        LocalDate weekAgo = today.minusDays(7);
        LocalDate monthAgo = today.minusDays(30);

        // Получаем активности за последние 30 дней
        List<DailyActivity> last30Days = dailyActivityRepository.findRecentActivities(userId, monthAgo);

        // Подсчитываем статистику
        long activeDaysThisWeek = dailyActivityRepository.countActiveDays(userId, weekAgo, today);
        long activeDaysThisMonth = dailyActivityRepository.countActiveDays(userId, monthAgo, today);
        Integer xpThisWeek = dailyActivityRepository.getTotalXpInPeriod(userId, weekAgo, today);
        Integer xpThisMonth = dailyActivityRepository.getTotalXpInPeriod(userId, monthAgo, today);

        // Проверяем риск потери streak
        Optional<DailyActivity> todayActivity = dailyActivityRepository.findByUserIdAndActivityDate(userId, today);
        boolean streakAtRisk = !todayActivity.isPresent() && user.getCurrentStreak() > 0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("currentStreak", user.getCurrentStreak());
        stats.put("longestStreak", user.getLongestStreak());
        stats.put("streakAtRisk", streakAtRisk);
        stats.put("activeDaysThisWeek", activeDaysThisWeek);
        stats.put("activeDaysThisMonth", activeDaysThisMonth);
        stats.put("xpThisWeek", xpThisWeek != null ? xpThisWeek : 0);
        stats.put("xpThisMonth", xpThisMonth != null ? xpThisMonth : 0);
        stats.put("xpToday", todayActivity.isPresent() ? todayActivity.get().getXpEarned() : 0);
        stats.put("last30DaysActivity", last30Days);

        return stats;
    }

    /**
     * Получает календарь активности за последние N дней
     */
    public List<DailyActivity> getActivityCalendar(Long userId, int days) {
        LocalDate startDate = LocalDate.now().minusDays(days);
        return dailyActivityRepository.findRecentActivities(userId, startDate);
    }
}