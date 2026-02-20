package kz.balapan.balapan_language.controller;

import kz.balapan.balapan_language.model.AiChatMessage;
import kz.balapan.balapan_language.model.AiChatSession;
import kz.balapan.balapan_language.service.AiChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ai-chat")
public class AiChatController {

    @Autowired
    private AiChatService aiChatService;

    @PostMapping("/sessions")
    public AiChatSession startSession(@RequestParam Long userId, @RequestParam String language) {
        return aiChatService.startSession(userId, language);
    }

    @PostMapping("/sessions/{sessionId}/messages")
    public AiChatMessage sendMessage(@PathVariable Long sessionId, @RequestBody String content) {
        return aiChatService.sendMessage(sessionId, content);
    }

    @GetMapping("/users/{userId}/sessions")
    public List<AiChatSession> getUserSessions(@PathVariable Long userId) {
        return aiChatService.getUserSessions(userId);
    }
}
