// back/src/main/java/kz/balapan/balapan_language/controller/ProgressController.java
package kz.balapan.balapan_language.controller;

import kz.balapan.balapan_language.model.UserProgress;
import kz.balapan.balapan_language.service.ProgressService;
import kz.balapan.balapan_language.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {
    
    @Autowired
    private ProgressService progressService;
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/complete")
    public ResponseEntity<?> completeLesson(@RequestBody Map<String, Object> request) {
        try {
            System.out.println("=== COMPLETE LESSON REQUEST ===");
            System.out.println("Request body: " + request);
            
            Long userId = Long.parseLong(request.get("userId").toString());
            Long lessonId = Long.parseLong(request.get("lessonId").toString());
            int correctAnswers = Integer.parseInt(request.get("correctAnswers").toString());
            int totalQuestions = Integer.parseInt(request.get("totalQuestions").toString());
            int xpEarned = Integer.parseInt(request.getOrDefault("xpEarned", 20).toString());
            
            System.out.println("Parsed values:");
            System.out.println("userId: " + userId);
            System.out.println("lessonId: " + lessonId);
            System.out.println("correctAnswers: " + correctAnswers);
            System.out.println("totalQuestions: " + totalQuestions);
            System.out.println("xpEarned: " + xpEarned);
            
            // Сохраняем прогресс (теперь с xpEarned для streak)
            System.out.println("Saving progress with streak update...");
            UserProgress progress = progressService.completeLesson(userId, lessonId, correctAnswers, totalQuestions, xpEarned);
            System.out.println("Progress saved: " + progress.getId());
            
            // Добавляем XP
            System.out.println("Adding XP...");
            userService.addXp(userId, xpEarned);
            System.out.println("XP added");
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("progress", progress);
            response.put("xpEarned", xpEarned);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("ERROR in completeLesson: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserProgress>> getUserProgress(@PathVariable Long userId) {
        List<UserProgress> progress = progressService.getUserProgress(userId);
        return ResponseEntity.ok(progress);
    }
    
    @GetMapping("/check/{userId}/{lessonId}")
    public ResponseEntity<Map<String, Boolean>> checkLessonCompleted(
            @PathVariable Long userId, 
            @PathVariable Long lessonId) {
        boolean completed = progressService.isLessonCompleted(userId, lessonId);
        return ResponseEntity.ok(Map.of("completed", completed));
    }
}