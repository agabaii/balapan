package kz.balapan.balapan_language.service;

import kz.balapan.balapan_language.model.AiChatMessage;
import kz.balapan.balapan_language.model.AiChatSession;
import kz.balapan.balapan_language.repository.AiChatMessageRepository;
import kz.balapan.balapan_language.repository.AiChatSessionRepository;
import kz.balapan.balapan_language.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.util.List;

@Service
public class AiChatService {

    @Autowired
    private AiChatSessionRepository sessionRepository;

    @Autowired
    private AiChatMessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public AiChatSession startSession(Long userId, String language) {
        if (userId == null)
            throw new IllegalArgumentException("User ID cannot be null");
        AiChatSession session = new AiChatSession();
        session.setUser(userRepository.findById(userId).orElseThrow());
        session.setLanguage(language);
        return sessionRepository.save(session);
    }

    @Transactional
    public AiChatMessage sendMessage(Long sessionId, String content) {
        if (sessionId == null)
            throw new IllegalArgumentException("Session ID cannot be null");
        AiChatSession session = sessionRepository.findById(sessionId).orElseThrow();

        // 1. Save user message
        AiChatMessage userMessage = new AiChatMessage();
        userMessage.setSession(session);
        userMessage.setSender("user");
        userMessage.setContent(content);
        messageRepository.save(userMessage);

        // 2. Generate AI response (Placeholder logic)
        AiChatMessage aiMessage = new AiChatMessage();
        aiMessage.setSession(session);
        aiMessage.setSender("ai");

        // Logic for AI response would go here (e.g. calling Gemini API)
        aiMessage.setContent("This is an AI response in " + session.getLanguage() + ". (API integration pending)");
        aiMessage.setCorrections("No corrections needed yet."); // Example correction logic

        return messageRepository.save(aiMessage);
    }

    public List<AiChatSession> getUserSessions(Long userId) {
        return sessionRepository.findByUserId(userId);
    }
}
