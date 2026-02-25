package kz.balapan.balapan_language.controller;

import kz.balapan.balapan_language.model.Course;
import kz.balapan.balapan_language.model.Level;
import kz.balapan.balapan_language.model.Lesson;
import kz.balapan.balapan_language.model.LessonContent;
import kz.balapan.balapan_language.model.Exercise;
import kz.balapan.balapan_language.service.CourseService;
import kz.balapan.balapan_language.service.CourseJsonSeeder;
import kz.balapan.balapan_language.model.ExerciseOption;
import kz.balapan.balapan_language.repository.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private CourseJsonSeeder courseJsonSeeder;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses(@RequestParam(required = false) String source) {
        if (source != null && !source.isEmpty()) {
            return ResponseEntity.ok(courseService.getCoursesBySource(source));
        }
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourse(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @PostMapping("/reseed")
    public ResponseEntity<String> reseedCourses(@RequestParam(defaultValue = "false") boolean force) {
        String result = courseJsonSeeder.reseedCourses(force);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        Course existing = courseService.getCourseById(id);
        existing.setName(course.getName());
        existing.setLanguageCode(course.getLanguageCode());
        existing.setSourceLanguageCode(course.getSourceLanguageCode());
        return ResponseEntity.ok(courseService.saveCourse(existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok().build();
    }

    // Level Management
    @PostMapping("/{courseId}/levels")
    public ResponseEntity<Level> addLevel(@PathVariable Long courseId, @RequestBody Level level) {
        Course course = courseService.getCourseById(courseId);
        level.setCourse(course);
        return ResponseEntity.ok(courseService.saveLevel(level));
    }

    @PutMapping("/levels/{id}")
    public ResponseEntity<Level> updateLevel(@PathVariable Long id, @RequestBody Level level) {
        Level existing = courseService.getLevelById(id);
        existing.setTitle(level.getTitle());
        existing.setLevelNumber(level.getLevelNumber());
        return ResponseEntity.ok(courseService.saveLevel(existing));
    }

    @DeleteMapping("/levels/{id}")
    public ResponseEntity<Void> deleteLevel(@PathVariable Long id) {
        courseService.deleteLevel(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/lessons/{id}")
    public ResponseEntity<Lesson> getLesson(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getLessonById(id));
    }

    // Lesson Management
    @PostMapping("/levels/{levelId}/lessons")
    public ResponseEntity<Lesson> addLesson(@PathVariable Long levelId, @RequestBody Lesson lesson) {
        Level level = courseService.getLevelById(levelId);
        lesson.setLevel(level);
        return ResponseEntity.ok(courseService.saveLesson(lesson));
    }

    @PutMapping("/lessons/{id}")
    public ResponseEntity<Lesson> updateLesson(@PathVariable Long id, @RequestBody Lesson lesson) {
        Lesson existing = courseService.getLessonById(id);
        existing.setTitle(lesson.getTitle());
        existing.setLessonType(lesson.getLessonType());
        return ResponseEntity.ok(courseService.saveLesson(existing));
    }

    @DeleteMapping("/lessons/{id}")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long id) {
        courseService.deleteLesson(id);
        return ResponseEntity.ok().build();
    }

    // Lesson Content
    @PostMapping("/lessons/{lessonId}/content")
    public ResponseEntity<LessonContent> saveLessonContent(@PathVariable Long lessonId,
            @RequestBody LessonContent content) {
        Lesson lesson = courseService.getLessonById(lessonId);
        content.setLesson(lesson);
        return ResponseEntity.ok(courseService.saveLessonContent(content));
    }

    // Exercises
    @PostMapping("/lessons/{lessonId}/exercises")
    public ResponseEntity<Exercise> addExercise(@PathVariable Long lessonId, @RequestBody Exercise exercise) {
        Lesson lesson = courseService.getLessonById(lessonId);
        exercise.setLesson(lesson);
        return ResponseEntity.ok(courseService.saveExercise(exercise));
    }

    @PutMapping("/exercises/{id}")
    @Transactional
    public ResponseEntity<Exercise> updateExercise(@PathVariable Long id, @RequestBody Exercise exercise) {
        Exercise existing = exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));

        existing.setExerciseType(exercise.getExerciseType());
        existing.setQuestionText(exercise.getQuestionText());
        existing.setCorrectAnswer(exercise.getCorrectAnswer());
        existing.setDifficulty(exercise.getDifficulty());
        existing.setQuestionAudioUrl(exercise.getQuestionAudioUrl());
        existing.setMappings(exercise.getMappings());

        // Update options
        if (existing.getOptions() != null) {
            existing.getOptions().clear();
        }
        if (exercise.getOptions() != null) {
            for (ExerciseOption opt : exercise.getOptions()) {
                opt.setExercise(existing);
                existing.getOptions().add(opt);
            }
        }

        return ResponseEntity.ok(exerciseRepository.save(existing));
    }

    @DeleteMapping("/exercises/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable Long id) {
        courseService.deleteExercise(id);
        return ResponseEntity.ok().build();
    }
}