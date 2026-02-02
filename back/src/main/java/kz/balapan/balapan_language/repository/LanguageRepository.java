package kz.balapan.balapan_language.repository;

import kz.balapan.balapan_language.model.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface LanguageRepository extends JpaRepository<Language, Long> {
    
    Optional<Language> findByCode(String code);
    
    boolean existsByCode(String code);
}