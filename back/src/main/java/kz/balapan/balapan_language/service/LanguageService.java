package kz.balapan.balapan_language.service;

import kz.balapan.balapan_language.model.Language;
import kz.balapan.balapan_language.repository.LanguageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.util.List;

@Service
public class LanguageService {
    
    @Autowired
    private LanguageRepository languageRepository;
    
    @PostConstruct
    public void initializeLanguages() {
        if (languageRepository.count() == 0) {
            createDefaultLanguages();
        }
    }
    
    private void createDefaultLanguages() {
        // Казахский язык
        Language kazakh = new Language();
        kazakh.setCode("kk");
        kazakh.setName("Қазақша");
        kazakh.setFlagEmoji("🇰🇿");
        kazakh.setDescription("Изучайте казахский язык - государственный язык Казахстана");
        kazakh.setIsActive(true);
        languageRepository.save(kazakh);
        
        // Русский язык
        Language russian = new Language();
        russian.setCode("ru");
        russian.setName("Русский");
        russian.setFlagEmoji("🇷🇺");
        russian.setDescription("Изучайте русский язык - один из самых распространенных языков мира");
        russian.setIsActive(true);
        languageRepository.save(russian);
        
        // Английский язык
        Language english = new Language();
        english.setCode("en");
        english.setName("English");
        english.setFlagEmoji("🇬🇧");
        english.setDescription("Learn English - the most widely spoken language in the world");
        english.setIsActive(true);
        languageRepository.save(english);
    }
    
    public List<Language> getAllLanguages() {
        return languageRepository.findAll();
    }
    
    public Language getLanguageByCode(String code) {
        return languageRepository.findByCode(code)
            .orElseThrow(() -> new RuntimeException("Language not found: " + code));
    }
}