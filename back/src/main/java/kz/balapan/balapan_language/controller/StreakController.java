// back/src/main/java/kz/balapan/balapan_language/controller/StreakController.java
package kz.balapan.balapan_language.controller;

import kz.balapan.balapan_language.model.DailyActivity;
import kz.balapan.balapan_language.service.StreakService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/streak")
public class StreakController {
    
    @Autowired
    private StreakService streakService;
    
    /**
     * Получить статистику streak пользователя
     * GET /api/streak/stats/{userId}
     */
    @GetMapping("/stats/{userId}")
    public ResponseEntity<Map<String, Object>> getStreakStats(@PathVariable Long userId) {
        try {
            Map<String, Object> stats = streakService.getStreakStats(userId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    /**
     * Получить календарь активности
     * GET /api/streak/calendar/{userId}?days=30
     */
    @GetMapping("/calendar/{userId}")
    public ResponseEntity<List<DailyActivity>> getActivityCalendar(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "30") int days) {
        try {
            List<DailyActivity> activities = streakService.getActivityCalendar(userId, days);
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Вручную обновить streak (для тестирования)
     * POST /api/streak/update/{userId}
     */
    @PostMapping("/update/{userId}")
    public ResponseEntity<?> updateStreak(@PathVariable Long userId) {
        try {
            streakService.updateStreak(userId);
            Map<String, Object> stats = streakService.getStreakStats(userId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "stats", stats
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
}