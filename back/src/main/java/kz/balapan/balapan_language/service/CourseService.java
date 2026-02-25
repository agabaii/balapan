package kz.balapan.balapan_language.service;

import kz.balapan.balapan_language.model.*;
import kz.balapan.balapan_language.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.context.event.EventListener;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CourseService {

        @Autowired
        private CourseRepository courseRepository;

        @Autowired
        private CourseJsonSeeder courseJsonSeeder;

        @Autowired
        private LanguageService languageService;

        @EventListener(ApplicationReadyEvent.class)
        @Transactional
        public void initializeCourses() {
                // 1. Ensure languages exist
                languageService.initializeLanguages();

                // 2. Check if we have a healthy number of courses
                long count = courseRepository.count();
                boolean needsReseed = count < 3; // We expect at least kk, ru, en

                // 3. Check if any existing courses are 'broken' (no levels)
                if (!needsReseed) {
                        List<Course> courses = courseRepository.findAll();
                        for (Course c : courses) {
                                if (c.getLevels() == null || c.getLevels().isEmpty()) {
                                        needsReseed = true;
                                        System.out.println(
                                                        "⚠️ Course " + c.getName() + " has no levels. Forcing reseed.");
                                        break;
                                }
                        }
                }

                if (!needsReseed) {
                        System.out.println("✅ Courses look healthy (Count: " + count + "). Skipping auto-seed.");
                        return;
                }

                try {
                        System.out.println("🚀 Starting JSON Course Seeding (force=true)...");
                        courseJsonSeeder.reseedCourses(true); // Force it to ensure clean state
                        System.out.println("✅ JSON Course Seeding Complete!");
                } catch (Exception e) {
                        System.err.println("❌ JSON Seeding failed: " + e.getMessage());
                        e.printStackTrace();
                }
        }

        // ==================== PUBLIC МЕТОДЫ ====================

        @Transactional(readOnly = true)
        public List<Course> getAllCourses() {
                List<Course> courses = courseRepository.findAll();
                courses.forEach(c -> {
                        if (c.getLevels() != null)
                                c.getLevels().size();
                });
                return courses;
        }

        @Transactional(readOnly = true)
        public List<Course> getCoursesBySource(String sourceCode) {
                String actualSource = (sourceCode == null || sourceCode.isEmpty()) ? "ru" : sourceCode;
                System.out.println("🔍 Fetching courses for source: " + actualSource);

                List<Course> specific = courseRepository.findBySourceLanguageCode(actualSource);
                List<Course> universal = courseRepository.findBySourceLanguageCode("all");

                List<Course> all = new ArrayList<>(specific);
                for (Course c : universal) {
                        boolean exists = false;
                        for (Course existing : all) {
                                if (existing.getId() != null && existing.getId().equals(c.getId())) {
                                        exists = true;
                                        break;
                                }
                                if (existing.getLanguageCode() != null
                                                && existing.getLanguageCode().equals(c.getLanguageCode())) {
                                        exists = true;
                                        break;
                                }
                        }
                        if (!exists) {
                                all.add(c);
                        }
                }

                if (all.isEmpty()) {
                        System.out.println("⚠️ No courses found for source " + actualSource
                                        + ", trying total fallback...");
                        all = courseRepository.findAll();
                }

                // Force initialize levels for all found courses
                all.forEach(c -> {
                        if (c.getLevels() != null)
                                c.getLevels().size();
                });

                System.out.println("✅ Found " + all.size() + " courses for " + actualSource);
                return all;
        }

        @Transactional(readOnly = true)
        public Course getCourseById(Long id) {
                if (id == null)
                        throw new RuntimeException("Course ID must not be null");
                Course course = courseRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + id));
                // Force load levels and lessons to avoid LazyInitializationException
                if (course.getLevels() != null) {
                        course.getLevels().forEach(level -> {
                                if (level.getLessons() != null) {
                                        level.getLessons().size();
                                        level.getLessons().forEach(lesson -> {
                                                if (lesson.getExercises() != null)
                                                        lesson.getExercises().size();
                                        });
                                }
                        });
                }
                return course;
        }

        public Course getCourseByLanguageCode(String languageCode) {
                return courseRepository.findByLanguageCode(languageCode)
                                .stream()
                                .findFirst()
                                .orElseThrow(() -> new RuntimeException(
                                                "Course not found for language: " + languageCode));
        }

        public Level getLevelById(Long levelId) {
                for (Course course : courseRepository.findAll()) {
                        for (Level level : course.getLevels()) {
                                if (level.getId() != null && level.getId().equals(levelId)) {
                                        return level;
                                }
                        }
                }
                throw new RuntimeException("Level not found");
        }

        public Lesson getLessonById(Long lessonId) {
                for (Course course : courseRepository.findAll()) {
                        for (Level level : course.getLevels()) {
                                for (Lesson lesson : level.getLessons()) {
                                        if (lesson.getId() != null && lesson.getId().equals(lessonId)) {
                                                return lesson;
                                        }
                                }
                        }
                }
                throw new RuntimeException("Lesson not found");
        }

        // Метод для получения статистики курса
        public Map<String, Object> getCourseStats(Long courseId) {
                Course course = getCourseById(courseId);
                Map<String, Object> stats = new HashMap<>();

                int totalLevels = course.getLevels().size();
                int totalLessons = course.getLevels().stream()
                                .mapToInt(level -> level.getLessons().size())
                                .sum();
                int totalExercises = course.getLevels().stream()
                                .flatMap(level -> level.getLessons().stream())
                                .mapToInt(lesson -> lesson.getExercises().size())
                                .sum();

                stats.put("totalLevels", totalLevels);
                stats.put("totalLessons", totalLessons);
                stats.put("totalExercises", totalExercises);
                stats.put("courseName", course.getName());
                stats.put("languageCode", course.getLanguageCode());

                return stats;
        }

        // Метод для получения детальной информации об уровне
        public Map<String, Object> getLevelDetails(Long levelId) {
                Level level = getLevelById(levelId);
                Map<String, Object> details = new HashMap<>();

                details.put("levelNumber", level.getLevelNumber());
                details.put("title", level.getTitle());
                details.put("description", level.getDescription());
                details.put("requiredXp", level.getRequiredXp());
                details.put("lessonCount", level.getLessons().size());

                int totalExercises = level.getLessons().stream()
                                .mapToInt(lesson -> lesson.getExercises().size())
                                .sum();
                details.put("totalExercises", totalExercises);

                return details;
        }

        @Transactional
        public Course saveCourse(Course course) {
                return courseRepository.save(course);
        }

        @Transactional
        public void deleteCourse(Long id) {
                courseRepository.deleteById(id);
        }

        @Autowired
        private LevelRepository levelRepository;

        @Transactional
        public Level saveLevel(Level level) {
                return levelRepository.save(level);
        }

        @Transactional
        public void deleteLevel(Long id) {
                levelRepository.deleteById(id);
        }

        @Autowired
        private LessonRepository lessonRepository;

        @Transactional
        public Lesson saveLesson(Lesson lesson) {
                return lessonRepository.save(lesson);
        }

        @Transactional
        public void deleteLesson(Long id) {
                lessonRepository.deleteById(id);
        }

        @Autowired
        private LessonContentRepository lessonContentRepository;

        @Transactional
        public LessonContent saveLessonContent(LessonContent content) {
                return lessonContentRepository.save(content);
        }

        @Autowired
        private ExerciseRepository exerciseRepository;

        @Transactional
        public Exercise saveExercise(Exercise exercise) {
                return exerciseRepository.save(exercise);
        }

        @Transactional
        public void deleteExercise(Long id) {
                exerciseRepository.deleteById(id);
        }
}
