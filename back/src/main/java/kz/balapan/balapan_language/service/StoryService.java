package kz.balapan.balapan_language.service;

import kz.balapan.balapan_language.model.Story;
import kz.balapan.balapan_language.model.User;
import kz.balapan.balapan_language.model.UserStoryProgress;
import kz.balapan.balapan_language.repository.StoryRepository;
import kz.balapan.balapan_language.repository.UserRepository;
import kz.balapan.balapan_language.repository.UserStoryProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
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

        @Autowired
        private StoryJsonSeeder storyJsonSeeder;

        // Seeding is now handled by CourseService @EventListener

        @Transactional
        public String reseedStories() {
                return storyJsonSeeder.reseedStories(true);
        }

        public List<Story> getAllActiveStories(String language) {
                if (language != null) {
                        return storyRepository.findByLanguageAndIsActiveTrue(language);
                }
                return storyRepository.findAll();
        }

        public List<Story> getStoriesByDifficulty(String difficulty, String language) {
                if (language != null) {
                        return storyRepository.findByLanguageAndDifficultyLevelAndIsActiveTrue(language, difficulty);
                }
                return storyRepository.findByDifficultyLevelAndIsActiveTrue(difficulty);
        }

        public Optional<Story> getStoryById(Long id) {
                return storyRepository.findById(id);
        }

        @Transactional
        public UserStoryProgress startStory(Long userId, Long storyId) {
                if (userId == null)
                        throw new RuntimeException("User ID must not be null");
                if (storyId == null)
                        throw new RuntimeException("Story ID must not be null");

                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                Story story = storyRepository.findById(storyId)
                                .orElseThrow(() -> new RuntimeException("Story not found"));

                Optional<UserStoryProgress> existing = progressRepository.findByUserIdAndStoryId(userId, storyId);
                if (existing.isPresent()) {
                        return existing.get();
                }

                UserStoryProgress progress = new UserStoryProgress();
                progress.setUser(user);
                progress.setStory(story);
                progress.setStartedAt(LocalDateTime.now());
                progress.setIsCompleted(false);
                progress.setCorrectAnswers(0);

                return progressRepository.save(progress);
        }

        @Transactional
        public UserStoryProgress answerQuestion(Long userId, Long storyId, Long questionId, Long answerId) {
                return progressRepository.findByUserIdAndStoryId(userId, storyId)
                                .orElseThrow(() -> new RuntimeException("Progress not found"));
        }

        @Transactional
        public UserStoryProgress completeStory(Long userId, Long storyId, int correct, int total) {
                UserStoryProgress progress = progressRepository.findByUserIdAndStoryId(userId, storyId)
                                .orElseThrow(() -> new RuntimeException("Progress not found"));

                User user = progress.getUser();
                boolean wasAlreadyCompleted = progress.getIsCompleted() != null && progress.getIsCompleted();

                progress.setIsCompleted(true);
                progress.setCompletedAt(LocalDateTime.now());
                progress.setCorrectAnswers(correct);

                if (!wasAlreadyCompleted) {
                        user.setTotalXp((user.getTotalXp() != null ? user.getTotalXp() : 0)
                                        + progress.getStory().getXpReward());
                        user.setGems((user.getGems() != null ? user.getGems() : 0) + 10);
                } else {
                        user.setGems((user.getGems() != null ? user.getGems() : 0) + 2); // Repetition reward
                }
                userRepository.save(user);

                return progressRepository.save(progress);
        }

        public Map<String, Object> getUserStoryStats(Long userId) {
                List<UserStoryProgress> allProgress = progressRepository.findByUserId(userId);
                long completedCount = progressRepository.countByUserIdAndIsCompleted(userId, true);
                long totalStories = storyRepository.count();

                Map<String, Object> stats = new HashMap<>();
                stats.put("totalStories", totalStories);
                stats.put("completed", completedCount);
                stats.put("inProgress", allProgress.size() - completedCount);
                stats.put("progress", allProgress);
                return stats;
        }
}