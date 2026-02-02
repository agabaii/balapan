package kz.balapan.balapan_language.controller;

import kz.balapan.balapan_language.model.Language;
import kz.balapan.balapan_language.service.LanguageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/languages")
public class LanguageController {
    
    @Autowired
    private LanguageService languageService;
    
    @GetMapping
    public ResponseEntity<List<Language>> getAllLanguages() {
        return ResponseEntity.ok(languageService.getAllLanguages());
    }
    
    @GetMapping("/{code}")
    public ResponseEntity<Language> getLanguage(@PathVariable String code) {
        return ResponseEntity.ok(languageService.getLanguageByCode(code));
    }
}