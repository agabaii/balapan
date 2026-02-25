package kz.balapan.balapan_language.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import kz.balapan.balapan_language.model.*;
import kz.balapan.balapan_language.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class CourseJsonSeeder {

    @PersistenceContext
    private EntityManager em;

    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private LanguageService languageService;
    @Autowired
    private UserProgressRepository userProgressRepository;
    @Autowired
    private UserVideoProgressRepository userVideoProgressRepository;
    @Autowired
    private UserVocabularyRepository userVocabularyRepository;

    @Autowired
    private StoryJsonSeeder storyJsonSeeder;
    @Autowired
    private VideoLessonJsonSeeder videoLessonJsonSeeder;

    private final ObjectMapper mapper = new ObjectMapper();

    @Transactional
    public String reseedCourses(boolean force) {
        long count = courseRepository.count();
        if (count > 0 && !force) {
            return "Courses already exist. Use force=true to reseed.";
        }

        if (force) {
            System.out.println("🧹 Clearing all data in correct order...");
            // Delete in correct FK order using native SQL
            em.createNativeQuery("DELETE FROM user_progress").executeUpdate();
            em.createNativeQuery("DELETE FROM user_story_progress").executeUpdate();
            em.createNativeQuery("DELETE FROM user_video_progress").executeUpdate();
            em.createNativeQuery("DELETE FROM user_vocabulary_progress").executeUpdate();
            em.createNativeQuery("DELETE FROM exercise_options").executeUpdate();
            em.createNativeQuery("DELETE FROM exercises").executeUpdate();
            em.createNativeQuery("DELETE FROM lesson_content").executeUpdate();
            em.createNativeQuery("DELETE FROM lessons").executeUpdate();
            em.createNativeQuery("DELETE FROM levels").executeUpdate();
            em.createNativeQuery("DELETE FROM courses").executeUpdate();
            em.flush();
            em.clear();
            System.out.println("✅ Cleared all course data.");

            // Reseed stories and videos so IDs stay in sync with lessons
            System.out.println("📖 Reseeding Stories...");
            storyJsonSeeder.reseedStories(true);
            System.out.println("📺 Reseeding Videos...");
            videoLessonJsonSeeder.reseedVideos(true);
        }

        try {
            seedCourse("kk");
            seedCourse("en");
            seedCourse("ru");
            return "Courses seeded successfully!";
        } catch (Exception e) {
            System.err.println("❌ Seeding failed: " + e.getMessage());
            throw new RuntimeException("Seeding failed: " + e.getMessage(), e);
        }
    }

    private void seedCourse(String langCode) throws Exception {
        ClassPathResource resource = new ClassPathResource("courses/" + langCode + "_course.json");
        if (!resource.exists()) {
            System.err.println("⚠️ Course file not found: " + langCode + "_course.json");
            return;
        }

        JsonNode root;
        try (InputStreamReader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)) {
            root = mapper.readTree(reader);
        }

        Language language = languageService.getLanguageByCode(langCode);
        Course course = new Course();
        course.setTargetLanguage(language);
        course.setLanguageCode(langCode);
        course.setSourceLanguageCode("all");
        course.setName(root.get("name").asText());
        course.setDescription(root.get("description").asText());
        course.setLevelCount(root.get("sections").size());

        List<Level> levels = new ArrayList<>();
        for (JsonNode sec : root.get("sections")) {
            levels.add(buildLevel(course, sec));
        }
        course.setLevels(levels);
        courseRepository.save(course);
        System.out.println("✅ Seeded course: " + langCode + " (" + levels.size() + " sections)");
    }

    private Level buildLevel(Course course, JsonNode sec) {
        Level level = new Level();
        level.setCourse(course);
        level.setLevelNumber(sec.get("number").asInt());
        level.setTitle(sec.get("title").get("ru").asText());
        level.setTitleRu(sec.get("title").get("ru").asText());
        level.setTitleKk(sec.get("title").get("kk").asText());
        level.setTitleEn(sec.get("title").get("en").asText());
        level.setDescriptionRu(sec.get("description").get("ru").asText());
        level.setDescriptionKk(sec.get("description").get("kk").asText());
        level.setDescriptionEn(sec.get("description").get("en").asText());
        level.setDescription(sec.get("description").get("ru").asText());
        level.setSectionIcon(sec.has("icon") ? sec.get("icon").asText() : "⭐");
        level.setRequiredXp(0);

        List<Lesson> lessons = new ArrayList<>();
        for (JsonNode les : sec.get("lessons")) {
            lessons.add(buildLesson(level, les));
        }
        level.setLessons(lessons);
        return level;
    }

    private Lesson buildLesson(Level level, JsonNode les) {
        Lesson lesson = new Lesson();
        lesson.setLevel(level);
        lesson.setLessonNumber(les.get("number").asInt());
        lesson.setTitle(les.get("title").get("ru").asText());
        lesson.setTitleRu(les.get("title").get("ru").asText());
        lesson.setTitleKk(les.get("title").get("kk").asText());
        lesson.setTitleEn(les.get("title").get("en").asText());
        lesson.setLessonType(les.get("type").asText());
        lesson.setLessonIcon(les.has("icon") ? les.get("icon").asText() : "📖");
        lesson.setXpReward(les.has("xp") ? les.get("xp").asInt() : 15);

        if (les.has("linkedVideoId") && !les.get("linkedVideoId").isNull())
            lesson.setLinkedVideoId(les.get("linkedVideoId").asLong());

        if (les.has("linkedStoryId") && !les.get("linkedStoryId").isNull())
            lesson.setLinkedStoryId(les.get("linkedStoryId").asLong());

        List<Exercise> exercises = new ArrayList<>();
        int num = 1;
        if (les.has("exercises") && les.get("exercises").isArray()) {
            for (JsonNode ex : les.get("exercises")) {
                exercises.add(buildExercise(lesson, ex, num++));
            }
        }
        lesson.setExercises(exercises);
        return lesson;
    }

    private Exercise buildExercise(Lesson lesson, JsonNode ex, int num) {
        Exercise exercise = new Exercise();
        exercise.setLesson(lesson);
        exercise.setExerciseNumber(num);
        exercise.setExerciseType(ex.get("type").asText());
        exercise.setQuestionText(ex.has("questionText") ? ex.get("questionText").asText() : ex.get("type").asText());
        exercise.setCorrectAnswer(ex.has("correctAnswer") ? ex.get("correctAnswer").asText() : "");
        exercise.setDifficulty(1);
        try {
            exercise.setContentJson(mapper.writeValueAsString(ex));
        } catch (Exception e) {
            exercise.setContentJson("{}");
        }
        return exercise;
    }
}
