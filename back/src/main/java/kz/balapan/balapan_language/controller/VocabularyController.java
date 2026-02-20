package kz.balapan.balapan_language.controller;

import kz.balapan.balapan_language.model.UserVocabularyProgress;
import kz.balapan.balapan_language.service.VocabularyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vocabulary")
public class VocabularyController {

    @Autowired
    private VocabularyService vocabularyService;

    @GetMapping("/users/{userId}/due")
    public List<UserVocabularyProgress> getDueReviews(@PathVariable Long userId) {
        return vocabularyService.getDueReviews(userId);
    }

    @PostMapping("/progress/{progressId}/result")
    public void recordResult(@PathVariable Long progressId, @RequestParam boolean success) {
        vocabularyService.recordResult(progressId, success);
    }
}
