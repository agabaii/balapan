package kz.balapan.balapan_language.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import kz.balapan.balapan_language.model.*;
import kz.balapan.balapan_language.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class VideoLessonJsonSeeder {

    @Autowired
    private VideoLessonRepository videoLessonRepository;
    @Autowired
    private UserVideoProgressRepository userVideoProgressRepository;

    private final ObjectMapper mapper = new ObjectMapper();

    @Transactional
    public String reseedVideos(boolean force) {
        if (force) {
            userVideoProgressRepository.deleteAll();
            videoLessonRepository.deleteAll();
        } else if (videoLessonRepository.count() > 0) {
            return "Videos already exist. Use force=true to reseed.";
        }

        try {
            seedVideosByLang("kk");
            seedVideosByLang("ru");
            seedVideosByLang("en");
            return "Videos seeded successfully!";
        } catch (Exception e) {
            throw new RuntimeException("Video seeding failed: " + e.getMessage(), e);
        }
    }

    private void seedVideosByLang(String langCode) throws Exception {
        ClassPathResource resource = new ClassPathResource("videos/" + langCode + "_videos.json");
        if (!resource.exists())
            return;

        JsonNode root;
        try (InputStreamReader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)) {
            root = mapper.readTree(reader);
        }
        for (JsonNode videoNode : root) {
            VideoLesson video = new VideoLesson();
            video.setTitle(videoNode.get("title").asText());
            video.setTitleKk(videoNode.has("titleKk") ? videoNode.get("titleKk").asText() : "");
            video.setTitleRu(videoNode.has("titleRu") ? videoNode.get("titleRu").asText() : "");
            video.setTitleEn(videoNode.has("titleEn") ? videoNode.get("titleEn").asText() : "");
            video.setDescription(videoNode.get("description").asText());
            video.setDescriptionKk(videoNode.has("descriptionKk") ? videoNode.get("descriptionKk").asText() : "");
            video.setDescriptionRu(videoNode.has("descriptionRu") ? videoNode.get("descriptionRu").asText() : "");
            video.setDescriptionEn(videoNode.has("descriptionEn") ? videoNode.get("descriptionEn").asText() : "");
            video.setYoutubeUrl(videoNode.get("youtubeUrl").asText());
            video.setYoutubeId(videoNode.get("youtubeId").asText());
            video.setDifficultyLevel(videoNode.get("difficulty").asText());
            video.setDurationMinutes(videoNode.has("duration") ? videoNode.get("duration").asInt() : 10);
            video.setXpReward(videoNode.has("xp") ? videoNode.get("xp").asInt() : 30);
            video.setOrderNumber(videoNode.get("order").asInt());
            video.setLanguage(langCode);
            video.setThumbnailUrl(videoNode.has("thumbnail") ? videoNode.get("thumbnail").asText()
                    : "https://img.youtube.com/vi/" + video.getYoutubeId() + "/maxresdefault.jpg");

            List<VideoQuestion> questions = new ArrayList<>();
            for (JsonNode qNode : videoNode.get("questions")) {
                questions.add(buildQuestion(video, qNode));
            }
            video.setQuestions(questions);
            videoLessonRepository.save(video);
        }
    }

    private VideoQuestion buildQuestion(VideoLesson video, JsonNode qNode) {
        VideoQuestion q = new VideoQuestion();
        q.setVideoLesson(video);
        q.setQuestionNumber(qNode.get("number").asInt());
        q.setQuestionText(qNode.get("text").asText());
        q.setQuestionTextKk(qNode.has("textKk") ? qNode.get("textKk").asText() : "");
        q.setQuestionTextRu(qNode.has("textRu") ? qNode.get("textRu").asText() : "");
        q.setQuestionTextEn(qNode.has("textEn") ? qNode.get("textEn").asText() : "");
        q.setQuestionType("multiple_choice");

        List<VideoAnswer> answers = new ArrayList<>();
        int i = 1;
        for (JsonNode aNode : qNode.get("answers")) {
            VideoAnswer a = new VideoAnswer();
            a.setQuestion(q);
            if (aNode.isObject()) {
                a.setAnswerText(aNode.get("text").asText());
                a.setAnswerTextKk(aNode.has("textKk") ? aNode.get("textKk").asText() : "");
                a.setAnswerTextRu(aNode.has("textRu") ? aNode.get("textRu").asText() : "");
                a.setAnswerTextEn(aNode.has("textEn") ? aNode.get("textEn").asText() : "");
                if (aNode.has("isCorrect")) {
                    a.setIsCorrect(aNode.get("isCorrect").asBoolean());
                } else if (qNode.has("correct")) {
                    a.setIsCorrect(aNode.get("text").asText().equals(qNode.get("correct").asText()));
                }
            } else {
                String aText = aNode.asText();
                a.setAnswerText(aText);
                a.setIsCorrect(qNode.has("correct") && aText.equals(qNode.get("correct").asText()));
            }
            a.setAnswerOrder(i++);
            answers.add(a);
        }
        q.setAnswers(answers);
        return q;
    }
}
