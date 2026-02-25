package kz.balapan.balapan_language.repository;

import kz.balapan.balapan_language.model.ExerciseOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExerciseOptionRepository extends JpaRepository<ExerciseOption, Long> {
}
