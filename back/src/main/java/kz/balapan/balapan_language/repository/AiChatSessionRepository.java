package kz.balapan.balapan_language.repository;

import kz.balapan.balapan_language.model.AiChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AiChatSessionRepository extends JpaRepository<AiChatSession, Long> {
    List<AiChatSession> findByUserId(Long userId);

    List<AiChatSession> findByUserIdAndLanguage(Long userId, String language);
}
