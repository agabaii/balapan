package kz.balapan.balapan_language.controller;

import kz.balapan.balapan_language.model.VideoLesson;
import kz.balapan.balapan_language.model.UserVideoProgress;
import kz.balapan.balapan_language.service.VideoLessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/videos")
public class VideoLessonController {

    @Autowired
    private VideoLessonService videoLessonService;

    @GetMapping
    public ResponseEntity<List<VideoLesson>> getAllVideos(@RequestParam(required = false) String language) {
        return ResponseEntity.ok(videoLessonService.getAllActiveVideos(language));
    }

    @GetMapping("/difficulty/{level}")
    public ResponseEntity<List<VideoLesson>> getVideosByDifficulty(@PathVariable String level,
            @RequestParam(required = false) String language) {
        return ResponseEntity.ok(videoLessonService.getVideosByDifficulty(level, language));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVideoById(@PathVariable Long id) {
        return videoLessonService.getVideoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/start")
    public ResponseEntity<?> startVideo(@RequestBody Map<String, Long> request) {
        try {
            UserVideoProgress progress = videoLessonService.startVideo(
                    request.get("userId"),
                    request.get("videoId"));
            return ResponseEntity.ok(Map.of("success", true, "progress", progress));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PostMapping("/complete")
    public ResponseEntity<?> completeVideo(@RequestBody Map<String, Object> request) {
        try {
            UserVideoProgress progress = videoLessonService.completeVideo(
                    Long.parseLong(request.get("userId").toString()),
                    Long.parseLong(request.get("videoId").toString()),
                    Integer.parseInt(request.get("watchTimeSeconds").toString()));
            return ResponseEntity.ok(Map.of("success", true, "progress", progress));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/stats/{userId}")
    public ResponseEntity<Map<String, Object>> getUserStats(@PathVariable Long userId) {
        return ResponseEntity.ok(videoLessonService.getUserVideoStats(userId));
    }

    @PostMapping("/reseed")
    public ResponseEntity<?> reseedVideos(@RequestParam(defaultValue = "false") boolean force) {
        try {
            videoLessonService.reseedVideoLessons();
            return ResponseEntity.ok(Map.of("success", true, "message", "Videos reseeded successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
