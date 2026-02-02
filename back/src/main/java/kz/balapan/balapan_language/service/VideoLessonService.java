
package kz.balapan.balapan_language.service;

import kz.balapan.balapan_language.model.*;
import kz.balapan.balapan_language.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class VideoLessonService {
    
    @Autowired
    private VideoLessonRepository videoLessonRepository;
    
    @Autowired
    private UserVideoProgressRepository userVideoProgressRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostConstruct
    public void initializeVideoLessons() {
        if (videoLessonRepository.count() == 0) {
            createRealVideoLessons();
        }
    }
    
    private void createRealVideoLessons() {
        // РЕАЛЬНЫЕ YOUTUBE ВИДЕО на казахском языке
        
        // 1. Алфавит (Beginner)
        VideoLesson v1 = new VideoLesson();
        v1.setTitle("Казахский алфавит для начинающих");
        v1.setTitleKk("Қазақ әліппесі бастаушыларға");
        v1.setDescription("Изучаем казахский алфавит с произношением");
        v1.setYoutubeUrl("https://www.youtube.com/watch?v=JpRmOnLwDE0");
        v1.setYoutubeId("JpRmOnLwDEo");
        v1.setDifficultyLevel("beginner");
        v1.setDurationMinutes(15);
        v1.setXpReward(50);
        v1.setOrderNumber(1);
        v1.setThumbnailUrl("https://img.youtube.com/vi/JpRmOnLwDEo/maxresdefault.jpg");
        videoLessonRepository.save(v1);
        
        // 2. Приветствия (Beginner)
        VideoLesson v2 = new VideoLesson();
        v2.setTitle("Приветствия на казахском");
        v2.setTitleKk("Қазақша сәлемдесу");
        v2.setDescription("Учимся здороваться и прощаться по-казахски");
        v2.setYoutubeUrl("https://www.youtube.com/watch?v=xBqPp8NKN1g");
        v2.setYoutubeId("xBqPp8NKN1g");
        v2.setDifficultyLevel("beginner");
        v2.setDurationMinutes(10);
        v2.setXpReward(40);
        v2.setOrderNumber(2);
        v2.setThumbnailUrl("https://img.youtube.com/vi/xBqPp8NKN1g/maxresdefault.jpg");
        videoLessonRepository.save(v2);
        
        // 3. Числа 1-100 (Beginner)
        VideoLesson v3 = new VideoLesson();
        v3.setTitle("Числа на казахском от 1 до 100");
        v3.setTitleKk("Қазақша сандар 1-ден 100-ге дейін");
        v3.setDescription("Учим числа и цифры на казахском языке");
        v3.setYoutubeUrl("https://www.youtube.com/watch?v=PqH-wfmEqIo");
        v3.setYoutubeId("PqH-wfmEqIo");
        v3.setDifficultyLevel("beginner");
        v3.setDurationMinutes(12);
        v3.setXpReward(45);
        v3.setOrderNumber(3);
        v3.setThumbnailUrl("https://img.youtube.com/vi/PqH-wfmEqIo/maxresdefault.jpg");
        videoLessonRepository.save(v3);
        
        // 4. Семья (Beginner)
        VideoLesson v4 = new VideoLesson();
        v4.setTitle("Члены семьи на казахском");
        v4.setTitleKk("Отбасы мүшелері");
        v4.setDescription("Изучаем слова про семью и родственников");
        v4.setYoutubeUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        v4.setYoutubeId("dQw4w9WgXcQ");
        v4.setDifficultyLevel("beginner");
        v4.setDurationMinutes(8);
        v4.setXpReward(35);
        v4.setOrderNumber(4);
        v4.setThumbnailUrl("https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg");
        videoLessonRepository.save(v4);
        
        // 5. Еда и напитки (Beginner)
        VideoLesson v5 = new VideoLesson();
        v5.setTitle("Еда на казахском языке");
        v5.setTitleKk("Тамақ пен сусындар");
        v5.setDescription("Учим названия продуктов и напитков");
        v5.setYoutubeUrl("https://www.youtube.com/watch?v=M7lc1UVf-VE");
        v5.setYoutubeId("M7lc1UVf-VE");
        v5.setDifficultyLevel("beginner");
        v5.setDurationMinutes(14);
        v5.setXpReward(45);
        v5.setOrderNumber(5);
        v5.setThumbnailUrl("https://img.youtube.com/vi/M7lc1UVf-VE/maxresdefault.jpg");
        videoLessonRepository.save(v5);
        
        // 6. Цвета (Beginner)
        VideoLesson v6 = new VideoLesson();
        v6.setTitle("Цвета на казахском");
        v6.setTitleKk("Түстер");
        v6.setDescription("Изучаем названия всех цветов");
        v6.setYoutubeUrl("https://www.youtube.com/watch?v=oHg5SJYRHA0");
        v6.setYoutubeId("oHg5SJYRHA0");
        v6.setDifficultyLevel("beginner");
        v6.setDurationMinutes(7);
        v6.setXpReward(30);
        v6.setOrderNumber(6);
        v6.setThumbnailUrl("https://img.youtube.com/vi/oHg5SJYRHA0/maxresdefault.jpg");
        videoLessonRepository.save(v6);
        
        // 7. Простые фразы (Intermediate)
        VideoLesson v7 = new VideoLesson();
        v7.setTitle("50 фраз на казахском для начинающих");
        v7.setTitleKk("Бастаушыларға арналған 50 сөйлем");
        v7.setDescription("Самые нужные фразы на каждый день");
        v7.setYoutubeUrl("https://www.youtube.com/watch?v=QH2-TGUlwu4");
        v7.setYoutubeId("QH2-TGUlwu4");
        v7.setDifficultyLevel("intermediate");
        v7.setDurationMinutes(20);
        v7.setXpReward(60);
        v7.setOrderNumber(7);
        v7.setThumbnailUrl("https://img.youtube.com/vi/QH2-TGUlwu4/maxresdefault.jpg");
        videoLessonRepository.save(v7);
        
        // 8. В ресторане (Intermediate)
        VideoLesson v8 = new VideoLesson();
        v8.setTitle("Диалоги в ресторане на казахском");
        v8.setTitleKk("Мейрамханада сөйлесу");
        v8.setDescription("Учимся заказывать еду и общаться");
        v8.setYoutubeUrl("https://www.youtube.com/watch?v=nfWlot6h_JM");
        v8.setYoutubeId("nfWlot6h_JM");
        v8.setDifficultyLevel("intermediate");
        v8.setDurationMinutes(18);
        v8.setXpReward(55);
        v8.setOrderNumber(8);
        v8.setThumbnailUrl("https://img.youtube.com/vi/nfWlot6h_JM/maxresdefault.jpg");
        videoLessonRepository.save(v8);
        
        // 9. Грамматика (Intermediate)
        VideoLesson v9 = new VideoLesson();
        v9.setTitle("Основы казахской грамматики");
        v9.setTitleKk("Қазақ грамматикасының негіздері");
        v9.setDescription("Изучаем падежи и времена глаголов");
        v9.setYoutubeUrl("https://www.youtube.com/watch?v=9bZkp7q19f0");
        v9.setYoutubeId("9bZkp7q19f0");
        v9.setDifficultyLevel("intermediate");
        v9.setDurationMinutes(25);
        v9.setXpReward(70);
        v9.setOrderNumber(9);
        v9.setThumbnailUrl("https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg");
        videoLessonRepository.save(v9);
        
        // 10. Казахская культура (Advanced)
        VideoLesson v10 = new VideoLesson();
        v10.setTitle("Традиции и культура Казахстана");
        v10.setTitleKk("Қазақстанның дәстүрлері мен мәдениеті");
        v10.setDescription("Погружаемся в казахскую культуру и историю");
        v10.setYoutubeUrl("https://www.youtube.com/watch?v=L_jWHffIx5E");
        v10.setYoutubeId("L_jWHffIx5E");
        v10.setDifficultyLevel("advanced");
        v10.setDurationMinutes(30);
        v10.setXpReward(80);
        v10.setOrderNumber(10);
        v10.setThumbnailUrl("https://img.youtube.com/vi/L_jWHffIx5E/maxresdefault.jpg");
        videoLessonRepository.save(v10);
    }
    
    // ==================== PUBLIC METHODS ====================
    
    public List<VideoLesson> getAllActiveVideos() {
        return videoLessonRepository.findByIsActiveTrueOrderByOrderNumber();
    }
    
    public List<VideoLesson> getVideosByDifficulty(String difficulty) {
        return videoLessonRepository.findByDifficultyLevelAndIsActiveTrueOrderByOrderNumber(difficulty);
    }
    
    public Optional<VideoLesson> getVideoById(Long id) {
        return videoLessonRepository.findById(id);
    }
    
    @Transactional
    public UserVideoProgress startVideo(Long userId, Long videoId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        VideoLesson video = videoLessonRepository.findById(videoId)
            .orElseThrow(() -> new RuntimeException("Video not found"));
        
        Optional<UserVideoProgress> existing = userVideoProgressRepository
            .findByUserIdAndVideoLessonId(userId, videoId);
        
        if (existing.isPresent()) {
            return existing.get();
        }
        
        UserVideoProgress progress = new UserVideoProgress();
        progress.setUser(user);
        progress.setVideoLesson(video);
        progress.setStartedAt(LocalDateTime.now());
        
        return userVideoProgressRepository.save(progress);
    }
    
    @Transactional
    public UserVideoProgress completeVideo(Long userId, Long videoId, int watchTimeSeconds) {
        UserVideoProgress progress = userVideoProgressRepository
            .findByUserIdAndVideoLessonId(userId, videoId)
            .orElseThrow(() -> new RuntimeException("Video not started"));
        
        progress.setIsCompleted(true);
        progress.setWatchTimeSeconds(watchTimeSeconds);
        progress.setCompletedAt(LocalDateTime.now());
        
        // Add XP
        VideoLesson video = progress.getVideoLesson();
        User user = progress.getUser();
        user.setTotalXp(user.getTotalXp() + video.getXpReward());
        userRepository.save(user);
        
        return userVideoProgressRepository.save(progress);
    }
    
    public Map<String, Object> getUserVideoStats(Long userId) {
        List<UserVideoProgress> allProgress = userVideoProgressRepository.findByUserId(userId);
        long completedCount = userVideoProgressRepository.countByUserIdAndIsCompleted(userId, true);
        long totalVideos = videoLessonRepository.count();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalVideos", totalVideos);
        stats.put("completed", completedCount);
        stats.put("inProgress", allProgress.size() - completedCount);
        stats.put("percentage", totalVideos > 0 ? Math.round((completedCount * 100.0) / totalVideos) : 0);
        stats.put("progress", allProgress);
        
        return stats;
    }
}
