// back/src/main/java/kz/balapan/balapan_language/controller/StoryController.java
package kz.balapan.balapan_language.controller;

import kz.balapan.balapan_language.model.Story;
import kz.balapan.balapan_language.model.UserStoryProgress;
import kz.balapan.balapan_language.service.StoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stories")
public class StoryController {

    @Autowired
    private StoryService storyService;

    /**
     * Получить все активные истории
     * GET /api/stories
     */
    @GetMapping
    public ResponseEntity<List<Story>> getAllStories(@RequestParam(required = false) String language) {
        List<Story> stories = storyService.getAllActiveStories(language);
        return ResponseEntity.ok(stories);
    }

    /**
     * Получить истории по уровню сложности
     * GET /api/stories/difficulty/{level}
     */
    @GetMapping("/difficulty/{level}")
    public ResponseEntity<List<Story>> getStoriesByDifficulty(@PathVariable String level,
            @RequestParam(required = false) String language) {
        List<Story> stories = storyService.getStoriesByDifficulty(level, language);
        return ResponseEntity.ok(stories);
    }

    /**
     * Получить конкретную историю по ID
     * GET /api/stories/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getStoryById(@PathVariable Long id) {
        return storyService.getStoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Начать историю
     * POST /api/stories/start
     */
    @PostMapping("/start")
    public ResponseEntity<?> startStory(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long storyId = request.get("storyId");

            UserStoryProgress progress = storyService.startStory(userId, storyId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("progress", progress);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Ответить на вопрос
     * POST /api/stories/answer
     */
    @PostMapping("/answer")
    public ResponseEntity<?> answerQuestion(@RequestBody Map<String, Long> request) {
        try {
            Long userId = request.get("userId");
            Long storyId = request.get("storyId");
            Long questionId = request.get("questionId");
            Long answerId = request.get("answerId");

            UserStoryProgress progress = storyService.answerQuestion(userId, storyId, questionId, answerId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("progress", progress);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Завершить историю
     * POST /api/stories/complete
     */
    @PostMapping("/complete")
    public ResponseEntity<?> completeStory(@RequestBody Map<String, Object> request) {
        try {
            Long userId = Long.parseLong(request.get("userId").toString());
            Long storyId = Long.parseLong(request.get("storyId").toString());
            int correctAnswers = Integer.parseInt(request.get("correctAnswers").toString());
            int totalQuestions = Integer.parseInt(request.get("totalQuestions").toString());

            UserStoryProgress progress = storyService.completeStory(userId, storyId, correctAnswers, totalQuestions);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("progress", progress);
            response.put("xpEarned", progress.getStory().getXpReward());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Получить статистику историй пользователя
     * GET /api/stories/stats/{userId}
     */
    @GetMapping("/stats/{userId}")
    public ResponseEntity<Map<String, Object>> getUserStats(@PathVariable Long userId) {
        Map<String, Object> stats = storyService.getUserStoryStats(userId);
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/reseed")
    public ResponseEntity<?> reseedStories(@RequestParam(defaultValue = "false") boolean force) {
        String result = storyService.reseedStories();
        return ResponseEntity.ok(Map.of("message", result));
    }
}