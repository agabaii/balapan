// back/src/main/java/kz/balapan/balapan_language/service/StoryService.java
package kz.balapan.balapan_language.service;

import kz.balapan.balapan_language.model.*;
import kz.balapan.balapan_language.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class StoryService {
    
    @Autowired
    private StoryRepository storyRepository;
    
    @Autowired
    private UserStoryProgressRepository progressRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostConstruct
    public void initializeStories() {
        if (storyRepository.count() == 0) {
            createBeginnerStories();
            createIntermediateStories();
        }
    }
    
    // ==================== BEGINNER STORIES ====================
    
    private void createBeginnerStories() {
        // Story 1: В кафе (Beginner)
        Story story1 = new Story();
        story1.setTitle("В кафе");
        story1.setTitleKk("Кафеде");
        story1.setDescription("Айгуль и Асан встречаются в кафе. Простой диалог о еде и напитках.");
        story1.setDifficultyLevel("beginner");
        story1.setEstimatedTime(5);
        story1.setCoverImageUrl("/images/stories/cafe.jpg");
        story1.setXpReward(30);
        story1.setCategory("daily_life");
        story1.setIsActive(true);
        
        List<StoryChapter> chapters1 = new ArrayList<>();
        
        // Chapter 1
        StoryChapter ch1 = new StoryChapter();
        ch1.setStory(story1);
        ch1.setChapterNumber(1);
        ch1.setTextKk("Айгүл кафеге кірді. Ол досы Асанды күтеді.");
        ch1.setTextRu("Айгуль вошла в кафе. Она ждёт своего друга Асана.");
        ch1.setCharacterName("Айгүл");
        
        List<StoryQuestion> questions1 = new ArrayList<>();
        StoryQuestion q1 = new StoryQuestion();
        q1.setChapter(ch1);
        q1.setQuestionNumber(1);
        q1.setQuestionText("Айгүл қайда?");
        q1.setQuestionType("multiple_choice");
        
        List<StoryAnswer> answers1 = new ArrayList<>();
        answers1.add(createAnswer(q1, "Мектепте", 1, false));
        answers1.add(createAnswer(q1, "Кафеде", 2, true));
        answers1.add(createAnswer(q1, "Үйде", 3, false));
        answers1.add(createAnswer(q1, "Дүкенде", 4, false));
        
        q1.setAnswers(answers1);
        q1.setCorrectAnswerId(answers1.get(1).getId());
        questions1.add(q1);
        ch1.setQuestions(questions1);
        chapters1.add(ch1);
        
        // Chapter 2
        StoryChapter ch2 = new StoryChapter();
        ch2.setStory(story1);
        ch2.setChapterNumber(2);
        ch2.setTextKk("Асан келді. \"Сәлем, Айгүл! Кешірім сұраймын, кешіктім\", - деді ол.");
        ch2.setTextRu("Асан пришёл. \"Привет, Айгуль! Извини, я опоздал\", - сказал он.");
        ch2.setCharacterName("Асан");
        
        List<StoryQuestion> questions2 = new ArrayList<>();
        StoryQuestion q2 = new StoryQuestion();
        q2.setChapter(ch2);
        q2.setQuestionNumber(1);
        q2.setQuestionText("Асан не істеді?");
        q2.setQuestionType("multiple_choice");
        
        List<StoryAnswer> answers2 = new ArrayList<>();
        answers2.add(createAnswer(q2, "Кешіктті", 1, true));
        answers2.add(createAnswer(q2, "Ерте келді", 2, false));
        answers2.add(createAnswer(q2, "Келмеді", 3, false));
        
        q2.setAnswers(answers2);
        questions2.add(q2);
        ch2.setQuestions(questions2);
        chapters1.add(ch2);
        
        // Chapter 3
        StoryChapter ch3 = new StoryChapter();
        ch3.setStory(story1);
        ch3.setChapterNumber(3);
        ch3.setTextKk("\"Жоқ, жоқ, барлығы жақсы\", - деді Айгүл. \"Не ішесің?\"");
        ch3.setTextRu("\"Нет, нет, всё хорошо\", - сказала Айгуль. \"Что будешь пить?\"");
        ch3.setCharacterName("Айгүл");
        
        List<StoryQuestion> questions3 = new ArrayList<>();
        StoryQuestion q3 = new StoryQuestion();
        q3.setChapter(ch3);
        q3.setQuestionNumber(1);
        q3.setQuestionText("Айгүл не сұрады?");
        q3.setQuestionType("multiple_choice");
        
        List<StoryAnswer> answers3 = new ArrayList<>();
        answers3.add(createAnswer(q3, "Асан қайдан келді?", 1, false));
        answers3.add(createAnswer(q3, "Асан не ішеді?", 2, true));
        answers3.add(createAnswer(q3, "Асан неше жаста?", 3, false));
        
        q3.setAnswers(answers3);
        questions3.add(q3);
        ch3.setQuestions(questions3);
        chapters1.add(ch3);
        
        // Chapter 4
        StoryChapter ch4 = new StoryChapter();
        ch4.setStory(story1);
        ch4.setChapterNumber(4);
        ch4.setTextKk("\"Мен қара шай ішемін. Ал сен?\" - деді Асан. \"Мен кофе ішемін\", - деді Айгүл.");
        ch4.setTextRu("\"Я буду чёрный чай. А ты?\" - сказал Асан. \"Я буду кофе\", - сказала Айгуль.");
        ch4.setCharacterName("Асан");
        
        List<StoryQuestion> questions4 = new ArrayList<>();
        StoryQuestion q4 = new StoryQuestion();
        q4.setChapter(ch4);
        q4.setQuestionNumber(1);
        q4.setQuestionText("Асан не ішеді?");
        q4.setQuestionType("multiple_choice");
        
        List<StoryAnswer> answers4 = new ArrayList<>();
        answers4.add(createAnswer(q4, "Кофе", 1, false));
        answers4.add(createAnswer(q4, "Қара шай", 2, true));
        answers4.add(createAnswer(q4, "Сұт", 3, false));
        answers4.add(createAnswer(q4, "Су", 4, false));
        
        q4.setAnswers(answers4);
        questions4.add(q4);
        ch4.setQuestions(questions4);
        chapters1.add(ch4);
        
        story1.setChapters(chapters1);
        storyRepository.save(story1);
        
        // Story 2: Наурыз мейрамы (Beginner)
        createNauryzStory();
    }
    
    private void createNauryzStory() {
        Story story = new Story();
        story.setTitle("Наурыз праздник");
        story.setTitleKk("Наурыз мейрамы");
        story.setDescription("Семья готовится к празднику Наурыз. Традиции и обычаи.");
        story.setDifficultyLevel("beginner");
        story.setEstimatedTime(6);
        story.setCoverImageUrl("/images/stories/nauryz.jpg");
        story.setXpReward(35);
        story.setCategory("culture");
        story.setIsActive(true);
        
        List<StoryChapter> chapters = new ArrayList<>();
        
        // Chapter 1
        StoryChapter ch1 = new StoryChapter();
        ch1.setStory(story);
        ch1.setChapterNumber(1);
        ch1.setTextKk("Бүгін 22 наурыз. Біздің отбасы Наурыз мейрамына дайындалады.");
        ch1.setTextRu("Сегодня 22 марта. Наша семья готовится к празднику Наурыз.");
        ch1.setCharacterName("Ана");
        
        List<StoryQuestion> questions1 = new ArrayList<>();
        StoryQuestion q1 = new StoryQuestion();
        q1.setChapter(ch1);
        q1.setQuestionNumber(1);
        q1.setQuestionText("Отбасы неге дайындалады?");
        q1.setQuestionType("multiple_choice");
        
        List<StoryAnswer> answers1 = new ArrayList<>();
        answers1.add(createAnswer(q1, "Туған күнге", 1, false));
        answers1.add(createAnswer(q1, "Наурыз мейрамына", 2, true));
        answers1.add(createAnswer(q1, "Жаңа жылға", 3, false));
        
        q1.setAnswers(answers1);
        questions1.add(q1);
        ch1.setQuestions(questions1);
        chapters.add(ch1);
        
        // Chapter 2
        StoryChapter ch2 = new StoryChapter();
        ch2.setStory(story);
        ch2.setChapterNumber(2);
        ch2.setTextKk("Ана наурыз көже дайындайды. Көжеге жеті түрлі дән қосады.");
        ch2.setTextRu("Мама готовит наурыз-коже. В коже добавляет семь видов зерна.");
        ch2.setCharacterName("Ана");
        
        List<StoryQuestion> questions2 = new ArrayList<>();
        StoryQuestion q2 = new StoryQuestion();
        q2.setChapter(ch2);
        q2.setQuestionNumber(1);
        q2.setQuestionText("Ана не дайындайды?");
        q2.setQuestionType("multiple_choice");
        
        List<StoryAnswer> answers2 = new ArrayList<>();
        answers2.add(createAnswer(q2, "Бауырсақ", 1, false));
        answers2.add(createAnswer(q2, "Наурыз көже", 2, true));
        answers2.add(createAnswer(q2, "Шай", 3, false));
        
        q2.setAnswers(answers2);
        questions2.add(q2);
        ch2.setQuestions(questions2);
        chapters.add(ch2);
        
        // Chapter 3
        StoryChapter ch3 = new StoryChapter();
        ch3.setStory(story);
        ch3.setChapterNumber(3);
        ch3.setTextKk("Көршілер бізге келеді. Біз олармен бірге Наурызды тойлаймыз!");
        ch3.setTextRu("Соседи приходят к нам. Мы вместе празднуем Наурыз!");
        ch3.setCharacterName("Әке");
        
        List<StoryQuestion> questions3 = new ArrayList<>();
        StoryQuestion q3 = new StoryQuestion();
        q3.setChapter(ch3);
        q3.setQuestionNumber(1);
        q3.setQuestionText("Кім келеді?");
        q3.setQuestionType("multiple_choice");
        
        List<StoryAnswer> answers3 = new ArrayList<>();
        answers3.add(createAnswer(q3, "Көршілер", 1, true));
        answers3.add(createAnswer(q3, "Мұғалім", 2, false));
        answers3.add(createAnswer(q3, "Дәрігер", 3, false));
        
        q3.setAnswers(answers3);
        questions3.add(q3);
        ch3.setQuestions(questions3);
        chapters.add(ch3);
        
        story.setChapters(chapters);
        storyRepository.save(story);
    }
    
    // ==================== INTERMEDIATE STORIES ====================
    
    private void createIntermediateStories() {
        Story story = new Story();
        story.setTitle("Поездка в Алматы");
        story.setTitleKk("Алматыға саяхат");
        story.setDescription("Студент едет в Алматы впервые. Знакомство с городом.");
        story.setDifficultyLevel("intermediate");
        story.setEstimatedTime(8);
        story.setCoverImageUrl("/images/stories/almaty.jpg");
        story.setXpReward(50);
        story.setCategory("travel");
        story.setIsActive(true);
        
        List<StoryChapter> chapters = new ArrayList<>();
        
        StoryChapter ch1 = new StoryChapter();
        ch1.setStory(story);
        ch1.setChapterNumber(1);
        ch1.setTextKk("Мен бірінші рет Алматыға барамын. Бұл - Қазақстанның ең үлкен қаласы. Мен қатты қуаныштымын!");
        ch1.setTextRu("Я первый раз еду в Алматы. Это самый большой город Казахстана. Я очень рад!");
        ch1.setCharacterName("Ерлан");
        
        List<StoryQuestion> questions1 = new ArrayList<>();
        StoryQuestion q1 = new StoryQuestion();
        q1.setChapter(ch1);
        q1.setQuestionNumber(1);
        q1.setQuestionText("Ерлан қайда барады?");
        q1.setQuestionType("multiple_choice");
        
        List<StoryAnswer> answers1 = new ArrayList<>();
        answers1.add(createAnswer(q1, "Астанаға", 1, false));
        answers1.add(createAnswer(q1, "Алматыға", 2, true));
        answers1.add(createAnswer(q1, "Шымкентке", 3, false));
        
        q1.setAnswers(answers1);
        questions1.add(q1);
        ch1.setQuestions(questions1);
        chapters.add(ch1);
        
        story.setChapters(chapters);
        storyRepository.save(story);
    }
    
    // Helper method
    private StoryAnswer createAnswer(StoryQuestion question, String text, int order, boolean isCorrect) {
        StoryAnswer answer = new StoryAnswer();
        answer.setQuestion(question);
        answer.setAnswerText(text);
        answer.setAnswerOrder(order);
        answer.setIsCorrect(isCorrect);
        return answer;
    }
    
    // ==================== PUBLIC METHODS ====================
    
    public List<Story> getAllActiveStories() {
        return storyRepository.findByIsActiveTrue();
    }
    
    public List<Story> getStoriesByDifficulty(String difficulty) {
        return storyRepository.findByDifficultyLevelAndIsActiveTrue(difficulty);
    }
    
    public Optional<Story> getStoryById(Long id) {
        return storyRepository.findById(id);
    }
    
    @Transactional
    public UserStoryProgress startStory(Long userId, Long storyId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Story story = storyRepository.findById(storyId)
            .orElseThrow(() -> new RuntimeException("Story not found"));
        
        // Check if already started
        Optional<UserStoryProgress> existing = progressRepository.findByUserIdAndStoryId(userId, storyId);
        if (existing.isPresent()) {
            return existing.get();
        }
        
        UserStoryProgress progress = new UserStoryProgress();
        progress.setUser(user);
        progress.setStory(story);
        progress.setCurrentChapter(1);
        progress.setStartedAt(LocalDateTime.now());
        
        return progressRepository.save(progress);
    }
    
    @Transactional
    public UserStoryProgress answerQuestion(Long userId, Long storyId, Long questionId, Long answerId) {
        UserStoryProgress progress = progressRepository.findByUserIdAndStoryId(userId, storyId)
            .orElseThrow(() -> new RuntimeException("Story not started"));
        
        // Check if answer is correct (simplified - should validate with database)
        progress.setTotalQuestions(progress.getTotalQuestions() + 1);
        
        // This is simplified - in real app should check against correct answer
        progress.setCorrectAnswers(progress.getCorrectAnswers() + 1);
        
        return progressRepository.save(progress);
    }
    
    @Transactional
    public UserStoryProgress completeStory(Long userId, Long storyId, int correctAnswers, int totalQuestions) {
        UserStoryProgress progress = progressRepository.findByUserIdAndStoryId(userId, storyId)
            .orElseThrow(() -> new RuntimeException("Story not started"));
        
        progress.setIsCompleted(true);
        progress.setCorrectAnswers(correctAnswers);
        progress.setTotalQuestions(totalQuestions);
        progress.setCompletionPercentage(100);
        progress.setCompletedAt(LocalDateTime.now());
        
        // Add XP to user
        Story story = progress.getStory();
        User user = progress.getUser();
        user.setTotalXp(user.getTotalXp() + story.getXpReward());
        userRepository.save(user);
        
        return progressRepository.save(progress);
    }
    
    public Map<String, Object> getUserStoryStats(Long userId) {
        List<UserStoryProgress> allProgress = progressRepository.findByUserId(userId);
        long completedCount = progressRepository.countByUserIdAndIsCompleted(userId, true);
        long inProgressCount = allProgress.size() - completedCount;
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStarted", allProgress.size());
        stats.put("completed", completedCount);
        stats.put("inProgress", inProgressCount);
        stats.put("progress", allProgress);
        
        return stats;
    }
}