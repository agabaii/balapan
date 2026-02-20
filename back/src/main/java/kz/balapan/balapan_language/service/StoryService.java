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
        @Transactional
        public void initializeStories() {
                // Delete progress first to avoid FK constraint violation, then recreate stories
                progressRepository.deleteAll();
                storyRepository.deleteAll();
                createKazakhStories();
                createRussianStories();
                createEnglishStories();
        }

        // ==================== BATCH CREATION HELPERS ====================

        private void createStoriesBatch(String language, List<StoryInitData> storiesData) {
                for (StoryInitData data : storiesData) {
                        if (!storyRepository
                                        .findByLanguageAndDifficultyLevelAndIsActiveTrue(language, data.difficulty())
                                        .stream()
                                        .anyMatch(s -> s.getTitle().equals(data.title()))) {

                                Story story = new Story();
                                story.setTitle(data.title());
                                story.setTitleRu(data.titleRu());
                                story.setTitleEn(data.titleEn());
                                story.setTitleKk(data.titleKk());
                                story.setDescription(data.description());
                                story.setDescriptionRu(data.descriptionRu());
                                story.setDescriptionEn(data.descriptionEn());
                                story.setDifficultyLevel(data.difficulty());
                                story.setEstimatedTime(data.time());
                                story.setXpReward(data.xp());
                                story.setCategory(data.category());
                                story.setCoverImageUrl(data.image());
                                story.setLanguage(language);
                                story.setIsActive(true);

                                List<StoryChapter> chapters = new ArrayList<>();
                                for (ChapterInitData chData : data.chapters()) {
                                        StoryChapter chapter = new StoryChapter();
                                        chapter.setStory(story);
                                        chapter.setChapterNumber(chData.number());
                                        chapter.setTitleKk(chData.titleKk());
                                        chapter.setTitleRu(chData.titleRu());
                                        chapter.setTitleEn(chData.titleEn());
                                        chapter.setCharacterName(chData.characterName());
                                        chapter.setCharacterImageUrl(chData.characterImage());
                                        chapter.setTextKk(chData.textKk());
                                        chapter.setTextRu(chData.textRu());
                                        chapter.setTextEn(chData.textEn());

                                        List<StoryQuestion> questions = new ArrayList<>();
                                        for (QuestionInitData qData : chData.questions()) {
                                                StoryQuestion question = new StoryQuestion();
                                                question.setChapter(chapter);
                                                question.setQuestionNumber(1);
                                                question.setQuestionType("multiple_choice");
                                                // Основной текст — на языке истории
                                                if ("russian".equals(language)) {
                                                        question.setQuestionText(qData.questionRu());
                                                } else if ("english".equals(language)) {
                                                        question.setQuestionText(qData.questionEn());
                                                } else {
                                                        question.setQuestionText(
                                                                        qData.questionKk() != null ? qData.questionKk()
                                                                                        : qData.questionRu());
                                                }
                                                question.setQuestionTextKk(qData.questionKk());
                                                question.setQuestionTextRu(qData.questionRu());
                                                question.setQuestionTextEn(qData.questionEn());

                                                List<StoryAnswer> answers = new ArrayList<>();
                                                int order = 1;
                                                for (AnswerInitData aData : qData.answers()) {
                                                        answers.add(createAnswer(question, aData.answerKk(),
                                                                        aData.answerRu(), aData.answerEn(), order++,
                                                                        aData.isCorrect(), language));
                                                }
                                                question.setAnswers(answers);
                                                questions.add(question);
                                        }
                                        chapter.setQuestions(questions);
                                        chapters.add(chapter);
                                }
                                story.setChapters(chapters);
                                storyRepository.save(story);
                        }
                }
        }

        private StoryAnswer createAnswer(StoryQuestion question, String textKk, String textRu, String textEn, int order,
                        boolean isCorrect, String language) {
                StoryAnswer answer = new StoryAnswer();
                answer.setQuestion(question);
                // Основной текст — на языке истории
                if ("russian".equals(language)) {
                        answer.setAnswerText(textRu);
                } else if ("english".equals(language)) {
                        answer.setAnswerText(textEn);
                } else {
                        answer.setAnswerText(textKk);
                }
                answer.setAnswerTextKk(textKk);
                answer.setAnswerTextRu(textRu);
                answer.setAnswerTextEn(textEn);
                answer.setAnswerOrder(order);
                answer.setIsCorrect(isCorrect);
                return answer;
        }

        private void createRussianStories() {
                List<StoryInitData> stories = new ArrayList<>();

                // 1. Secret of the Old Attic
                stories.add(new StoryInitData(
                                "Тайна старого чердака / Ескі шатырдың құпиясы", "Тайна старого чердака",
                                "Secret of the Old Attic",
                                "Ескі шатырдың құпиясы",
                                "Ivan finds an old chest in his grandmother's attic.",
                                "Иван находит старый сундук на чердаке у бабушки. Что скрывает прошлое?",
                                "Ivan finds an old chest in his grandmother's attic. What does the past hide?",
                                "beginner", 12, 60, "mystery", "/images/stories/attic.jpg",
                                List.of(
                                                new ChapterInitData(1, "Шатырдағы олжа", "Находка на чердаке",
                                                                "Discovery in the Attic",
                                                                "Жазғы демалыста Иван ауылға, әжесіне келді. Бірде ол ескі шатырға шығып, бұрышта тұрған үлкен темір сандықты көрді. Сандық өте ескі және шаң басып қалған еді.",
                                                                "На летних каникулах Иван приехал в деревню к бабушке. Однажды он поднялся на старый чердак и увидел в углу большой железный сундук. Сундук был очень старым и покрыт пылью.",
                                                                "On summer vacation, Ivan came to the village to see his grandmother. One day he went up to the old attic and saw a large iron chest in the corner. The chest was very old and covered in dust.",
                                                                "Иван", "/images/chars/ivan.png",
                                                                List.of(new QuestionInitData(
                                                                                "Иван не көрді?",
                                                                                "Что увидел Иван?",
                                                                                "What did Ivan see?",
                                                                                List.of(new AnswerInitData(
                                                                                                "Темір сандық",
                                                                                                "Железный сундук",
                                                                                                "Iron chest", true),
                                                                                                new AnswerInitData(
                                                                                                                "Ескі киім",
                                                                                                                "Старую одежду",
                                                                                                                "Old clothes",
                                                                                                                false))))),
                                                new ChapterInitData(2, "Ескі хат", "Старое письмо", "An Old Letter",
                                                                "Иван сандықты ашты. Ішінен ол сарғайған ескі хат пен күміс медаль тапты. Хатта: «Алда үлкен саяхат күтіп тұр...» – деп жазылыпты. Иван бұл жұмбақты шешуді ұйғарды.",
                                                                "Иван открыл сундук. Внутри он нашел пожелтевшее старое письмо и серебряную медаль. В письме было написано: «Впереди ждет большое путешествие...» Иван решил разгадать эту загадку.",
                                                                "Ivan opened the chest. Inside he found a yellowed old letter and a silver medal. The letter said: \"A great journey lies ahead...\" Ivan decided to solve this mystery.",
                                                                "Иван", "/images/chars/ivan.png",
                                                                List.of(new QuestionInitData(
                                                                                "Хатта не жазылған?",
                                                                                "Что было написано в письме?",
                                                                                "What was written in the letter?",
                                                                                List.of(new AnswerInitData(
                                                                                                "Үлкен саяхат",
                                                                                                "Большое путешествие",
                                                                                                "A great journey",
                                                                                                true),
                                                                                                new AnswerInitData(
                                                                                                                "Кешкі ас",
                                                                                                                "Ужин",
                                                                                                                "Dinner",
                                                                                                                false))))))));

                // 2. Moscow Adventure
                stories.add(new StoryInitData(
                                "Приключения в Москве / Мәскеудегі оқиғалар", "Приключения в Москве",
                                "Moscow Adventure",
                                "Мәскеудегі оқиғалар",
                                "A trip to the capital turns into a real quest.",
                                "Поездка в столицу превращается в настоящий квест.",
                                "A trip to the capital turns into a real quest.",
                                "intermediate", 15, 70, "travel", "/images/stories/moscow_adv.jpg",
                                List.of(
                                                new ChapterInitData(1, "Қызыл алаң", "Красная площадь",
                                                                "Red Square",
                                                                "Біз Мәскеудің қақ ортасына келдік. Қызыл алаң өте үлкен және әдемі екен! Кенеттен менің досым жоғалып кетті. Мен оны іздей бастадым.",
                                                                "Мы приехали в самый центр Москвы. Красная площадь такая огромная и красивая! Внезапно мой друг куда-то исчез. Я начал его искать.",
                                                                "We arrived in the very center of Moscow. Red Square is so huge and beautiful! Suddenly my friend disappeared somewhere. I started looking for him.",
                                                                "Турист", "/images/chars/tourist.png",
                                                                List.of(new QuestionInitData(
                                                                                "Досы не істеп кетті?",
                                                                                "Что случилось с другом?",
                                                                                "What happened to the friend?",
                                                                                List.of(new AnswerInitData(
                                                                                                "Жоғалып кетті",
                                                                                                "Исчез/потерялся",
                                                                                                "Disappeared/got lost",
                                                                                                true),
                                                                                                new AnswerInitData(
                                                                                                                "Билеп жатыр",
                                                                                                                "Танцует",
                                                                                                                "Dancing",
                                                                                                                false))))),
                                                new ChapterInitData(2, "Метро бекеті", "Станция метро", "Metro Station",
                                                                "Мен метроға түстім. «Маяковская» бекеті өте әдемі, жер асты сарайы сияқты! Онда мен досымды көрдім, ол станцияның суретін түсіріп жүр екен. Үлкен қалада бір-бірімізді тапқанымызға қуандық.",
                                                                "Я спустился в метро. Станция «Маяковская» такая красивая, как подземный дворец! Там я увидел своего друга, он фотографировал станцию. Мы обрадовались, что нашли друг друга в большом городе.",
                                                                "I went down into the metro. Mayakovskaya station is so beautiful, like an underground palace! There I saw my friend, he was taking pictures of the station. We were happy to find each other in the big city.",
                                                                "Друг", "/images/chars/friend.png",
                                                                List.of(new QuestionInitData(
                                                                                "Досы метро бекетінде не істеп жүр?",
                                                                                "Что делал друг на станции?",
                                                                                "What was the friend doing at the station?",
                                                                                List.of(new AnswerInitData(
                                                                                                "Сурет түсіріп жүр",
                                                                                                "Фотографировал",
                                                                                                "Taking pictures",
                                                                                                true),
                                                                                                new AnswerInitData(
                                                                                                                "Тамақ жеп отыр",
                                                                                                                "Ел",
                                                                                                                "Eating",
                                                                                                                false))))))));

                // 3. Russian Tea
                stories.add(new StoryInitData(
                                "Русское чаепитие / Russian Tea", "Русское чаепитие", "Russian Tea", "Орыс шайы",
                                "Традиции чаепития.", "Традиции чаепития.", "Tea drinking traditions.",
                                "beginner", 5, 30, "food", "/images/stories/tea.jpg",
                                List.of(new ChapterInitData(1, "Шай ішу", "Чаепитие", "Tea Time",
                                                "Ресейде шай ішкенді өте жақсы көреді. Әдетте шайды лимонмен және қантпен, сондай-ақ пряниктермен ішеді.",
                                                "В России очень любят пить чай. Обычно чай пьют с лимоном и сахаром, а также с пряниками.",
                                                "In Russia, people love drinking tea. Usually tea is drunk with lemon and sugar, as well as with gingerbread.",
                                                "Бабушка", null,
                                                List.of(new QuestionInitData("Шайды немен ішеді?", "С чем пьют чай?",
                                                                "What do they drink tea with?",
                                                                List.of(new AnswerInitData("Лимонмен", "С лимоном",
                                                                                "With lemon", true),
                                                                                new AnswerInitData("Тұзбен", "С солью",
                                                                                                "With salt",
                                                                                                false))))))));

                // 4. Ballet
                stories.add(new StoryInitData(
                                "Русский балет / Russian Ballet", "Русский балет", "Russian Ballet", "Орыс балеті",
                                "Поход в театр.", "Поход в театр.", "Going to the theater.",
                                "intermediate", 8, 50, "culture", "/images/stories/ballet.jpg",
                                List.of(new ChapterInitData(1, "Театрға бару", "Поход в театр", "Going to the Theater",
                                                "Кеше біз Үлкен театрға \"Аққу көлі\" балетіне бардық. Бұл керемет әдемі болды.",
                                                "Вчера мы ходили в Большой театр на балет \"Лебединое озеро\". Это было невероятно красиво.",
                                                "Yesterday we went to the Bolshoi Theater to see the ballet \"Swan Lake\". It was incredibly beautiful.",
                                                "Зритель", null,
                                                List.of(new QuestionInitData("Олар қайда барды?", "Куда они ходили?",
                                                                "Where did they go?",
                                                                List.of(new AnswerInitData("Театрға", "В театр",
                                                                                "To the theater", true),
                                                                                new AnswerInitData("Киноға", "В кино",
                                                                                                "To the cinema",
                                                                                                false))))))));

                // 5. The Hermitage
                stories.add(new StoryInitData(
                                "Эрмитаж / The Hermitage", "Эрмитаж", "The Hermitage", "Эрмитаж",
                                "Музей в Санкт-Петербурге.", "Музей в Санкт-Петербурге.", "Museum in St. Petersburg.",
                                "intermediate", 9, 55, "travel", "/images/stories/hermitage.jpg",
                                List.of(new ChapterInitData(1, "Мұражайда", "В музее", "In the Museum",
                                                "Эрмитаж - әлемдегі ең үлкен мұражайлардың бірі. Ол Санкт-Петербургте орналасқан.",
                                                "Эрмитаж - один из самых больших музеев мира. Он находится в Санкт-Петербурге.",
                                                "The Hermitage is one of the largest museums in the world. It is located in St. Petersburg.",
                                                "Гид", null,
                                                List.of(new QuestionInitData("Эрмитаж қайда орналасқан?",
                                                                "Где находится Эрмитаж?",
                                                                "Where is the Hermitage located?",
                                                                List.of(new AnswerInitData("Санкт-Петербургте",
                                                                                "В Санкт-Петербурге",
                                                                                "In St. Petersburg", true),
                                                                                new AnswerInitData("Мәскеуде",
                                                                                                "В Москве", "In Moscow",
                                                                                                false))))))));

                // 6. Dacha Life
                stories.add(new StoryInitData(
                                "На даче / At the Dacha", "На даче", "At the Dacha", "Саяжайда",
                                "Летний отдых.", "Летний отдых.", "Summer vacation.",
                                "beginner", 6, 30, "daily_life", "/images/stories/dacha.jpg",
                                List.of(new ChapterInitData(1, "Саяжайда демалу", "Отдых на даче",
                                                "Vacation at the Dacha",
                                                "Жазда біз саяжайға жиі барамыз. Онда біз көкөніс өсіреміз және таза ауада демаламыз.",
                                                "Летом мы часто ездим на дачу. Там мы выращиваем овощи и отдыхаем на свежем воздухе.",
                                                "In summer we often go to the dacha. There we grow vegetables and relax in the fresh air.",
                                                "Дачник", null,
                                                List.of(new QuestionInitData("Саяжайда не істейді?",
                                                                "Что делают на даче?",
                                                                "What do they do at the dacha?",
                                                                List.of(new AnswerInitData("Көкөніс өсіреді",
                                                                                "Выращивают овощи", "Grow vegetables",
                                                                                true),
                                                                                new AnswerInitData(
                                                                                                "Кеңседе жұмыс істейді",
                                                                                                "Работают в офисе",
                                                                                                "Work in office",
                                                                                                false))))))));

                // 7. Metro
                stories.add(new StoryInitData(
                                "Московское метро / Moscow Metro", "Московское метро", "Moscow Metro", "Мәскеу метросы",
                                "Красивые станции.", "Красивые станции.", "Beautiful stations.",
                                "intermediate", 7, 40, "travel", "/images/stories/metro.jpg",
                                List.of(new ChapterInitData(1, "Метро", "Метро", "Metro",
                                                "Мәскеу метросы өте әдемі, жер асты сарайы сияқты. Станциялар мозаикамен және люстрамен безендірілген.",
                                                "Московское метро очень красивое, как подземный дворец. Станции украшены мозаикой и люстрами.",
                                                "The Moscow metro is very beautiful, like an underground palace. Stations are decorated with mosaics and chandeliers.",
                                                "Пассажир", null,
                                                List.of()))));

                // 8. Pancakes (Blini)
                stories.add(new StoryInitData(
                                "Блины / Pancakes", "Блины", "Pancakes", "Құймақ",
                                "Русская кухня.", "Русская кухня.", "Russian cuisine.",
                                "beginner", 5, 25, "food", "/images/stories/blini.jpg",
                                List.of(new ChapterInitData(1, "Құймақ", "Блины", "Pancakes",
                                                "Әжем дәмді құймақ пісірді. Біз оларды қаймақпен және тосаппен жейміз.",
                                                "Бабушка испекла вкусные блины. Мы едим их со сметаной и вареньем.",
                                                "Grandmother baked delicious pancakes. We eat them with sour cream and jam.",
                                                "Внук", null,
                                                List.of()))));

                // 9. Matryoshka
                stories.add(new StoryInitData(
                                "Матрёшка / Matryoshka", "Матрёшка", "Matryoshka", "Матрёшка",
                                "Русский сувенир.", "Русский сувенир.", "Russian souvenir.",
                                "beginner", 4, 20, "culture", "/images/stories/matryoshka.jpg",
                                List.of(new ChapterInitData(1, "Матрёшка", "Матрёшка", "Matryoshka",
                                                "Матрёшка - бұл ағаш қуыршақ. Оның ішінде кішкентай қуыршақтар жасырылған.",
                                                "Матрёшка - это деревянная кукла. Внутри неё прячутся другие куклы поменьше.",
                                                "Matryoshka is a wooden doll. Smaller dolls are hiding inside it.",
                                                "Продавец", null,
                                                List.of()))));

                // 10. Baikal
                stories.add(new StoryInitData(
                                "Озеро Байкал / Lake Baikal", "Озеро Байкал", "Lake Baikal", "Байкал көлі",
                                "Самое глубокое озеро.", "Самое глубокое озеро.", "The deepest lake.",
                                "advanced", 10, 60, "nature", "/images/stories/baikal.jpg",
                                List.of(new ChapterInitData(1, "Байкал", "Байкал", "Baikal",
                                                "Байкал - әлемдегі ең терең көл. Оның суы өте таза және суық.",
                                                "Байкал - самое глубокое озеро в мире. Вода в нём очень чистая и холодная.",
                                                "Baikal is the deepest lake in the world. The water in it is very clean and cold.",
                                                "Рыбак", null,
                                                List.of()))));

                createStoriesBatch("russian", stories);
        }

        private void createEnglishStories() {
                List<StoryInitData> stories = new ArrayList<>();

                // 1. The Mysterious Package
                stories.add(new StoryInitData(
                                "The Mysterious Package / Жұмбақ сәлемдеме", "Таинственная посылка",
                                "The Mysterious Package",
                                "Жұмбақ сәлемдеме",
                                "Tom receives a package he didn't order. What's inside?",
                                "Том получает посылку, которую он не заказывал. Что внутри?",
                                "Tom receives a package he didn't order. What's inside?",
                                "beginner", 10, 50, "mystery", "/images/stories/package.jpg",
                                List.of(
                                                new ChapterInitData(1, "Күтпеген сыйлық", "Неожиданный подарок",
                                                                "An Unexpected Gift",
                                                                "Бірде таңертең Том есігінің алдынан үлкен қорап тапты. Онда оның есімі жазылған, бірақ жіберуші көрсетілмеген. Том: «Мұны кім жіберді екен?» – деп ойлады.",
                                                                "Однажды утром Том нашел большую коробку перед своей дверью. На ней было написано его имя, но отправитель не был указан. Том подумал: «Интересно, кто это прислал?»",
                                                                "One morning Tom found a large box in front of his door. His name was written on it, but the sender was not specified. Tom thought: \"I wonder who sent this?\"",
                                                                "Tom", "/images/chars/tom.png",
                                                                List.of(new QuestionInitData(
                                                                                "Қорапта кімнің аты жазылған?",
                                                                                "Чье имя было на коробке?",
                                                                                "Whose name was on the box?",
                                                                                List.of(new AnswerInitData(
                                                                                                "Томның",
                                                                                                "Тома",
                                                                                                "Tom's", true),
                                                                                                new AnswerInitData(
                                                                                                                "Көршісінің",
                                                                                                                "Соседа",
                                                                                                                "Neighbor's",
                                                                                                                false))))),
                                                new ChapterInitData(2, "Қорапты ашу", "Открытие коробки",
                                                                "Opening the Box",
                                                                "Том қорапты абайлап ашты. Ішінде ескі кітап пен кішкентай алтын кілт болды. Кітаптың мұқабасында «Батырдың жолы» деп жазылған. Том қатты таңғалды.",
                                                                "Том осторожно открыл коробку. Внутри была старая книга и маленький золотой ключ. На обложке книги было написано «Путь героя». Том был очень удивлен.",
                                                                "Tom carefully opened the box. Inside was an old book and a small golden key. On the cover of the book it was written \"The Hero's Way\". Tom was very surprised.",
                                                                "Tom", "/images/chars/tom.png",
                                                                List.of(new QuestionInitData(
                                                                                "Ішінде не болды?",
                                                                                "Что было внутри?",
                                                                                "What was inside?",
                                                                                List.of(new AnswerInitData(
                                                                                                "Кітап пен кілт",
                                                                                                "Книга и ключ",
                                                                                                "A book and a key",
                                                                                                true),
                                                                                                new AnswerInitData(
                                                                                                                "Ойыншық",
                                                                                                                "Игрушка",
                                                                                                                "A toy",
                                                                                                                false))))),
                                                new ChapterInitData(3, "Жұмбақты шешу", "Решение загадки",
                                                                "Solving the Mystery",
                                                                "Том кітапты парақтай бастады. Соңғы бетінде кішкентай құлып бар еді. Ол алтын кілтті салып, бұрап жіберді. Кенеттен бөлме нұрға бөленді!",
                                                                "Том начал листать книгу. На последней странице был маленький замочек. Он вставил золотой ключ и повернул его. Внезапно комната наполнилась светом!",
                                                                "Tom started flipping through the book. On the last page there was a small lock. He inserted the golden key and turned it. Suddenly the room was filled with light!",
                                                                "Tom", "/images/chars/tom.png",
                                                                List.of(new QuestionInitData(
                                                                                "Том кілтті қайда салды?",
                                                                                "Куда Том вставил ключ?",
                                                                                "Where did Tom insert the key?",
                                                                                List.of(new AnswerInitData(
                                                                                                "Кітаптағы құлыпқа",
                                                                                                "В замок в книге",
                                                                                                "In the lock in the book",
                                                                                                true),
                                                                                                new AnswerInitData(
                                                                                                                "Есікке",
                                                                                                                "В дверь",
                                                                                                                "In the door",
                                                                                                                false))))))));

                // 2. Lost in London
                stories.add(new StoryInitData(
                                "Lost in London / Лондонда адасу", "Потерянный в Лондоне", "Lost in London",
                                "Лондонда адасу",
                                "A tourist gets lost in the big city. Can Sarah help?",
                                "Турист теряется в большом городе. Сможет ли Сара помочь?",
                                "A tourist gets lost in the big city. Can Sarah help?",
                                "intermediate", 12, 60, "travel", "/images/stories/london_lost.jpg",
                                List.of(
                                                new ChapterInitData(1, "Таныс емес көше", "Незнакомая улица",
                                                                "An Unknown Street",
                                                                "Марк Лондонда бірінші рет болды. Ол картаға қарап тұрып, қайда екенін түсінбеді. «Кешіріңіз, маған көмектесе аласыз ба?» – деп сұрады ол өтіп бара жатқан қыздан.",
                                                                "Марк был в Лондоне впервые. Он смотрел на карту и не понимал, где находится. «Извините, вы можете мне помочь?» — спросил он проходящую мимо девушку.",
                                                                "Mark was in London for the first time. He looked at the map and didn't understand where he was. \"Excuse me, can you help me?\" he asked a girl passing by.",
                                                                "Mark", "/images/chars/mark.png",
                                                                List.of(new QuestionInitData(
                                                                                "Марк не істеп жатыр?",
                                                                                "Что делает Марк?",
                                                                                "What is Mark doing?",
                                                                                List.of(new AnswerInitData(
                                                                                                "Көмек сұрап тұр",
                                                                                                "Просит помощи",
                                                                                                "Asking for help",
                                                                                                true),
                                                                                                new AnswerInitData(
                                                                                                                "Ұйықтап жатыр",
                                                                                                                "Спит",
                                                                                                                "Sleeping",
                                                                                                                false))))),
                                                new ChapterInitData(2, "Сараның көмегі", "Помощь Сары", "Sarah's Help",
                                                                "«Әрине! – деп жауап берді Сара күлімсіреп. – Сіз қазір Бейкер-стриттесіз. Шерлок Холмстың мұражайы дәл осы жерде». Марк қуанып кетті, өйткені ол дәл осы жерді іздеген еді.",
                                                                "«Конечно! — улыбнулась Сара. — Вы сейчас на Бейкер-стрит. Музей Шерлока Холмса прямо здесь». Марк обрадовался, потому что искал именно это место.",
                                                                "\"Of course!\" Sarah smiled. \"You are on Baker Street now. Sherlock Holmes Museum is right here.\" Mark was happy because he was looking for exactly this place.",
                                                                "Sarah", "/images/chars/sarah.png",
                                                                List.of(new QuestionInitData(
                                                                                "Олар қазір қай көшеде?",
                                                                                "На какой они сейчас улице?",
                                                                                "What street are they on now?",
                                                                                List.of(new AnswerInitData(
                                                                                                "Бейкер-стрит",
                                                                                                "Бейкер-стрит",
                                                                                                "Baker Street", true),
                                                                                                new AnswerInitData(
                                                                                                                "Оксфорд-стрит",
                                                                                                                "Оксфорд-стрит",
                                                                                                                "Oxford Street",
                                                                                                                false))))))));

                // 2. London Tour
                stories.add(new StoryInitData(
                                "London Tour / Лондонға саяхат", "Тур по Лондону", "London Tour", "Лондонға саяхат",
                                "Exploring the streets of London.", "Изучение улиц Лондона.",
                                "Exploring the streets of London.",
                                "intermediate", 8, 45, "travel", "/images/stories/london.jpg",
                                List.of(
                                                new ChapterInitData(1, "Лондонға қош келдіңіз",
                                                                "Добро пожаловать в Лондон", "Welcome to London",
                                                                "Лондонға қош келдіңіз!",
                                                                "Добро пожаловать в Лондон!",
                                                                "Welcome to London!",
                                                                "Guide", null,
                                                                List.of(new QuestionInitData("Бұл қандай автобус?",
                                                                                "Какой это автобус?", "What bus is it?",
                                                                                List.of(new AnswerInitData(
                                                                                                "Екі қабатты",
                                                                                                "Двухэтажный",
                                                                                                "Double-decker",
                                                                                                true),
                                                                                                new AnswerInitData(
                                                                                                                "Кішкентай такси",
                                                                                                                "Маленькое такси",
                                                                                                                "Small taxi",
                                                                                                                false))))),
                                                new ChapterInitData(2, "Биг Бен", "Биг Бен", "Big Ben",
                                                                "Алдымызда зәулім Биг Бен.",
                                                                "Перед нами великолепный Биг Бен.",
                                                                "In front of us is the magnificent Big Ben.",
                                                                "Guide", null,
                                                                List.of(new QuestionInitData("Биг Бен деген не?",
                                                                                "Что такое Биг Бен?",
                                                                                "What is Big Ben?",
                                                                                List.of(new AnswerInitData(
                                                                                                "Сағат мұнарасы",
                                                                                                "Часовая башня",
                                                                                                "Clock tower", true),
                                                                                                new AnswerInitData(
                                                                                                                "Көпір",
                                                                                                                "Мост",
                                                                                                                "A bridge",
                                                                                                                false))))))));

                // 3. Football
                stories.add(new StoryInitData(
                                "Football Match / Футбол матчы", "Футбольный матч", "Football Match", "Футбол матчы",
                                "Watching a game.", "Просмотр игры.", "Watching a game.",
                                "beginner", 5, 30, "hobby", "/images/stories/football.jpg",
                                List.of(new ChapterInitData(1, "Футбол", "Футбол", "Football",
                                                "Менің сүйікті командам бүгін ойнайды.",
                                                "Моя любимая команда сегодня играет.",
                                                "My favorite team is playing today.",
                                                "Fan", null,
                                                List.of(new QuestionInitData("Ойынды кім бастайды?",
                                                                "Кто начинает игру?", "Who starts the game?",
                                                                List.of(new AnswerInitData("Төреші", "Судья",
                                                                                "The referee", true),
                                                                                new AnswerInitData("Жанкүйер",
                                                                                                "Болельщик", "The fan",
                                                                                                false))))))));

                // 4. Tea Time
                stories.add(new StoryInitData(
                                "English Tea / Ағылшын шайы", "Английский чай", "English Tea", "Ағылшын шайы",
                                "Tradition of 5 o'clock tea.", "Традиция пить чай в 5 часов.",
                                "Tradition of 5 o'clock tea.",
                                "beginner", 5, 30, "culture", "/images/stories/tea_en.jpg",
                                List.of(new ChapterInitData(1, "Шай ішу", "Чаепитие", "Tea Time",
                                                "Ағылшындар шайды сүтпен ішеді.",
                                                "Англичане пьют чай с молоком.",
                                                "English people drink tea with milk.",
                                                "Lady", null,
                                                List.of(new QuestionInitData("Шайға не қосады?",
                                                                "Что добавляют в чай?", "What do they add to tea?",
                                                                List.of(new AnswerInitData("Сүт", "Молоко", "Milk",
                                                                                true),
                                                                                new AnswerInitData("Тұз", "Соль",
                                                                                                "Salt", false))))))));

                // 5. Rain
                stories.add(new StoryInitData(
                                "Rainy Day / Жаңбырлы күн", "Дождливый день", "Rainy Day", "Жаңбырлы күн",
                                "Weather in England.", "Погода в Англии.", "Weather in England.",
                                "beginner", 4, 25, "daily_life", "/images/stories/rain.jpg",
                                List.of(new ChapterInitData(1, "Жаңбырлы күн", "Дождливый день", "Rainy Day",
                                                "Лондонда жиі жаңбыр жауады.",
                                                "В Лондоне часто идет дождь.",
                                                "It rains often in London.",
                                                "Resident", null,
                                                List.of(new QuestionInitData("Әдетте ауа райы қандай?",
                                                                "Какая обычно погода?", "What is the weather usually?",
                                                                List.of(new AnswerInitData("Жаңбырлы", "Дождливая",
                                                                                "Rainy", true),
                                                                                new AnswerInitData("Күн ашық",
                                                                                                "Солнечная",
                                                                                                "Sunny", false))))))));

                // 6. Buckingham Palace
                stories.add(new StoryInitData(
                                "The Queen's Palace / Патшайым сарайы", "Дворец королевы", "The Queen's Palace",
                                "Патшайым сарайы",
                                "Visiting the palace.", "Посещение дворца.", "Visiting the palace.",
                                "intermediate", 7, 40, "travel", "/images/stories/palace.jpg",
                                List.of(new ChapterInitData(1, "Букингем сарайы", "Букингемский дворец",
                                                "Buckingham Palace",
                                                "Патшайым Букингем сарайында тұрады.",
                                                "Королева живет в Букингемском дворце.",
                                                "The Queen lives in Buckingham Palace.",
                                                "Guide", null,
                                                List.of(new QuestionInitData("Онда кім тұрады?", "Кто там живет?",
                                                                "Who lives there?",
                                                                List.of(new AnswerInitData("Патшайым", "Королева",
                                                                                "The Queen", true),
                                                                                new AnswerInitData("Президент",
                                                                                                "Президент",
                                                                                                "The President",
                                                                                                false))))))));

                // 7. Oxford
                stories.add(new StoryInitData(
                                "Oxford University / Оксфорд университеті", "Университет Оксфорд", "Oxford University",
                                "Оксфорд университеті",
                                "Famous university.", "Знаменитый университет.", "Famous university.",
                                "advanced", 8, 50, "education", "/images/stories/oxford.jpg",
                                List.of(new ChapterInitData(1, "Оксфорд", "Оксфорд", "Oxford",
                                                "Оксфорд - ең ескі университет.",
                                                "Оксфорд - старейший университет.",
                                                "Oxford is the oldest university.",
                                                "Student", null,
                                                List.of()))));

                // 8. Beatles
                stories.add(new StoryInitData(
                                "The Beatles / Битлз", "The Beatles", "The Beatles", "Битлз",
                                "Music history.", "История музыки.", "Music history.",
                                "intermediate", 6, 40, "culture", "/images/stories/beatles.jpg",
                                List.of(new ChapterInitData(1, "Битлз", "Битлз", "The Beatles",
                                                "Битлз Ливерпульден.",
                                                "Битлз из Ливерпуля.",
                                                "The Beatles are from Liverpool.",
                                                "Musician", null,
                                                List.of()))));

                // 9. Fish and Chips
                stories.add(new StoryInitData(
                                "Fish and Chips / Балық және картоп", "Рыба и картошка", "Fish and Chips",
                                "Балық және картоп",
                                "Traditional food.", "Традиционная еда.", "Traditional food.",
                                "beginner", 5, 30, "food", "/images/stories/fish.jpg",
                                List.of(new ChapterInitData(1, "Дәмді тағам", "Вкусная еда", "Delicious Food",
                                                "Бұл танымал тағам.",
                                                "Это популярная еда.",
                                                "This is popular food.",
                                                "Chef", null,
                                                List.of()))));

                // 10. Sherlock
                stories.add(new StoryInitData(
                                "detective Sherlock / Детектив Шерлок", "Детектив Шерлок", "Detective Sherlock",
                                "Детектив Шерлок",
                                "Famous detective.", "Знаменитый детектив.", "Famous detective.",
                                "intermediate", 7, 45, "culture", "/images/stories/sherlock.jpg",
                                List.of(new ChapterInitData(1, "Шерлок Холмс", "Шерлок Холмс", "Sherlock Holmes",
                                                "Бұл детектив Шерлок Холмс.",
                                                "Это знаменитый детектив Шерлок Холмс.",
                                                "This is famous detective Sherlock Holmes.",
                                                "Detective", null,
                                                List.of()))));

                createStoriesBatch("english", stories);
        }

        // ==================== RECORDS ====================

        record StoryInitData(
                        String title, String titleRu, String titleEn, String titleKk,
                        String description, String descriptionRu, String descriptionEn,
                        String difficulty, int time, int xp, String category, String image,
                        List<ChapterInitData> chapters) {
        }

        record ChapterInitData(
                        int number, String titleKk, String titleRu, String titleEn,
                        String textKk, String textRu, String textEn,
                        String characterName, String characterImage,
                        List<QuestionInitData> questions) {
        }

        record QuestionInitData(
                        String questionKk, String questionRu, String questionEn,
                        List<AnswerInitData> answers) {
        }

        record AnswerInitData(
                        String answerKk, String answerRu, String answerEn,
                        boolean isCorrect) {
        }

        // ==================== PUBLIC METHODS ====================

        public List<Story> getAllActiveStories(String language) {
                if (language == null)
                        language = "kazakh";
                return storyRepository.findByLanguageAndIsActiveTrue(language);
        }

        public List<Story> getStoriesByDifficulty(String difficulty, String language) {
                if (language == null)
                        language = "kazakh";
                return storyRepository.findByLanguageAndDifficultyLevelAndIsActiveTrue(language, difficulty);
        }

        @SuppressWarnings("null")
        public Optional<Story> getStoryById(Long id) {
                return storyRepository.findById(id);
        }

        @SuppressWarnings("null")
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

        private void createKazakhStories() {
                List<StoryInitData> stories = new ArrayList<>();

                // 1. Алтын адам (EXPANDED & IMPROVED)
                stories.add(new StoryInitData(
                                "Алтын адам құпиясы / The Secret of the Golden Man", "Тайна Золотого человека",
                                "The Secret of the Golden Man", "Алтын адам құпиясы",
                                "История об уникальной археологической находке, которая изменила представление о степной цивилизации.",
                                "История о сакском воине, найденном в Иссыкском кургане. Узнайте о технологиях и искусстве древних кочевников.",
                                "The story of the Saka warrior found in the Issyk mound. Learn about the technologies and art of ancient nomads.",
                                "intermediate", 15, 75, "history", "/images/stories/golden_man.jpg",
                                List.of(
                                                new ChapterInitData(1, "Табылу тарихы", "История находки",
                                                                "Discovery History",
                                                                "1969 жылы Кемал Ақышев бастаған археологтар Алматы қаласының маңында үлкен жаңалық ашты. Есік қорғанынан олар сақ ханзадасының ежелгі зиратын тапты. Оның денесі толығымен таза алтыннан жасалған сауытпен қапталған еді.",
                                                                "В 1969 году археологи под руководством Кемаля Акишева сделали великое открытие близ города Алматы. В Иссыкском кургане они обнаружили древнее захоронение сакского царевича. Его тело было полностью защищено доспехами из чистого золота.",
                                                                "In 1969, archaeologists under the leadership of Kemal Akishev made a great discovery near the city of Almaty. In the Issyk mound, they discovered the ancient burial of a Saka prince. His body was completely protected by armor made of pure gold.",
                                                                "Гид", null,
                                                                List.of(new QuestionInitData("Қай жылы табылды?",
                                                                                "В каком году было сделано открытие?",
                                                                                "In what year was the discovery made?",
                                                                                List.of(new AnswerInitData("1969 жылы",
                                                                                                "В 1969 году",
                                                                                                "In 1969", true),
                                                                                                new AnswerInitData(
                                                                                                                "1991 жылы",
                                                                                                                "В 1991 году",
                                                                                                                "In 1991",
                                                                                                                false))))),
                                                new ChapterInitData(2, "Алтын киім", "Золотая одежда", "Golden Clothes",
                                                                "Алтын адамның киімі төрт мыңнан астам алтын әшекейлерден тұрады. Оның биік бас киімінде ұшатын тұлпарлар, барыстар және алтын жебелер бейнеленген. Әрбір бөлшектің өзіндік терең мағынасы бар және жердің аспанмен байланысын білдіреді.",
                                                                "Костюм Золотого человека состоит из более чем четырех тысяч золотых украшений. На его высоком головном уборе изображены летающие кони, барсы и золотые стрелы. Каждая деталь имеет свой глубокий смысл и символизирует связь земли с небом.",
                                                                "The Golden Man's costume consists of more than four thousand gold ornaments. His tall headdress depicts flying horses, snow leopards and gold arrows. Each detail has its own deep meaning and symbolizes the connection of the earth with the sky.",
                                                                "Тарихшы", null,
                                                                List.of(new QuestionInitData(
                                                                                "Киім неше әшекейден тұрады?",
                                                                                "Из скольких украшений состоит костюм?",
                                                                                "How many ornaments does the costume consist of?",
                                                                                List.of(new AnswerInitData(
                                                                                                "4000-нан астам",
                                                                                                "Более 4000",
                                                                                                "More than 4000", true),
                                                                                                new AnswerInitData(
                                                                                                                "100-ден астам",
                                                                                                                "Более 100",
                                                                                                                "More than 100",
                                                                                                                false))))),
                                                new ChapterInitData(3, "Тәуелсіздік нышаны", "Символ независимости",
                                                                "Symbol of Independence",
                                                                "Бүгінде Алтын адам – бұл тек мұражай жәдігері емес, тәуелсіз Қазақстанның нағыз нышаны. Оның бейнесін барлық жерден көруге болады: монеталарда, маркаларда және тіпті елтаңбада. Бізде осындай бай мәдени мұра бар екенін мақтан тұтамыз.",
                                                                "Сегодня Золотой человек – это не просто музейный экспонат, а настоящий символ независимого Казахстана. Его изображение можно увидеть повсюду: на монетах, марках и даже на гербе. Мы гордимся тем, что у нас есть такое богатое культурное наследие.",
                                                                "Today, the Golden Man is not just a museum piece, but a real symbol of independent Kazakhstan. His image can be seen everywhere: on coins, stamps and even on the coat of arms. We are proud that we have such a rich cultural heritage.",
                                                                "Студент", null,
                                                                List.of(new QuestionInitData("Ол ненің нышаны?",
                                                                                "Символом чего он является?",
                                                                                "What is he a symbol of?",
                                                                                List.of(new AnswerInitData(
                                                                                                "Тәуелсіздіктің",
                                                                                                "Независимости",
                                                                                                "Independence", true),
                                                                                                new AnswerInitData(
                                                                                                                "Байлықтың",
                                                                                                                "Богатства",
                                                                                                                "Wealth",
                                                                                                                false))))))));

                // 2. Наурыз мейрамы
                stories.add(new StoryInitData(
                                "Наурыз мейрамы / Nauryz Holiday", "Праздник Наурыз", "Nauryz Holiday",
                                "Наурыз мейрамы",
                                "Весенний праздник обновления природы.",
                                "День весеннего равноденствия, когда природа просыпается и начинается новый год.",
                                "The day of the spring equinox, when nature wakes up and the new year begins.",
                                "beginner", 10, 50, "culture", "/images/stories/nauryz.jpg",
                                List.of(
                                                new ChapterInitData(1, "Табиғаттың оянуы", "Пробуждение природы",
                                                                "Nature Awakening",
                                                                "Наурыз – бұл көктем мен жаңару мерекесі. Бұл күні күн мен түн теңеседі, ал табиғат ұзақ қысқы ұйқыдан ояна бастайды. Құстар жылы жақтан оралады, ал ағаштарда алғашқы бүршіктер пайда болады.",
                                                                "Наурыз – это праздник весны и обновления. В этот день день равен ночи, и природа начинает пробуждаться от долгого зимнего сна. Птицы возвращаются из теплых стран, а на деревьях появляются первые почки.",
                                                                "Nauryz is a holiday of spring and renewal. On this day, the day is equal to the night, and nature begins to awaken from its long winter sleep. Birds return from warm countries, and the first buds appear on the trees.",
                                                                "Ата", null,
                                                                List.of(new QuestionInitData("Наурыз қандай мереке?",
                                                                                "Какой это праздник?",
                                                                                "What kind of holiday is this?",
                                                                                List.of(new AnswerInitData(
                                                                                                "Көктем мен жаңару",
                                                                                                "Весны и обновления",
                                                                                                "Spring and renewal",
                                                                                                true),
                                                                                                new AnswerInitData(
                                                                                                                "Қысқы ойындар",
                                                                                                                "Зимних игр",
                                                                                                                "Winter games",
                                                                                                                false))))),
                                                new ChapterInitData(2, "Наурыз көже", "Наурыз коже", "Nauryz Kozhe",
                                                                "Дастархандағы ең басты тағам – наурыз көже. Анамыз оны ескі рецепт бойынша жеті мәзірден дайындайды: су, ет, тұз, май, ұн, дән және сүт. Жеті саны өмірдің жеті негізін білдіреді.",
                                                                "Самое главное блюдо на столе – это наурыз-коже. Мама готовит его по старинному рецепту из семи обязательных компонентов: воды, мяса, соли, жира, муки, зерна и молока. Число семь символизирует семь основ жизни.",
                                                                "The most important dish on the table is nauryz-kozhe. Mom cooks it according to an old recipe from seven mandatory components: water, meat, salt, fat, flour, grain and milk. The number seven symbolizes the seven pillars of life.",
                                                                "Ана", null,
                                                                List.of(new QuestionInitData("Көже неше дәмнен тұрады?",
                                                                                "Из скольких компонентов состоит коже?",
                                                                                "How many components does kozhe consist of?",
                                                                                List.of(new AnswerInitData("Жеті",
                                                                                                "Семь", "Seven",
                                                                                                true),
                                                                                                new AnswerInitData(
                                                                                                                "Бес",
                                                                                                                "Пять",
                                                                                                                "Five",
                                                                                                                false))))),
                                                new ChapterInitData(3, "Қонақжайлылық", "Гостеприимство", "Hospitality",
                                                                "Наурыз мерекесінде адамдар бір-біріне қонаққа барады және ескі өкпелерін кешіреді. Әр үйге бай дастархан жайылады. Жастар Алтыбақан теуіп, ән айтады және ұлттық ойындар ойнайды.",
                                                                "В праздник Наурыз люди ходят друг к другу в гости и прощают старые обиды. В каждом доме накрывают богатый дастархан. Молодежь качается на качелях Алтыбакан, поет песни и играет в национальные игры.",
                                                                "During the Nauryz holiday, people visit each other and forgive old grievances. In every house a rich dastarkhan is set. Young people swing on Altybakan swings, sing songs and play national games.",
                                                                "Маржан", null,
                                                                List.of(new QuestionInitData("Жастар не істейді?",
                                                                                "Что делают молодые люди?",
                                                                                "What do young people do?",
                                                                                List.of(new AnswerInitData(
                                                                                                "Алтыбақан тебеді",
                                                                                                "Качаются на качелях",
                                                                                                "Swing on swings",
                                                                                                true),
                                                                                                new AnswerInitData(
                                                                                                                "Ұйықтайды",
                                                                                                                "Спят",
                                                                                                                "Sleep",
                                                                                                                false))))))));

                // 3. Кафеде
                stories.add(new StoryInitData(
                                "Кафеде / At the Cafe", "В кафе", "At the Cafe", "Кафеде",
                                "Разговор двух друзей во время обеда.",
                                "Айгуль и Асан встречаются в любимом кафе, чтобы обсудить новости и вкусно поесть.",
                                "Aigul and Asan meet at their favorite cafe to discuss news and eat delicious food.",
                                "beginner", 8, 40, "daily_life", "/images/stories/cafe.jpg",
                                List.of(
                                                new ChapterInitData(1, "Кездесу", "Встреча", "Meeting",
                                                                "Айгүл мен Асан қаланың орталығындағы жайлы кафеде кездесті. Олар көп уақыт бойы бір-бірін көрмеген еді. Бүгін ауа-райы тамаша, сондықтан олар даладағы үстелді таңдады.",
                                                                "Айгуль и Асан встретились в уютном кафе в центре города. Они давно не виделись. Погода сегодня отличная, поэтому они выбрали столик на улице.",
                                                                "Aigul and Asan met in a cozy cafe in the city center. They hadn't seen each other for a long time. The weather is great today, so they chose an outdoor table.",
                                                                "Асан", null,
                                                                List.of(new QuestionInitData("Олар қайда кездесті?",
                                                                                "Где они встретились?",
                                                                                "Where did they meet?",
                                                                                List.of(new AnswerInitData("Кафеде",
                                                                                                "В кафе",
                                                                                                "At the cafe", true),
                                                                                                new AnswerInitData(
                                                                                                                "Мектепте",
                                                                                                                "В школе",
                                                                                                                "At school",
                                                                                                                false))))),
                                                new ChapterInitData(2, "Тапсырыс беру", "Заказ", "Ordering",
                                                                "Даяшы қыз келіп, оларға мәзірді ұсынды. Айгүл қара шай мен бауырсаққа тапсырыс берді. Асан болса өте аш екенін айтып, палау мен салқын шырын алғысы келді.",
                                                                "Подошла официантка и предложила им меню. Айгуль заказала черный чай и баурсаки. Асан сказал, что он очень голоден и хочет взять плов и холодный сок.",
                                                                "The waitress came and offered them the menu. Aigul ordered black tea and baursaks. Asan said he was very hungry and wanted to take pilaf and cold juice.",
                                                                "Айгүл", null,
                                                                List.of(new QuestionInitData("Асан не жегісі келді?",
                                                                                "Что хотел съесть Асан?",
                                                                                "What did Asan want to eat?",
                                                                                List.of(new AnswerInitData("Палау",
                                                                                                "Плов", "Pilaf",
                                                                                                true),
                                                                                                new AnswerInitData(
                                                                                                                "Борщ",
                                                                                                                "Борщ",
                                                                                                                "Borscht",
                                                                                                                false))))),
                                                new ChapterInitData(3, "Әңгіме", "Разговор", "Conversation",
                                                                "Тамақ күтіп отырғанда, олар жаңалықтарымен бөлісті. Айгүл жақында жаңа жұмысқа орналасқанын айтты. Асан досын құттықтап, оған сәттілік тіледі. Олардың көңіл-күйі өте көтеріңкі еді.",
                                                                "В ожидании еды они делились новостями. Айгуль сказала, что недавно устроилась на новую работу. Асан поздравил подругу и пожелал ей удачи. У них было отличное настроение.",
                                                                "While waiting for food, they shared their news. Aigul said that she recently got a new job. Asan congratulated his friend and wished her good luck. Their mood was very upbeat.",
                                                                "Даяшы", null,
                                                                List.of(new QuestionInitData(
                                                                                "Айгүлде қандай жаңалық бар?",
                                                                                "Какие новости у Айгуль?",
                                                                                "What news does Aigul have?",
                                                                                List.of(new AnswerInitData("Жаңа жұмыс",
                                                                                                "Новая работа",
                                                                                                "New job",
                                                                                                true),
                                                                                                new AnswerInitData(
                                                                                                                "Жаңа үй",
                                                                                                                "Новый дом",
                                                                                                                "New house",
                                                                                                                false))))))));

                // 4. Алматыға саяхат
                stories.add(new StoryInitData(
                                "Алматыға саяхат / Trip to Almaty", "Поездка в Алматы", "Trip to Almaty",
                                "Алматыға саяхат",
                                "Путешествие в южную столицу Казахстана.",
                                "Рассказ о том, как друзья посетили самые красивые места Алматы.",
                                "A story about how friends visited the most beautiful places in Almaty.",
                                "intermediate", 10, 50, "travel", "/images/stories/almaty.jpg",
                                List.of(
                                                new ChapterInitData(1, "Таулардың көрінісі", "Вид на горы",
                                                                "Mountain View",
                                                                "Біз Алматыға ұшақпен ұшып келдік. Әуежайдан шыққанда, бізді қарлы таулардың таңғажайып көрінісі қарсы алды. Қала өте жасыл және адамдары өте мейірімді екен.",
                                                                "Мы прилетели в Алматы на самолете. Когда мы вышли из аэропорта, нас встретил удивительный вид на снежные горы. Город очень зеленый, а люди очень дружелюбные.",
                                                                "We flew to Almaty by plane. When we left the airport, we were met by an amazing view of the snowy mountains. The city is very green and the people are very friendly.",
                                                                "Ерлан", null,
                                                                List.of(new QuestionInitData("Олар қалай келді?",
                                                                                "Как они приехали?",
                                                                                "How did they come?",
                                                                                List.of(new AnswerInitData("Ұшақпен",
                                                                                                "На самолете",
                                                                                                "By plane", true),
                                                                                                new AnswerInitData(
                                                                                                                "Пойызбен",
                                                                                                                "На поезде",
                                                                                                                "By train",
                                                                                                                false))))),
                                                new ChapterInitData(2, "Шымбұлақ", "Шымбулак", "Shymbulak",
                                                                "Келесі күні біз Медеуге бардық, сосын аспалы жолмен Шымбұлақ тау-шаңғы курортына көтерілдік. Онда ауа өте салқын және таза. Біз көптеген әдемі суреттер түсіріп, таудың басында шай іштік.",
                                                                "На следующий день мы отправились на Медеу, а затем поднялись на канатной дороге на горнолыжный курорт Шымбулак. Там воздух очень прохладный и чистый. Мы сделали много красивых фотографий и попили чай на вершине горы.",
                                                                "The next day we went to Medeu, and then we went up by cable car to the Shymbulak ski resort. The air there is very cool and clean. We took many beautiful pictures and drank tea at the top of the mountain.",
                                                                "Аружан", null,
                                                                List.of(new QuestionInitData("Олар қайда барды?",
                                                                                "Куда они поехали?",
                                                                                "Where did they go?",
                                                                                List.of(new AnswerInitData("Шымбұлаққа",
                                                                                                "На Шымбулак",
                                                                                                "To Shymbulak", true),
                                                                                                new AnswerInitData(
                                                                                                                "Мұражайға",
                                                                                                                "В музей",
                                                                                                                "To the museum",
                                                                                                                false))))))));

                // 5. Астанадағы кеш
                stories.add(new StoryInitData(
                                "Астанадағы кеш / Evening in Astana", "Вечер в Астане", "Evening in Astana",
                                "Астанадағы кеш",
                                "Прогулка по современной столице.",
                                "Описание прогулки по набережной и осмотр главных достопримечательностей столицы.",
                                "Description of a walk along the embankment and inspection of the main attractions of the capital.",
                                "intermediate", 10, 45, "travel", "/images/stories/astana.jpg",
                                List.of(
                                                new ChapterInitData(1, "Бәйтерек", "Байтерек", "Baiterek",
                                                                "Астана – өте заманауи және зәулім ғимараттары көп қала. Біз алдымен «Бәйтерек» монументіне бардық. Оның басына көтеріліп, бүкіл қаланы жоғарыдан тамашаладық. Көрініс өте керемет екен.",
                                                                "Астана – очень современный город с множеством высотных зданий. Сначала мы отправились к монументу «Байтерек». Поднявшись на его вершину, мы полюбовались всем городом сверху. Вид просто потрясающий.",
                                                                "Astana is a very modern city with many skyscrapers. We first went to the Baiterek monument. We climbed to its top and admired the whole city from above. The view was very amazing.",
                                                                "Дина", null,
                                                                List.of(new QuestionInitData(
                                                                                "Олар бірінші қайда барды?",
                                                                                "Куда они пошли в первую очередь?",
                                                                                "Where did they go first?",
                                                                                List.of(new AnswerInitData("Бәйтерекке",
                                                                                                "К Байтереку",
                                                                                                "To Baiterek", true),
                                                                                                new AnswerInitData(
                                                                                                                "Паркке",
                                                                                                                "В парк",
                                                                                                                "To the park",
                                                                                                                false))))))));

                // 6. Алдар Көсе мен бай
                stories.add(new StoryInitData(
                                "Алдар Көсе мен бай / Aldar Kose and the Rich Man", "Алдар Көсе и бай",
                                "Aldar Kose and the Rich Man",
                                "Алдар Көсе мен бай",
                                "Алдар Көсе сараң байды қалай алдады? Қызықты халық ертегісі.",
                                "Как Алдар Көсе обманул жадного бая? Интересная народная сказка.",
                                "How did Aldar Kose trick the greedy rich man? An interesting folk tale.",
                                "beginner", 8, 40, "culture", "/images/stories/aldar.jpg",
                                List.of(
                                                new ChapterInitData(1, "Кездесу", "Встреча", "Meeting",
                                                                "Бір күні Алдар Көсе далада сараң байды кездестірді. Оның үстінде тесік-тесік ескі тон болды. Бай: \"Сен мына тонда тоңбайсың ба?\" - деп сұрады.",
                                                                "Однажды Алдар Көсе встретил жадного бая в степи. На нём была старая шуба с дырками. Бай спросил: «Тебе не холодно в такой шубе?»",
                                                                "One day Aldar Kose met a greedy rich man in the steppe. He was wearing an old fur coat with holes. The rich man asked: \"Are you not cold in such a coat?\"",
                                                                "Алдар Көсе", null,
                                                                List.of(new QuestionInitData(
                                                                                "Алдар Көсе кімді кездестірді?",
                                                                                "Кого встретил Алдар Көсе?",
                                                                                "Who did Aldar Kose meet?",
                                                                                List.of(new AnswerInitData("Байды",
                                                                                                "Бая", "Rich man",
                                                                                                true),
                                                                                                new AnswerInitData(
                                                                                                                "Ханды",
                                                                                                                "Хана",
                                                                                                                "Khan",
                                                                                                                false))))))));

                // 7. Бесбармақ
                stories.add(new StoryInitData(
                                "Бесбармақ / Beshbarmak", "Бешбармак", "Beshbarmak", "Бесбармақ",
                                "Қазақтың ұлттық тағамы туралы әңгіме. Қонақтарды күту.",
                                "Рассказ о казахском национальном блюде. Встреча гостей.",
                                "A story about the Kazakh national dish. Meeting guests.",
                                "beginner", 6, 35, "food", "/images/stories/besh.jpg",
                                List.of(
                                                new ChapterInitData(1, "Ет асу", "Варка мяса", "Boiling Meat",
                                                                "Бүгін біздің үйге қонақтар келеді. Әжем қазанға ет салды. Ет ұзақ қайнау керек, сонда ол жұмсақ болады.",
                                                                "Сегодня к нам домой придут гости. Бабушка положила мясо в казан. Мясо должно долго вариться, тогда оно будет мягким.",
                                                                "Guests are coming to our house today. Grandmother put meat in the cauldron. The meat needs to boil for a long time, so it becomes soft.",
                                                                "Немере", null,
                                                                List.of(new QuestionInitData("Қазанға не салды?",
                                                                                "Что положили в казан?",
                                                                                "What did she put in the cauldron?",
                                                                                List.of(new AnswerInitData("Ет", "Мясо",
                                                                                                "Meat", true),
                                                                                                new AnswerInitData(
                                                                                                                "Картоп",
                                                                                                                "Картошка",
                                                                                                                "Potato",
                                                                                                                false))))))));

                // 8. Менің отбасым
                stories.add(new StoryInitData(
                                "Менің отбасым / My Family", "Моя семья", "My Family", "Менің отбасым",
                                "Отбасы туралы әңгіме.",
                                "Рассказ о семье.", "Story about family.", "beginner", 5, 20, "daily_life",
                                "/images/stories/family.jpg",
                                List.of(new ChapterInitData(1, "Отбасы", "Семья", "Family",
                                                "Менің отбасым үлкен және тату. Әкем дәрігер, ал анам мұғалім болып жұмыс істейді.",
                                                "Моя семья большая и дружная. Папа работает врачом, а мама учителем.",
                                                "My family is big and friendly. Dad works as a doctor, and mom as a teacher.",
                                                "Мен", null, List.of()))));

                // 9. Базарда
                stories.add(new StoryInitData(
                                "Базарда / At the Bazaar", "На базаре", "At the Bazaar", "Базарда", "Алма сатып алу.",
                                "Покупка яблок.",
                                "Buying apples.", "beginner", 5, 20, "daily_life", "/images/stories/bazaar.jpg",
                                List.of(new ChapterInitData(1, "Жемістер", "Фрукты", "Fruits",
                                                "Мен жеміс сатып алу үшін базарға бардым. Онда көптеген жаңа піскен алмалар мен алмұрттар болды.",
                                                "Я пошел на базар купить фрукты. Там было много свежих яблок и груш.",
                                                "I went to the bazaar to buy fruit. There were many fresh apples and pears.",
                                                "Сатушы", null, List.of()))));

                // 10. Ғарыш
                stories.add(new StoryInitData(
                                "Ғарыш / Space", "Космос", "Space", "Ғарыш", "Байқоңыр туралы.", "О Байконуре.",
                                "About Baikonur.",
                                "advanced", 10, 60, "history", "/images/stories/space.jpg",
                                List.of(new ChapterInitData(1, "Байқоңыр", "Байконур", "Baikonur",
                                                "Байқоңыр - әлемдегі бірінші және ең үлкен ғарыш айлағы. Юрий Гагарин ғарышқа осы жерден ұшты.",
                                                "Байконур - первый и крупнейший космодром в мире. Отсюда Юрий Гагарин полетел в космос.",
                                                "Baikonur is the first and largest spaceport in the world. Yuri Gagarin flew into space from here.",
                                                "Ғарышкер", null, List.of()))));

                createStoriesBatch("kazakh", stories);
        }
}