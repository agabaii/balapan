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
public class StoryJsonSeeder {

    @Autowired
    private StoryRepository storyRepository;
    @Autowired
    private UserStoryProgressRepository progressRepository;

    private final ObjectMapper mapper = new ObjectMapper();

    @Transactional
    public String reseedStories(boolean force) {
        if (force) {
            progressRepository.deleteAll();
            storyRepository.deleteAll();
        } else if (storyRepository.count() > 0) {
            return "Stories already exist. Use force=true to reseed.";
        }

        try {
            seedStoriesByLang("kk");
            seedStoriesByLang("ru");
            seedStoriesByLang("en");
            return "Stories seeded successfully!";
        } catch (Exception e) {
            throw new RuntimeException("Story seeding failed: " + e.getMessage(), e);
        }
    }

    private String getText(JsonNode node, String field) {
        return node.has(field) && !node.get(field).isNull() ? node.get(field).asText() : "";
    }

    private void seedStoriesByLang(String langCode) throws Exception {
        ClassPathResource resource = new ClassPathResource("stories/" + langCode + "_stories.json");
        if (!resource.exists()) {
            System.out.println("[StoryJsonSeeder] File not found: stories/" + langCode + "_stories.json — skipping");
            return;
        }

        JsonNode root;
        try (InputStreamReader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)) {
            root = mapper.readTree(reader);
        }

        System.out.println("[StoryJsonSeeder] Seeding " + root.size() + " stories for lang=" + langCode);

        for (JsonNode storyNode : root) {
            Story story = new Story();
            story.setTitle(getText(storyNode, "title"));
            story.setTitleRu(getText(storyNode, "titleRu"));
            story.setTitleKk(getText(storyNode, "titleKk"));
            story.setTitleEn(getText(storyNode, "titleEn"));

            // ИСПРАВЛЕНИЕ: null-safe для description
            story.setDescription(getText(storyNode, "description"));
            story.setDescriptionRu(getText(storyNode, "descriptionRu"));
            story.setDescriptionKk(getText(storyNode, "descriptionKk"));
            story.setDescriptionEn(getText(storyNode, "descriptionEn"));

            story.setDifficultyLevel(getText(storyNode, "difficulty"));
            story.setCategory(getText(storyNode, "category"));
            story.setEstimatedTime(storyNode.has("time") ? storyNode.get("time").asInt() : 5);
            story.setXpReward(storyNode.has("xp") ? storyNode.get("xp").asInt() : 20);
            story.setLanguage(langCode);
            story.setIsActive(true);
            story.setCoverImageUrl(storyNode.has("image") ? storyNode.get("image").asText() : "/story-cover.png");

            List<StoryChapter> chapters = new ArrayList<>();
            if (storyNode.has("chapters")) {
                for (JsonNode chNode : storyNode.get("chapters")) {
                    chapters.add(buildChapter(story, chNode));
                }
            }
            story.setChapters(chapters);
            storyRepository.save(story);
        }
    }

    private StoryChapter buildChapter(Story story, JsonNode chNode) {
        StoryChapter ch = new StoryChapter();
        ch.setStory(story);
        ch.setChapterNumber(chNode.get("number").asInt());
        ch.setCharacterName(chNode.has("character") ? chNode.get("character").asText() : null);
        ch.setTextKk(getText(chNode, "textKk"));
        ch.setTextRu(getText(chNode, "textRu"));
        ch.setTextEn(getText(chNode, "textEn"));

        List<StoryQuestion> questions = new ArrayList<>();
        if (chNode.has("questions")) {
            for (JsonNode qNode : chNode.get("questions")) {
                questions.add(buildQuestion(ch, qNode));
            }
        }
        ch.setQuestions(questions);
        return ch;
    }

    private StoryQuestion buildQuestion(StoryChapter ch, JsonNode qNode) {
        StoryQuestion q = new StoryQuestion();
        q.setChapter(ch);
        q.setQuestionNumber(1);
        q.setQuestionText(getText(qNode, "text"));
        q.setQuestionTextRu(getText(qNode, "textRu"));
        q.setQuestionTextKk(getText(qNode, "textKk"));
        q.setQuestionTextEn(getText(qNode, "textEn"));
        q.setQuestionType(qNode.has("questionType") ? qNode.get("questionType").asText() : "multiple_choice");

        List<StoryAnswer> answers = new ArrayList<>();
        int i = 1;
        if (qNode.has("answers")) {
            for (JsonNode aNode : qNode.get("answers")) {
                StoryAnswer a = new StoryAnswer();
                a.setQuestion(q);
                a.setAnswerText(getText(aNode, "text"));
                a.setAnswerTextKk(getText(aNode, "textKk"));
                a.setAnswerTextRu(getText(aNode, "textRu"));
                a.setAnswerTextEn(getText(aNode, "textEn"));
                a.setIsCorrect(aNode.has("isCorrect") && aNode.get("isCorrect").asBoolean());
                a.setAnswerOrder(i++);
                answers.add(a);
            }
        }
        q.setAnswers(answers);
        return q;
    }
}