package kz.balapan.balapan_language.service;

import kz.balapan.balapan_language.model.*;
import kz.balapan.balapan_language.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CourseService {

        @Autowired
        private CourseRepository courseRepository;

        @Autowired
        private UserProgressRepository userProgressRepository;

        @Autowired
        private UserStoryProgressRepository userStoryProgressRepository;

        @Autowired
        private UserVideoProgressRepository userVideoProgressRepository;

        @Autowired
        private LanguageService languageService;

        @SuppressWarnings("null")
        @PostConstruct
        public void initializeCourses() {
                if (courseRepository.count() > 0) {
                        return;
                }

                // We only clear if we are initializing for the first time
                // or if specifically requested (not doing it by default anymore to save user
                // progress)
                // userProgressRepository.deleteAll();
                // courseRepository.deleteAll();

                Language kazakh = languageService.getLanguageByCode("kk");
                Language russian = languageService.getLanguageByCode("ru");
                Language english = languageService.getLanguageByCode("en");

                // Courses for Russian speakers
                createKazakhCourse(kazakh, "ru");
                createEnglishCourse(english, "ru");
                createRussianCourse(russian, "ru");

                // Courses for Kazakh speakers
                createRussianCourse(russian, "kk");
                createEnglishCourse(english, "kk");
                createKazakhCourse(kazakh, "kk");

                // Courses for English speakers
                createRussianCourse(russian, "en");
                createKazakhCourse(kazakh, "en");
                createEnglishCourse(english, "en");
        }

        // ==================== КАЗАХСКИЙ ЯЗЫК ====================

        private void createKazakhCourse(Language language, String sourceCode) {
                Course course = new Course();
                course.setTargetLanguage(language);
                course.setName(sourceCode.equals("ru") ? "🇰🇿 Казахский язык" : "🇰🇿 Қазақ тілі");
                course.setLanguageCode("kk");
                course.setSourceLanguageCode(sourceCode);
                String desc = sourceCode.equals("ru") ? "Полный курс казахского языка от алфавита до свободного общения"
                                : (sourceCode.equals("en") ? "Full Kazakh course from alphabet to fluent conversation"
                                                : "Орыс тілділерге арналған толық курс");
                course.setDescription(desc);
                course.setLevelCount(10);

                List<Level> levels = new ArrayList<>();
                levels.add(createKKLevel1(course));
                levels.add(createKKLevel2(course));
                levels.add(createKKLevel3(course));
                levels.add(createKKLevel4(course));
                levels.add(createKKLevel5(course));
                levels.add(createKKLevel6(course));
                levels.add(createKKLevel7(course));
                levels.add(createKKLevel8(course));
                levels.add(createKKLevel9(course));
                levels.add(createKKLevel10(course));

                course.setLevels(levels);
                courseRepository.save(course);
        }

        // ========== КАЗАХСКИЙ УРОВЕНЬ 1 (5 уроков, по 8-10 упражнений) ==========

        // ========== КАЗАХСКИЙ УРОВЕНЬ 1: ОСНОВЫ ===========

        private Level createKKLevel1(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                Level level = new Level();
                level.setCourse(course);
                level.setLevelNumber(1);

                level.setTitle(l(sourceCode, "Әліппе және негіздер", "Әліппе және негіздер", "Alphabet and Basics"));
                level.setDescription(l(sourceCode, "Алфавит и основы общения", "Алфавит пен қарым-қатынас негіздері",
                                "Alphabet and basic communication"));
                level.setRequiredXp(0);

                List<Lesson> lessons = new ArrayList<>();

                // === УРОК 1: АЛФАВИТ ===
                Lesson l1 = new Lesson();
                l1.setLevel(level);
                l1.setLessonNumber(1);
                l1.setTitle(l(sourceCode, "Казахский алфавит", "Қазақ әліппесі", "Kazakh Alphabet"));
                l1.setLessonType("theory");
                l1.setXpReward(50);

                LessonContent c1 = new LessonContent();
                c1.setLesson(l1);
                c1.setTheoryTitle(l(sourceCode, "Казахский алфавит и фонетика", "Қазақ әліппесі және фонетикасы",
                                "Kazakh Alphabet and Phonetics"));

                String theoryText = sourceCode.equals("en")
                                ? "The Kazakh alphabet is based on Cyrillic and has 42 letters. While many are identical to Russian, 9 are unique keys to the Kazakh sound system.\n\n"
                                                +
                                                "Specific letters:\n" +
                                                "Ә ә — sounds like 'a' in 'apple'\n" +
                                                "Ғ ғ — a voiced guttural 'g'\n" +
                                                "Қ қ — a deep voiceless 'k'\n" +
                                                "Ң ң — nasal 'n' as in 'song'\n" +
                                                "Ө ө — soft 'o' as in 'bird'\n" +
                                                "Ұ ұ — hard 'u' as in 'book'\n" +
                                                "Ү ү — soft 'u' as in 'tune'\n" +
                                                "Һ һ — soft 'h' breath\n" +
                                                "І і — short 'i' sound"
                                : (sourceCode.equals("kk")
                                                ? "Қазақ әліпбиі кириллицаға негізделген және 42 әріптен тұрады. 33 әріп орыс тілімен ортақ болса, 9 әріп қазақ тіліне ғана тән.\n\n"
                                                                +
                                                                "Ерекше әріптер:\n" +
                                                                "Ә, Ғ, Қ, Ң, Ө, Ұ, Ү, Һ, І."
                                                : "В казахском языке 42 буквы. 33 из них общие с русским, а 9 — специфические.\n\n"
                                                                +
                                                                "Эти 9 букв передают уникальные звуки:\n" +
                                                                "Ә ә — мягкое 'э' (как в слове 'apple')\n" +
                                                                "Ғ ғ — звонкое 'х' (глубокое г)\n" +
                                                                "Қ қ — твердое 'к' (глубокое к)\n" +
                                                                "Ң ң — носовое 'н' (как в английском 'singing')\n" +
                                                                "Ө ө — мягкое 'о' (как в слове 'мёд')\n" +
                                                                "Ұ ұ — твердое 'у' (короткое)\n" +
                                                                "Ү ү — мягкое 'у' (как в слове 'мюсли')\n" +
                                                                "Һ һ — звук выдоха (как в английском 'hello')\n" +
                                                                "І і — мягкое 'и' (очень краткое)");
                c1.setTheoryText(theoryText);
                c1.setGrammarRules(l(sourceCode,
                                "Закон сингармонизма: слова бывают либо только 'твердыми', либо только 'мягкими'.",
                                "Сингармонизм заңы: сөздер не бірыңғай жуан, не бірыңғай жіңішке болады.",
                                "Law of Vowel Harmony: words are either entirely 'hard' or entirely 'soft'."));
                l1.setContent(c1);

                List<Exercise> ex1 = new ArrayList<>();
                // 1. Matching vowels
                ex1.add(createExercise(l1, 1, "match", l(sourceCode, "Сопоставьте специфические гласные:",
                                "Спецификалық дауыстыларды сәйкестендіріңіз:", "Match the specific vowels:"),
                                "Ә=ae,Ө=oe,Ү=ue,Ұ=uu",
                                arr("Ә=ae", "Ө=oe", "Ү=ue", "Ұ=uu"), 0, null,
                                arr("audio/ae.mp3", "audio/oe.mp3", "audio/ue.mp3", "audio/uu.mp3")));

                // 2. Matching consonants
                ex1.add(createExercise(l1, 2, "match",
                                l(sourceCode, "Сопоставьте согласные:", "Дауыссыздарды сәйкестендіріңіз:",
                                                "Match the consonants:"),
                                "Қ=q,Ғ=gh,Ң=ng,Һ=h",
                                arr("Қ=q", "Ғ=gh", "Ң=ng", "Һ=h"), 0, null,
                                arr("audio/q.mp3", "audio/g_low.mp3", "audio/ng.mp3", "audio/h.mp3")));

                // 3. Choice
                ex1.add(createExercise(l1, 3, "choose", l(sourceCode, "Какая буква обозначает мягкий 'О'?",
                                "Қай әріп жұмсақ 'О' дыбысын білдіреді?", "Which letter represents the soft 'O'?"), "Ө",
                                arr("О", "Ө", "Ұ", "Ү"), 1, null, arr(null, "audio/oe.mp3", null, null)));

                // 4. Sentence/Word builder
                ex1.add(createSentenceExercise(l1, 4,
                                l(sourceCode, "Соберите слово 'Ребенок':", " 'Бала' сөзін құрастырыңыз:",
                                                "Build the word 'Child':"),
                                "Бала",
                                arr("Ба", "ла", "ке", "ө"), "{\"Ба\": \"Ba\", \"ла\": \"la\"}"));

                // 5. Choice
                ex1.add(createExercise(l1, 5, "choose",
                                l(sourceCode, "Звук [ŋ] обозначается буквой:", "[ŋ] дыбысы қай әріппен белгіленеді:",
                                                "The sound [ŋ] is represented by:"),
                                "Ң", arr("Н", "Ң", "М", "Г"), 1, null, arr(null, "audio/ng.mp3", null, null)));

                // 6. Write (New!)
                ex1.add(createExercise(l1, 6, "write",
                                l(sourceCode, "Введите специфическую букву 'мягкое у':", "Жіңішке 'ү' әрпін жазыңыз:",
                                                "Type the specific 'soft u' letter:"),
                                "Ү", arr("Ү"), 0));

                // 7. Choose (translation)
                ex1.add(createExercise(l1, 7, "choose",
                                l(sourceCode, "Как переводится 'Бала'?", "'Бала' сөзі қалай аударылады?",
                                                "How is 'Bala' translated?"),
                                l(sourceCode, "Ребенок", "Бала", "Child"),
                                arr(l(sourceCode, "Мама", "Ана", "Mother"), l(sourceCode, "Папа", "Әке", "Father"),
                                                l(sourceCode, "Ребенок", "Бала", "Child")),
                                2));

                // 8. Match words
                ex1.add(createExercise(l1, 8, "match",
                                l(sourceCode, "Свяжите слова:", "Сөздерді сәйкестендіріңіз:", "Connect the words:"),
                                "Ана=Мама,Әке=Папа,Аға=Брат,Апа=Сестра",
                                arr("Ана=Мама", "Әке=Папа", "Аға=Брат", "Апа=Сестра"), 0));

                // 9. Sentence builder - simple sentence
                ex1.add(createSentenceExercise(l1, 9,
                                l(sourceCode, "Соберите фразу: 'Мама и папа'", "'Ана мен әке' тіркесін құраңыз:",
                                                "Build: 'Mom and dad'"),
                                "Анаменәке",
                                arr("Ана", "мен", "әке", "бала"), "{}"));

                // 10. Write
                ex1.add(createExercise(l1, 10, "write",
                                l(sourceCode, "Как по-казахски 'Мама'?", "'Мама' қазақша қалай болады?",
                                                "What is 'Mom' in Kazakh?"),
                                "Ана", arr("Ана"), 0));

                // 11. Choice - Pronunciation
                ex1.add(createExercise(l1, 11, "choose",
                                l(sourceCode, "Выберите слово с твердым 'У':", "Жуан 'Ұ' әрпі бар сөзді таңдаңыз:",
                                                "Choose word with hard 'U':"),
                                "Ұста", arr("Ұста", "Үй", "Іні", "Әке"), 0));

                // 12. Write - Missing letter
                ex1.add(createExercise(l1, 12, "write",
                                l(sourceCode, "Вставьте пропущенную букву в слове 'Ә_е' (Папа):",
                                                "'Ә_е' сөзіндегі қалған әріпті жазыңыз:",
                                                "Fill missing letter in 'Ә_e' (Father):"),
                                "к", arr("к"), 0));

                // 13. Choice - Specific sound
                ex1.add(createExercise(l1, 13, "choose",
                                l(sourceCode, "Какой звук глубоко-горловый?", "Қайсысы терең тамақ дыбысы?",
                                                "Which sound is deep guttural?"),
                                "Қ", arr("К", "Қ", "Г", "Б"), 1));

                // 14. Match
                ex1.add(createExercise(l1, 14, "match",
                                l(sourceCode, "Найдите пары:", "Жұптарды табыңыз:", "Find pairs:"),
                                "Сәлем=Привет,Сау бол=Пока,Рақмет=Спасибо,Иә=Да",
                                arr("Сәлем=Привет", "Сау бол=Пока", "Рақмет=Спасибо", "Иә=Да"), 0));

                // 15. Sentence
                ex1.add(createSentenceExercise(l1, 15,
                                l(sourceCode, "Соберите: 'Менің анам' (Моя мама)", "'Менің анам' тіркесін құраңыз:",
                                                "Build: 'My mother'"),
                                "Меніңанам",
                                arr("Менің", "анам", "әке", "сен"), "{}"));

                l1.setExercises(ex1);
                lessons.add(l1);

                // === УРОК 2: ПРИВЕТСТВИЯ И ЭТИКЕТ ===
                Lesson l2 = new Lesson();
                l2.setLevel(level);
                l2.setLessonNumber(2);
                l2.setTitle(l(sourceCode, "Приветствия и этикет", "Сәлемдесу және әдеп", "Greetings and Etiquette"));
                l2.setLessonType("vocabulary");
                l2.setXpReward(50);

                LessonContent c2 = new LessonContent();
                c2.setLesson(l2);
                c2.setTheoryTitle(l(sourceCode, "Как здороваться по-казахски", "Қазақша қалай амандасу керек",
                                "How to Greet in Kazakh"));
                c2.setTheoryText(l(sourceCode,
                                "Сәлем! — Привет! (неформально)\n" +
                                                "Сәлеметсіз бе! — Здравствуйте! (формально)\n" +
                                                "Ассалаумағалейкум! — Мир вам! (традиционное приветствие)\n" +
                                                "Қайырлы таң! — Доброе утро!\n" +
                                                "Қайырлы күн! — Добрый день!\n" +
                                                "Қайырлы кеш! — Добрый вечер!\n" +
                                                "Хал қалай? — Как дела?",
                                "Сәлем! — Привет! (бейресми)\n" +
                                                "Сәлеметсіз бе! — Здравствуйте! (ресми)\n" +
                                                "Ассалаумағалейкум! — Сәлемдесудің дәстүрлі түрі\n" +
                                                "Қайырлы таң! — Қайырлы таң!\n" +
                                                "Қайырлы күн! — Қайырлы күн!\n" +
                                                "Қайырлы кеш! — Қайырлы кеш!\n" +
                                                "Хал қалай? — Қалайсың?",
                                "Salem! — Hi! (informal)\n" +
                                                "Salemetsiz be! — Hello! (formal)\n" +
                                                "Assalaumagaleykum! — Peace be upon you! (traditional)\n" +
                                                "Kayyrly tang! — Good morning!\n" +
                                                "Kayyrly kun! — Good day!\n" +
                                                "Kayyrly kesh! — Good evening!\n" +
                                                "Khal kalay? — How are you?"));
                l2.setContent(c2);

                List<Exercise> ex2 = new ArrayList<>();
                // 1. Match greetings
                ex2.add(createExercise(l2, 1, "match",
                                l(sourceCode, "Сопоставьте приветствия:", "Сәлемдесуді сәйкестендіріңіз:",
                                                "Match greetings:"),
                                "Сәлем=Привет,Қайырлы таң=Доброе утро,Қайырлы күн=Добрый день,Рахмет=Спасибо",
                                arr("Сәлем=Привет", "Қайырлы таң=Доброе утро", "Қайырлы күн=Добрый день",
                                                "Рахмет=Спасибо"),
                                0, null,
                                arr("audio/salem.mp3", "audio/tan.mp3", "audio/kun.mp3", "audio/rakhmet.mp3")));

                // 2. Sentence builder
                ex2.add(createSentenceExercise(l2, 2,
                                l(sourceCode, "Переведите: 'Доброе утро'", "Аударыңыз: 'Доброе утро'",
                                                "Translate: 'Good morning'"),
                                "Қайырлытаң",
                                arr("Қайырлы", "таң", "күн", "кеш", "сәлем"), "{}"));

                // 3. Sentence builder (Formal)
                ex2.add(createSentenceExercise(l2, 3,
                                l(sourceCode, "Переведите: 'Здравствуйте учитель'", "Аударыңыз: 'Здравствуйте учитель'",
                                                "Translate: 'Hello teacher'"),
                                "Сәлеметсізбе мұғалім",
                                arr("Сәлеметсіз", "бе", "мұғалім", "дәрігер", "аспаз"), "{}"));

                // 4. Choice
                ex2.add(createExercise(l2, 4, "choose",
                                l(sourceCode, "Как сказать 'Здравствуйте' официально?", "Ресми түрде қалай амандасады?",
                                                "How to say 'Hello' formally?"),
                                "Сәлеметсіз бе", arr("Сәлем", "Сәлеметсіз бе", "Қайырлы күн", "Сау бол"), 1));

                // 5. Match response
                ex2.add(createExercise(l2, 5, "match",
                                l(sourceCode, "Найдите ответы:", "Жауаптарды табыңыз:", "Find responses:"),
                                "Хал қалай?=Жақсы,Рақмет=Оқасы жоқ,Сау бол=Көріскенше,Сәлем=Сәлем",
                                arr("Хал қалай?=Жақсы", "Рақмет=Оқасы жоқ", "Сау бол=Көріскенше", "Сәлем=Сәлем"), 0));

                // 6. Write
                ex2.add(createExercise(l2, 6, "write",
                                l(sourceCode, "Как переводится 'Спасибо'?", "'Спасибо' қалай аударылады?",
                                                "Translate 'Thank you':"),
                                "Рақмет", arr("Рақмет"), 0));

                // 7. Choice
                ex2.add(createExercise(l2, 7, "choose",
                                l(sourceCode, "Что значит 'Көріскенше'?", "'Көріскенше' нені білдіреді?",
                                                "What does 'Koriskenishe' mean?"),
                                l(sourceCode, "До встречи", "Көріскенше", "See you"),
                                arr(l(sourceCode, "Привет", "Сәлем", "Hello"),
                                                l(sourceCode, "До встречи", "Көріскенше", "See you"),
                                                l(sourceCode, "Пока", "Сау бол", "Bye")),
                                1));

                // 8. Sentence - How are you?
                ex2.add(createSentenceExercise(l2, 8,
                                l(sourceCode, "Соберите: 'Как твои дела?'", "'Хал жағдайың қалай?' сөйлемін құраңыз:",
                                                "Build: 'How are you?'"),
                                "Халқалай",
                                arr("Хал", "қалай", "кім", "не"), "{}"));

                // 9. Write - Formal Hello
                ex2.add(createExercise(l2, 9, "write",
                                l(sourceCode, "Введите 'Здравствуйте' (официально):", "'Здравствуйте' (ресми) жазыңыз:",
                                                "Type 'Hello' (formal):"),
                                "Сәлеметсіз бе", arr("Сәлеметсіз бе"), 0));

                // 10. Choose - Good evening
                ex2.add(createExercise(l2, 10, "choose",
                                l(sourceCode, "Выберите 'Добрый вечер':", "'Қайырлы кеш' дегенді таңдаңыз:",
                                                "Choose 'Good evening':"),
                                "Қайырлы кеш", arr("Қайырлы таң", "Қайырлы күн", "Қайырлы кеш", "Қайырлы түн"), 2));

                // 11. Match
                ex2.add(createExercise(l2, 11, "match",
                                l(sourceCode, "Сопоставьте время суток:", "Тәулік мезгілін сәйкестендіріңіз:",
                                                "Match time of day:"),
                                "Таң=Утро,Күн=День,Кеш=Вечер,Түн=Ночь",
                                arr("Таң=Утро", "Күн=День", "Кеш=Вечер", "Түн=Ночь"), 0));

                // 12. Write
                ex2.add(createExercise(l2, 12, "write",
                                l(sourceCode, "Как по-казахски 'Добрый день'?", "'Добрый день' қазақша қалай болады?",
                                                "What is 'Good day' in Kazakh?"),
                                "Қайырлы күн", arr("Қайырлы күн"), 0));

                l2.setExercises(ex2);
                lessons.add(l2);

                // === УРОК 3: МОЯ СЕМЬЯ ===
                Lesson l3 = new Lesson();
                l3.setLevel(level);
                l3.setLessonNumber(3);
                l3.setTitle(l(sourceCode, "Моя семья", "Менің отбасым", "My Family"));
                l3.setLessonType("vocabulary");
                l3.setXpReward(50);

                LessonContent c3 = new LessonContent();
                c3.setLesson(l3);
                c3.setTheoryTitle(l(sourceCode, "Члены семьи", "Отбасы мүшелері", "Family Members"));
                c3.setTheoryText(l(sourceCode,
                                "Ата — Дедушка\nӘже — Бабушка\nӘке — Папа\nАна — Мама\nАға — Старший брат\nІні — Младший брат\nАпа — Старшая сестра\nҚарындас — Младшая сестра (для мужчин)\n"
                                                +
                                                "Сіңлі — Младшая сестра (для женщин)",
                                "Ата — Ата\nӘже — Әже\nӘке — Әке\nАна — Ана\nАға — Аға\nІні — Іні\nАпа — Апа\nҚарындас — Қарындас\nСіңлі — Сіңлі",
                                "Ata — Grandfather\nAzhe — Grandmother\nAke — Father\nAna — Mother\nAga — Older brother\nIni — Younger brother\nApa — Older sister\nKaryndas — Younger sister (for men)\nSinli — Younger sister (for women)"));
                l3.setContent(c3);

                List<Exercise> ex3 = new ArrayList<>();
                ex3.add(createExercise(l3, 1, "match",
                                l(sourceCode, "Сопоставьте членов семьи:", "Отбасы мүшелерін сәйкестендіріңіз:",
                                                "Match family members:"),
                                "Ата=Дедушка,Әже=Бабушка,Әке=Папа,Ана=Мама",
                                arr("Ата=Дедушка", "Әже=Бабушка", "Әке=Папа", "Ана=Мама"), 0));

                ex3.add(createExercise(l3, 2, "match",
                                l(sourceCode, "Братья и сестры:", "Аға-қарындастар:", "Brothers and sisters:"),
                                "Аға=Брат,Апа=Сестра,Іні=Младший брат,Сіңлі=Младшая сестра",
                                arr("Аға=Брат", "Апа=Сестра", "Іні=Младший брат", "Сіңлі=Младшая сестра"), 0));

                ex3.add(createExercise(l3, 3, "choose",
                                l(sourceCode, "Кто такая 'Бабушка'?", "'Бабушка' қазақша кім болады?",
                                                "Who is 'Grandmother'?"),
                                "Әже", arr("Апа", "Ана", "Әже", "Қарындас"), 2));

                ex3.add(createSentenceExercise(l3, 4,
                                l(sourceCode, "Соберите: 'Моя мама'", "'Менің анам' тіркесін құраңыз:",
                                                "Build: 'My mother'"),
                                "Меніңанам",
                                arr("Менің", "анам", "мен", "сен"), "{}"));

                ex3.add(createExercise(l3, 5, "write",
                                l(sourceCode, "Как будет 'Брат'?", "'Брат' қалай болады?", "Translate 'Brother':"),
                                "Аға", arr("Аға"), 0));

                ex3.add(createExercise(l3, 6, "choose",
                                l(sourceCode, "Выберите 'Отец':", "'Әке' сөзін таңдаңыз:", "Choose 'Father':"),
                                "Әке", arr("Ата", "Әке", "Іні", "Бала"), 1));

                ex3.add(createExercise(l3, 7, "match", l(sourceCode, "Пары:", "Жұптар:", "Pairs:"),
                                "Әке=Ана,Ата=Әже,Аға=Апа,Іні=Қарындас",
                                arr("Әке=Ана", "Ата=Әже", "Аға=Апа", "Іні=Қарындас"), 0));

                ex3.add(createSentenceExercise(l3, 8,
                                l(sourceCode, "Соберите: 'Это мой папа'", "'Бұл менің әкем' сөйлемін құраңыз:",
                                                "Build: 'This is my father'"),
                                "Бұлменіңәкем",
                                arr("Бұл", "менің", "әкем", "анам"), "{}"));

                ex3.add(createExercise(l3, 9, "write",
                                l(sourceCode, "Как будет 'Дедушка'?", "'Дедушка' қалай болады?",
                                                "Translate 'Grandfather':"),
                                "Ата", arr("Ата"), 0));

                ex3.add(createExercise(l3, 10, "choose",
                                l(sourceCode, "У младшего брата есть старшая сестра:", "Інісінің әпкесі бар:",
                                                "Younger brother has an older sister:"),
                                "Апа", arr("Қарындас", "Сіңлі", "Апа", "Ана"), 2));

                l3.setExercises(ex3);
                lessons.add(l3);

                // === УРОК 4: ЧИСЛА 1-10 ===
                Lesson l4 = new Lesson();
                l4.setLevel(level);
                l4.setLessonNumber(4);
                l4.setTitle(l(sourceCode, "Цифры и числа", "Сандар", "Numbers"));
                l4.setLessonType("vocabulary");
                l4.setXpReward(50);

                LessonContent c4 = new LessonContent();
                c4.setLesson(l4);
                c4.setTheoryTitle(l(sourceCode, "Счет до 10", "10-ға дейін санау", "Counting to 10"));
                c4.setTheoryText(
                                "1 — Бір\n2 — Екі\n3 — Үш\n4 — Төрт\n5 — Бес\n6 — Алты\n7 — Жеті\n8 — Сегіз\n9 — Тоғыз\n10 — Он");
                l4.setContent(c4);

                List<Exercise> ex4 = new ArrayList<>();
                ex4.add(createExercise(l4, 1, "match",
                                l(sourceCode, "Сопоставьте числа 1-4:", "1-4 сандарын сәйкестендіріңіз:",
                                                "Match numbers 1-4:"),
                                "Бір=1,Екі=2,Үш=3,Төрт=4", arr("Бір=1", "Екі=2", "Үш=3", "Төрт=4"), 0));
                ex4.add(createExercise(l4, 2, "match",
                                l(sourceCode, "Сопоставьте числа 5-8:", "5-8 сандарын сәйкестендіріңіз:",
                                                "Match numbers 5-8:"),
                                "Бес=5,Алты=6,Жеті=7,Сегіз=8", arr("Бес=5", "Алты=6", "Жеті=7", "Сегіз=8"), 0));
                ex4.add(createExercise(l4, 3, "choose",
                                l(sourceCode, "Какое число 'Три'?", "'3' саны қазақша қалай?", "What is number '3'?"),
                                "Үш", arr("Бір", "Екі", "Үш", "Төрт"), 2));
                ex4.add(createExercise(l4, 4, "write",
                                l(sourceCode, "Напишите 'Пять' по-казахски:", "'5' санын жазыңыз:",
                                                "Type '5' in Kazakh:"),
                                "Бес", arr("Бес"), 0));
                ex4.add(createExercise(l4, 5, "choose",
                                l(sourceCode, "Какое число 'Семь'?", "'7' саны қалай?", "What is '7'?"),
                                "Жеті", arr("Алты", "Жеті", "Сегіз", "Тоғыз"), 1));
                ex4.add(createExercise(l4, 6, "match", l(sourceCode, "9 и 10:", "9 бен 10:", "9 and 10:"),
                                "Тоғыз=9,Он=10,Бір=1,Бес=5", arr("Тоғыз=9", "Он=10", "Бір=1", "Бес=5"), 0));
                ex4.add(createSentenceExercise(l4, 7,
                                l(sourceCode, "Соберите: 'Один и два'", "'Бір мен екі' тіркесін құраңыз:",
                                                "Build: 'One and two'"),
                                "Бірменекі",
                                arr("Бір", "мен", "екі", "үш"), "{}"));
                ex4.add(createExercise(l4, 8, "write",
                                l(sourceCode, "Напишите 'Десять':", "'10' санын жазыңыз:", "Type '10':"),
                                "Он", arr("Он"), 0));
                ex4.add(createExercise(l4, 9, "choose",
                                l(sourceCode, "Сколько будет 2 + 2?", "2 + 2 неше болады?", "What is 2 + 2?"),
                                "Төрт", arr("Үш", "Төрт", "Бес", "Алты"), 1));
                ex4.add(createExercise(l4, 10, "write",
                                l(sourceCode, "Как будет 'Один'?", "'1' саны қалай?", "What is '1'?"),
                                "Бір", arr("Бір"), 0));

                l4.setExercises(ex4);
                lessons.add(l4);

                // === УРОК 5: ЦВЕТА ===
                Lesson l5 = new Lesson();
                l5.setLevel(level);
                l5.setLessonNumber(5);
                l5.setTitle(l(sourceCode, "Цвета", "Түстер", "Colors"));
                l5.setLessonType("vocabulary");
                l5.setXpReward(50);

                LessonContent c5 = new LessonContent();
                c5.setLesson(l5);
                c5.setTheoryTitle(l(sourceCode, "Основные цвета", "Негізгі түстер", "Basic Colors"));
                c5.setTheoryText(
                                "Ақ — Белый\nҚара — Черный\nҚызыл — Красный\nКөк — Синий/Голубой\nЖасыл — Зеленый\nСары — Желтый");
                l5.setContent(c5);

                List<Exercise> ex5 = new ArrayList<>();
                ex5.add(createExercise(l5, 1, "match",
                                l(sourceCode, "Сопоставьте цвета:", "Түстерді сәйкестендіріңіз:", "Match colors:"),
                                "Ақ=Белый,Қара=Черный,Қызыл=Красный,Көк=Синий",
                                arr("Ақ=Белый", "Қара=Черный", "Қызыл=Красный", "Көк=Синий"), 0));
                ex5.add(createExercise(l5, 2, "choose",
                                l(sourceCode, "Какой цвет 'Зеленый'?", "Жасыл түс қайсысы?", "Which one is 'Green'?"),
                                "Жасыл", arr("Сары", "Қызыл", "Жасыл", "Көк"), 2));
                ex5.add(createExercise(l5, 3, "write",
                                l(sourceCode, "Как будет 'Желтый'?", "Сары түс қалай болады?", "Translate 'Yellow':"),
                                "Сары", arr("Сары"), 0));
                ex5.add(createSentenceExercise(l5, 4,
                                l(sourceCode, "Соберите: 'Красное яблоко'", "'Қызыл алма' тіркесін құраңыз:",
                                                "Build: 'Red apple'"),
                                "Қызылалма",
                                arr("Қызыл", "алма", "көк", "ақ"), "{}"));
                ex5.add(createExercise(l5, 5, "match",
                                l(sourceCode, "Цвета предметов:", "Заттардың түстері:", "Object colors:"),
                                "Сүт=Ақ,Көмір=Қара,Шөп=Жасыл,Күн=Сары",
                                arr("Сүт=Ақ", "Көмір=Қара", "Шөп=Жасыл", "Күн=Сары"), 0));
                ex5.add(createExercise(l5, 6, "write",
                                l(sourceCode, "Как будет 'Белый'?", "Ақ түс қалай болады?", "Translate 'White':"),
                                "Ақ", arr("Ақ"), 0));
                ex5.add(createExercise(l5, 7, "choose",
                                l(sourceCode, "Цвет неба:", "Аспанның түсі:", "Color of the sky:"),
                                "Көк", arr("Сары", "Көк", "Қара", "Ақ"), 1));
                ex5.add(createExercise(l5, 8, "write",
                                l(sourceCode, "Как будет 'Черный'?", "Қара түс қалай болады?", "Translate 'Black':"),
                                "Қара", arr("Қара"), 0));
                ex5.add(createSentenceExercise(l5, 9,
                                l(sourceCode, "Соберите: 'Зеленая трава'", "'Жасыл шөп' тіркесін құраңыз:",
                                                "Build: 'Green grass'"),
                                "Жасылшөп",
                                arr("Жасыл", "шөп", "қара", "қызыл"), "{}"));
                ex5.add(createExercise(l5, 10, "choose",
                                l(sourceCode, "Какой цвет 'Красный'?", "Қызыл түс қайсысы?", "Which one is 'Red'?"),
                                "Қызыл", arr("Көк", "Ақ", "Қызыл", "Жасыл"), 2));

                l5.setExercises(ex5);
                lessons.add(l5);

                level.setLessons(lessons);
                return level;
        }

        private Lesson createInteractiveLesson(Level level, int num, String title, String type, int xp, String[] pairs,
                        String[] audio) {
                String sourceCode = level.getCourse().getSourceLanguageCode();
                String promptPrefix = sourceCode.equals("ru") ? "Переведите: "
                                : (sourceCode.equals("en") ? "Translate: " : "Аударыңыз: ");
                Lesson l = new Lesson();
                l.setLevel(level);
                l.setLessonNumber(num);
                l.setTitle(title);
                l.setLessonType(type);
                l.setXpReward(xp);

                LessonContent c = new LessonContent();
                c.setLesson(l);
                c.setTheoryText(sourceCode.equals("ru") ? "Изучите " + title + " с помощью упражнений."
                                : title + " тақырыбын жаттығулар арқылы меңгеріңіз.");
                l.setContent(c);

                List<Exercise> exs = new ArrayList<>();
                // 1. Match exercise
                exs.add(createExercise(l, 1, "match",
                                sourceCode.equals("ru") ? "Сопоставьте элементы:" : "Элементтерді сәйкестендіріңіз:",
                                String.join(",", pairs), pairs, 0, null, audio));

                // 2. Choose exercises for first few items
                for (int i = 0; i < Math.min(3, pairs.length); i++) {
                        String[] parts = pairs[i].split("=");
                        String currentAudio = (audio != null && i < audio.length) ? audio[i] : null;
                        exs.add(createExercise(l, i + 2, "choose",
                                        promptPrefix + parts[1], parts[0],
                                        arr(parts[0], "wrong1", "wrong2", "wrong3"), 0, null,
                                        arr(currentAudio, null, null, null)));
                }

                l.setExercises(exs);
                return l;
        }

        private Level createKKLevel2(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                Level level = new Level();
                level.setCourse(course);
                level.setLevelNumber(2);
                level.setTitle(l(sourceCode, "Приветствия и общение", "Сәлемдесу және қарым-қатынас",
                                "Greetings and Communication"));
                level.setDescription(l(sourceCode, "Основные фразы приветствия", "Сәлемдесудің негізгі тіркестері",
                                "Basic greeting phrases"));
                level.setRequiredXp(100);

                List<Lesson> lessons = new ArrayList<>();

                // === УРОК 1: СӘЛЕМДЕСУ (Приветствия) ===
                Lesson l2 = new Lesson();
                l2.setLevel(level);
                l2.setLessonNumber(1);
                l2.setTitle(l(sourceCode, "Приветствия", "Сәлемдесу", "Greetings"));
                l2.setLessonType("vocabulary");
                l2.setXpReward(35);

                LessonContent c2 = new LessonContent();
                c2.setLesson(l2);
                c2.setTheoryTitle(l(sourceCode, "Приветствия", "Сәлемдесу", "Greetings"));
                c2.setTheoryText(l(sourceCode,
                                "Сәлем! — Привет!\nҚайырлы таң! — Доброе утро!\nҚайырлы күн! — Добрый день!\nРахмет! — Спасибо!",
                                "Сәлем!\nҚайырлы таң!\nҚайырлы күн!\nРахмет!",
                                "Сәлем! — Hello!\nҚайырлы таң! — Good morning!\nҚайырлы күн! — Good afternoon!\nРахмет! — Thank you!"));
                l2.setContent(c2);

                List<Exercise> ex2 = new ArrayList<>();
                ex2.add(createExercise(l2, 1, "match",
                                l(sourceCode, "Сопоставьте приветствия:", "Сәлемдесуді сәйкестендіріңіз:",
                                                "Match greetings:"),
                                l(sourceCode, "Сәлем=Привет,Қайырлы таң=Доброе утро,Қайырлы күн=Добрый день,Рахмет=Спасибо",
                                                "Сәлем=Сәлем,Қайырлы таң=Қайырлы таң,Қайырлы күн=Қайырлы күн,Рахмет=Рахмет",
                                                "Сәлем=Hello,Қайырлы таң=Good morning,Қайырлы күн=Good afternoon,Рахмет=Thank you"),
                                arr("Сәлем", "Қайырлы таң", "Қайырлы күн", "Рахмет"),
                                0, null,
                                arr("audio/salem.mp3", "audio/tan.mp3", "audio/kun.mp3", "audio/rakhmet.mp3")));

                String promptTranslate = l(sourceCode, "Переведите:", "Аударыңыз:", "Translate:");
                String refMorning = l(sourceCode, "Доброе утро", "Қайырлы таң", "Good morning");
                ex2.add(createSentenceExercise(l2, 2, promptTranslate + " '" + refMorning + "'", "Қайырлы таң",
                                arr("Қайырлы", "таң", "күн", "кеш", "сәлем"),
                                "{\"Қайырлы\": \"Good\", \"таң\": \"morning\"}"));

                String refTeacher = l(sourceCode, "Здравствуйте учитель", "Сәлеметсіз бе мұғалім", "Hello teacher");
                ex2.add(createSentenceExercise(l2, 3, promptTranslate + " '" + refTeacher + "'",
                                "Сәлеметсіз бе мұғалім",
                                arr("Сәлеметсіз", "бе", "мұғалім", "дәрігер", "аспаз"),
                                "{\"мұғалім\": \"teacher\"}"));

                l2.setExercises(ex2);
                lessons.add(l2);

                level.setLessons(lessons);
                return level;
        }

        private Level createKKLevel3(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                Level level = new Level();
                level.setCourse(course);
                level.setLevelNumber(3);
                level.setTitle(l(sourceCode, "Семья и окружение", "Отбасы және айнала", "Family and Surroundings"));
                level.setDescription(l(sourceCode, "Члены семьи и друзья", "Отбасы мүшелері мен достар",
                                "Family members and friends"));
                level.setRequiredXp(250);

                List<Lesson> lessons = new ArrayList<>();

                // === УРОК 1: ОТБАСЫ (Семья) ===
                Lesson l1 = new Lesson();
                l1.setLevel(level);
                l1.setLessonNumber(1);
                l1.setTitle(l(sourceCode, "Моя семья", "Менің отбасым", "My Family"));
                l1.setLessonType("conversation");
                l1.setXpReward(45);

                LessonContent c1 = new LessonContent();
                c1.setLesson(l1);
                c1.setTheoryText(l(sourceCode,
                                "Әке — Отец\nАна — Мать\nАға — Брат (старший)\nҚарындас — Сестра (младшая)",
                                "Әке\nАна\nАға\nҚарындас",
                                "Әке — Father\nАна — Mother\nАға — Brother\nҚарындас — Sister"));
                l1.setContent(c1);

                List<Exercise> ex1 = new ArrayList<>();
                String promptTranslate = l(sourceCode, "Переведите:", "Аударыңыз:", "Translate:");
                String refFather = l(sourceCode, "Мой отец", "Менің әкем", "My father");
                ex1.add(createSentenceExercise(l1, 1, promptTranslate + " '" + refFather + "'", "Менің әкем",
                                arr("Менің", "әкем", "анам", "ағам"),
                                "{\"әкем\": \"father\"}"));

                String refThisMom = l(sourceCode, "Это моя мать", "Бұл менің анам", "This is my mother");
                ex1.add(createSentenceExercise(l1, 2, promptTranslate + " '" + refThisMom + "'",
                                "Бұл менің анам",
                                arr("Бұл", "менің", "анам", "әкем", "інім"),
                                "{\"Бұл\": \"This\", \"анам\": \"mother\"}"));

                l1.setExercises(ex1);
                lessons.add(l1);

                level.setLessons(lessons);
                return level;
        }

        private Level createKKLevel4(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                Level level = new Level();
                level.setCourse(course);
                level.setLevelNumber(4);
                level.setTitle(l(sourceCode, "Еда и напитки", "Тамақ пен сусындар", "Food and Drinks"));
                level.setDescription(l(sourceCode, "Продукты и фразы в ресторане",
                                "Тамақтар мен мейрамханадағы тіркестер", "Food items and restaurant phrases"));
                level.setRequiredXp(500);

                List<Lesson> lessons = new ArrayList<>();
                // Урок 1: База
                lessons.add(createInteractiveLesson(level, 1,
                                l(sourceCode, "Основные продукты", "Негізгі тамақ", "Basic Food"), "vocabulary", 40,
                                sourceCode.equals("ru") ? arr("Нан=Хлеб", "Сүт=Молоко", "Ет=Мясо", "Су=Вода", "Шай=Чай")
                                                : (sourceCode.equals("en")
                                                                ? arr("Нан=Bread", "Сүт=Milk", "Ет=Meat", "Су=Water",
                                                                                "Шай=Tea")
                                                                : arr("Нан=Нан", "Сүт=Сүт", "Ет=Ет", "Су=Су",
                                                                                "Шай=Шай")),
                                arr("audio/bread.mp3", "audio/milk.mp3", "audio/meat.mp3", "audio/water.mp3",
                                                "audio/tea.mp3")));
                // Урок 2: Овощи и фрукты
                lessons.add(createInteractiveLesson(level, 2, l(sourceCode, "Фрукты", "Жемістер", "Fruits"),
                                "vocabulary", 40,
                                sourceCode.equals("ru")
                                                ? arr("Алма=Яблоко", "Алмұрт=Груша", "Жүзім=Виноград", "Банан=Банан",
                                                                "Өрік=Абрикос")
                                                : (sourceCode.equals("en")
                                                                ? arr("Алма=Apple", "Алмұрт=Pear", "Жүзім=Grape",
                                                                                "Банан=Banana", "Өрік=Apricot")
                                                                : arr("Алма=Алма", "Алмұрт=Алмұрт", "Жүзім=Жүзім",
                                                                                "Банан=Банан", "Өрік=Өрік")),
                                arr("audio/apple.mp3", "audio/pear.mp3", "audio/grape.mp3", "audio/banana.mp3",
                                                "audio/apricot.mp3")));

                // Урок 3: Фразы за столом
                Lesson l3 = new Lesson();
                l3.setLevel(level);
                l3.setLessonNumber(3);
                l3.setTitle(l(sourceCode, "В столовой", "Асханада", "In the Dining Room"));
                l3.setLessonType("conversation");
                l3.setXpReward(50);
                LessonContent c3 = new LessonContent();
                c3.setLesson(l3);
                c3.setTheoryText(l(sourceCode,
                                "Ас болсын! — Приятного аппетита!\nШай ішесіз бе? — Будете пить чай?",
                                "Ас болсын!\nШай ішесіз бе?",
                                "Ас болсын! — Bon appetit!\nШай ішесіз бе? — Would you like some tea?"));
                l3.setContent(c3);

                List<Exercise> ex3 = new ArrayList<>();
                String promptTranslate = l(sourceCode, "Переведите:", "Аударыңыз:", "Translate:");
                String refDrinkWater = l(sourceCode, "Я пью воду", "Мен су ішемін", "I drink water");
                ex3.add(createSentenceExercise(l3, 1, promptTranslate + " '" + refDrinkWater + "'", "Мен су ішемін",
                                arr("Мен", "су", "ішемін", "шай", "нан"),
                                "{\"су\": \"water\", \"ішемін\": \"drink\"}"));

                String refSweetApple = l(sourceCode, "Яблоко сладкое", "Алма тәтті", "Apple is sweet");
                ex3.add(createSentenceExercise(l3, 2, promptTranslate + " '" + refSweetApple + "'", "Алма тәтті",
                                arr("Алма", "тәтті", "ащы", "қызыл"),
                                "{\"тәтті\": \"sweet\"}"));

                l3.setExercises(ex3);
                lessons.add(l3);

                level.setLessons(lessons);
                return level;
        }

        private Level createKKLevel5(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                Level level = new Level();
                level.setCourse(course);
                level.setLevelNumber(5);
                level.setTitle(l(sourceCode, "Время и День", "Уақыт және Күн", "Time and Day"));
                level.setDescription(l(sourceCode, "Дни недели, время суток", "Апта күндері мен тәулік уақыты",
                                "Days of the week, time of day"));
                level.setRequiredXp(700);

                List<Lesson> lessons = new ArrayList<>();
                lessons.add(createInteractiveLesson(level, 1,
                                l(sourceCode, "Дни недели", "Апта күндері", "Days of the Week"), "vocabulary", 45,
                                sourceCode.equals("ru")
                                                ? arr("Дүйсенбі=Понедельник", "Сейсенбі=Вторник", "Сәрсенбі=Среда",
                                                                "Бейсенбі=Четверг", "Жұма=Пятница")
                                                : (sourceCode.equals("en")
                                                                ? arr("Дүйсенбі=Monday", "Сейсенбі=Tuesday",
                                                                                "Сәрсенбі=Wednesday",
                                                                                "Бейсенбі=Thursday", "Жұма=Friday")
                                                                : arr("Дүйсенбі=Дүйсенбі", "Сейсенбі=Сейсенбі",
                                                                                "Сәрсенбі=Сәрсенбі",
                                                                                "Бейсенбі=Бейсенбі", "Жұма=Жұма")),
                                null));

                lessons.add(createInteractiveLesson(level, 2, l(sourceCode, "Время суток", "Тәулік", "Time of Day"),
                                "vocabulary", 45,
                                sourceCode.equals("ru") ? arr("Таң=Утро", "Күн=День", "Кеш=Вечер", "Түн=Ночь")
                                                : (sourceCode.equals("en")
                                                                ? arr("Таң=Morning", "Күн=Day", "Кеш=Evening",
                                                                                "Түн=Night")
                                                                : arr("Таң=Таң", "Күн=Күн", "Кеш=Кеш", "Түн=Түн")),
                                null));

                level.setLessons(lessons);
                return level;
        }

        private Level createKKLevel6(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                Level level = new Level();
                level.setCourse(course);
                level.setLevelNumber(6);
                level.setTitle(l(sourceCode, "Город и Транспорт", "Қала және Көлік", "City and Transport"));
                level.setDescription(l(sourceCode, "Городская жизнь и транспорт", "Қала өмірі мен көлік",
                                "Urban life and transport"));
                level.setRequiredXp(900);

                List<Lesson> lessons = new ArrayList<>();
                lessons.add(createInteractiveLesson(level, 1, l(sourceCode, "Город", "Қала", "City"), "vocabulary", 40,
                                sourceCode.equals("ru")
                                                ? arr("Дүкен=Магазин", "Мектеп=Школа", "Аурухана=Больница",
                                                                "Көше=Улица", "Саябақ=Парк")
                                                : (sourceCode.equals("en") ? arr("Дүкен=Shop", "Мектеп=School",
                                                                "Аурухана=Hospital", "Көше=Street", "Саябақ=Park")
                                                                : arr("Дүкен=Дүкен", "Мектеп=Мектеп",
                                                                                "Аурухана=Аурухана", "Көше=Көше",
                                                                                "Саябақ=Саябақ")),
                                null));

                lessons.add(createInteractiveLesson(level, 2, l(sourceCode, "Транспорт", "Көлік", "Transport"),
                                "vocabulary", 40,
                                sourceCode.equals("ru")
                                                ? arr("Автобус=Автобус", "Такси=Такси", "Пойыз=Поезд", "Ұшақ=Самолет")
                                                : (sourceCode.equals("en")
                                                                ? arr("Автобус=Bus", "Такси=Taxi", "Пойыз=Train",
                                                                                "Ұшақ=Plane")
                                                                : arr("Автобус=Автобус", "Такси=Такси", "Пойыз=Пойыз",
                                                                                "Ұшақ=Ұшақ")),
                                null));

                level.setLessons(lessons);
                return level;
        }

        private Level createKKLevel7(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                Level level = new Level();
                level.setCourse(course);
                level.setLevelNumber(7);
                level.setTitle(l(sourceCode, "Путешествие", "Саяхат", "Travel"));
                level.setDescription(l(sourceCode, "Путешествия и туризм", "Саяхат пен туризм", "Travel and tourism"));
                level.setRequiredXp(1100);

                List<Lesson> lessons = new ArrayList<>();
                lessons.add(createInteractiveLesson(level, 1, l(sourceCode, "Гостиница", "Қонақ үй", "Hotel"),
                                "vocabulary", 45,
                                sourceCode.equals("ru") ? arr("Бөлме=Номер", "Кілт=Ключ", "Төсек=Кровать", "Теңіз=Море")
                                                : (sourceCode.equals("en")
                                                                ? arr("Бөлме=Room", "Кілт=Key", "Төсек=Bed",
                                                                                "Теңіз=Sea")
                                                                : arr("Бөлме=Бөлме", "Кілт=Кілт", "Төсек=Төсек",
                                                                                "Теңіз=Теңіз")),
                                null));

                Lesson l2 = new Lesson();
                l2.setLevel(level);
                l2.setLessonNumber(2);
                l2.setTitle(l(sourceCode, "В аэропорту", "Әуежайда", "At the Airport"));
                l2.setLessonType("conversation");
                l2.setXpReward(55);
                LessonContent c2 = new LessonContent();
                c2.setLesson(l2);
                c2.setTheoryText(l(sourceCode,
                                "Билет қайда? — Где билет?\nЖолыңыз болсын! — Счастливого пути!",
                                "Билет қайда?\nЖолыңыз болсын!",
                                "Билет қайда? — Where is the ticket?\nЖолыңыз болсын! — Have a nice trip!"));
                l2.setContent(c2);

                List<Exercise> ex2 = new ArrayList<>();
                String promptTranslate = l(sourceCode, "Переведите:", "Аударыңыз:", "Translate:");
                String refTicket = l(sourceCode, "Где мой билет?", "Менің билетім қайда?", "Where is my ticket?");
                ex2.add(createSentenceExercise(l2, 1, promptTranslate + " '" + refTicket + "'", "Менің билетім қайда",
                                arr("Менің", "билетім", "қайда", "сіздің", "қашан"),
                                "{\"билетім\": \"ticket\"}"));
                l2.setExercises(ex2);
                lessons.add(l2);

                level.setLessons(lessons);
                return level;
        }

        private Level createKKLevel8(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                Level level = new Level();
                level.setCourse(course);
                level.setLevelNumber(8);
                level.setTitle(l(sourceCode, "Работа и Учеба", "Жұмыс және Оқу", "Work and Study"));
                level.setDescription(l(sourceCode, "Профессии и образование", "Мамандықтар мен білім",
                                "Professions and education"));
                level.setRequiredXp(1300);

                List<Lesson> lessons = new ArrayList<>();
                lessons.add(createInteractiveLesson(level, 1, l(sourceCode, "Профессии", "Мамандықтар", "Professions"),
                                "vocabulary", 50,
                                sourceCode.equals("ru")
                                                ? arr("Дәрігер=Врач", "Мұғалім=Учитель", "Инженер=Инженер",
                                                                "Аспаз=Повар")
                                                : (sourceCode.equals("en")
                                                                ? arr("Дәрігер=Doctor", "Мұғалім=Teacher",
                                                                                "Инженер=Engineer", "Аспаз=Cook")
                                                                : arr("Дәрігер=Дәрігер", "Мұғалім=Мұғалім",
                                                                                "Инженер=Инженер", "Аспаз=Аспаз")),
                                null));

                level.setLessons(lessons);
                return level;
        }

        private Level createKKLevel9(Course course) {
                Level level = new Level();
                level.setCourse(course);
                level.setLevelNumber(9);
                String sourceCode = course.getSourceLanguageCode();
                level.setTitle(sourceCode.equals("en") ? "Business Kazakh" : "Іскерлік қазақ тілі");
                level.setDescription(sourceCode.equals("en") ? "Business vocabulary and professional communication"
                                : "Деловой казахский и профессиональная лексика");
                level.setRequiredXp(1500);

                List<Lesson> lessons = new ArrayList<>();

                // Урок 1: Түйіндеме (Резюме)
                Lesson l1 = new Lesson();
                l1.setLevel(level);
                l1.setLessonNumber(1);
                l1.setTitle(sourceCode.equals("en") ? "Resume and Interview" : "Түйіндеме және сұхбат");
                l1.setLessonType("conversation");
                l1.setXpReward(60);
                LessonContent c1 = new LessonContent();
                c1.setLesson(l1);
                c1.setTheoryText("Мамандық — " + (sourceCode.equals("en") ? "Profession" : "Профессия") + "\n" +
                                "Тәжірибе — " + (sourceCode.equals("en") ? "Experience" : "Опыт") + "\n" +
                                "Біліктілік — " + (sourceCode.equals("en") ? "Qualification" : "Квалификация"));
                l1.setContent(c1);

                List<Exercise> ex1 = new ArrayList<>();
                String promptPrefix = sourceCode.equals("ru") ? "Переведите: "
                                : (sourceCode.equals("en") ? "Translate: " : "Аударыңыз: ");
                String refExp = sourceCode.equals("ru") ? "У меня есть опыт работы" : "I have work experience";
                ex1.add(createSentenceExercise(l1, 1, promptPrefix + "'" + refExp + "'",
                                "Менің жұмыс тәжірибем бар",
                                arr("Менің", "жұмыс", "тәжірибем", "бар", "жоқ"),
                                "{\"тәжірибем\": \"my experience\"}"));
                l1.setExercises(ex1);
                lessons.add(l1);

                // Урок 2: Келіссөздер (Переговоры)
                Lesson l2 = new Lesson();
                l2.setLevel(level);
                l2.setLessonNumber(2);
                l2.setTitle(sourceCode.equals("en") ? "Negotiations" : "Келіссөздер");
                l2.setLessonType("conversation");
                l2.setXpReward(65);
                LessonContent c2 = new LessonContent();
                c2.setLesson(l2);
                c2.setTheoryText("Келісім-шарт — " + (sourceCode.equals("en") ? "Contract" : "Контракт") + "\n" +
                                "Ынтымақтастық — " + (sourceCode.equals("en") ? "Cooperation" : "Сотрудничество"));
                l2.setContent(c2);

                List<Exercise> ex2 = new ArrayList<>();
                String refCollab = sourceCode.equals("ru") ? "Мы предлагаем сотрудничество" : "We offer cooperation";
                ex2.add(createSentenceExercise(l2, 1, promptPrefix + "'" + refCollab + "'",
                                "Біз ынтымақтастықты ұсынамыз",
                                arr("Біз", "ынтымақтастықты", "ұсынамыз", "қабылдаймыз"),
                                "{\"ұсынамыз\": \"we offer\"}"));
                l2.setExercises(ex2);
                lessons.add(l2);

                level.setLessons(lessons);
                return level;
        }

        private Level createKKLevel10(Course course) {
                Level level = new Level();
                level.setCourse(course);
                level.setLevelNumber(10);
                String sourceCode = course.getSourceLanguageCode();
                level.setTitle(sourceCode.equals("en") ? "Literature and Culture" : "Әдебиет және мәдениет");
                level.setDescription(sourceCode.equals("en") ? "Literary language and complex texts"
                                : "Литературный язык и сложные тексты");
                level.setRequiredXp(1800);

                List<Lesson> lessons = new ArrayList<>();

                // Урок 1: Абайдың қара сөздері
                Lesson l1 = new Lesson();
                l1.setLevel(level);
                l1.setLessonNumber(1);
                l1.setTitle(sourceCode.equals("en") ? "Abay's Legacy" : "Абай мұрасы");
                l1.setLessonType("literature");
                l1.setXpReward(70);
                LessonContent c1 = new LessonContent();
                c1.setLesson(l1);
                c1.setTheoryText("Ғылым таппай мақтанба...\n" +
                                (sourceCode.equals("en") ? "Don't boast until you find science..."
                                                : "Пока не нашел науку, не хвались..."));
                l1.setContent(c1);

                List<Exercise> ex1 = new ArrayList<>();
                String promptFinish = sourceCode.equals("ru") ? "Закончите фразу: "
                                : (sourceCode.equals("en") ? "Finish the phrase: " : "Сөйлемді аяқтаңыз: ");
                ex1.add(createSentenceExercise(l1, 1, promptFinish + "'Ғылым таппай...'", "мақтанба",
                                arr("мақтанба", "ұйықтама", "айтпа", "көрме"), null));
                l1.setExercises(ex1);
                lessons.add(l1);

                // Урок 2: Мақал-мәтелдер (Пословицы)
                Lesson l2 = new Lesson();
                l2.setLevel(level);
                l2.setLessonNumber(2);
                l2.setTitle(sourceCode.equals("en") ? "Proverbs" : "Мақал-мәтелдер");
                l2.setLessonType("literature");
                l2.setXpReward(75);
                LessonContent c2 = new LessonContent();
                c2.setLesson(l2);
                c2.setTheoryText("Өнер алды — қызыл тіл.\n" +
                                (sourceCode.equals("en") ? "The beginning of art is the eloquent tongue."
                                                : "Начало всякого искусства — красноречие."));
                l2.setContent(c2);

                List<Exercise> ex2 = new ArrayList<>();
                ex2.add(createSentenceExercise(l2, 1, promptFinish + "'Өнер алды — ...'", "қызыл тіл",
                                arr("қызыл", "тіл", "көк", "аспан"), null));
                l2.setExercises(ex2);
                lessons.add(l2);

                level.setLessons(lessons);
                return level;
        }

        // ==================== Public Methods ====================

        // ==================== РУССКИЙ ЯЗЫК ====================

        private void createRussianCourse(Language language, String sourceCode) {
                Course course = new Course();
                course.setTargetLanguage(language);
                course.setName(sourceCode.equals("kk") ? "🇷🇺 Орыс тілі" : "🇷🇺 Русский язык");
                course.setLanguageCode("ru");
                course.setSourceLanguageCode(sourceCode);
                course.setDescription("Полный курс русского языка от алфавита до свободного общения");
                course.setLevelCount(10);

                List<Level> levels = new ArrayList<>();
                levels.add(createRULevel1(course));
                levels.add(createRULevel2(course));
                levels.add(createRULevel3(course));
                levels.add(createRULevel4(course));
                levels.add(createRULevel5(course));
                levels.add(createRULevel6(course));
                levels.add(createRULevel7(course));
                levels.add(createRULevel8(course));
                levels.add(createRULevel9(course));
                levels.add(createRULevel10(course));
                course.setLevels(levels);
                courseRepository.save(course);
        }

        // ========== РУССКИЙ УРОВЕНЬ 1 (5 уроков) ==========

        private Level createRULevel1(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                Level level = new Level();
                level.setCourse(course);
                level.setLevelNumber(1);

                level.setTitle(l(sourceCode, "Алфавит и основы", "Әліппе және негіздер", "Alphabet and Basics"));
                level.setDescription(l(sourceCode, "Русский алфавит, приветствия", "Орыс әліппесі, сәлемдесу",
                                "Russian alphabet and basic greetings"));
                level.setRequiredXp(0);

                List<Lesson> lessons = new ArrayList<>();

                // === УРОК 1: АЛФАВИТ ===
                Lesson l1 = new Lesson();
                l1.setLevel(level);
                l1.setLessonNumber(1);
                l1.setTitle(l(sourceCode, "Русский алфавит", "Орыс әліппесі", "Russian Alphabet"));
                l1.setLessonType("theory");
                l1.setXpReward(35);

                LessonContent c1 = new LessonContent();
                c1.setLesson(l1);
                c1.setTheoryTitle(l(sourceCode, "Основы алфавита", "Әліппе негіздері", "Alphabet Basics"));

                String theoryText = sourceCode.equals("en")
                                ? "The Russian alphabet (Cyrillic) has 33 letters.\n\n" +
                                                "1. Letters that look and sound like English: **A, E, K, M, O, T**\n" +
                                                "2. 'False friends' letters — look like English but sound different: **В** (v), **Н** (n), **Р** (r), **С** (s), **Х** (kh).\n"
                                                +
                                                "3. Unique letters: **Б, Г, Д, Ж, З, И, Л, П, Ф, Ц, Ч, Ш, Щ, Ю, Я.**"
                                : (sourceCode.equals("kk")
                                                ? "Орыс әліппесінде 33 әріп бар. Олардың басым бөлігі қазақ әліппесімен ортақ.\n\n"
                                                                +
                                                                "Ерекше назар аударатын жайт — орыс тілінде қазақ тіліндегі спецификалық әріптер (Ә, Ғ, Қ, Ң, Ө, Ұ, Ү, Һ, І) жоқ.\n"
                                                                +
                                                                "Бірақ дыбысталуы ұқсас әріптер көп."
                                                : "Русский алфавит состоит из 33 букв. Мы начнем с самых простых букв, которые похожи на латинские.\n\n"
                                                                +
                                                                "1. Похожие буквы: **А, Е, К, М, О, Т**.\n" +
                                                                "2. 'Ложные друзья' (выглядят как латинские, но звучат иначе): **В** [в], **Н** [н], **Р** [р], **С** [с], **Х** [х].");
                c1.setTheoryText(theoryText);

                c1.setExamples(l(sourceCode,
                                "А — Арбуз (Watermelon)\nМ — Мама (Mom)\nО — Окно (Window)\nТ — Торт (Cake)",
                                "А — Арбуз\nМ — Мама\nО — Окно\nТ — Торт",
                                "А — Arbus (Watermelon)\nМ — Mama (Mom)\nО — Okno (Window)\nТ — Tort (Cake)"));

                c1.setTips(l(sourceCode,
                                "Совет: Не путайте букву 'Н' с английской 'H'. В русском это звук [Н]!",
                                "Кеңес: 'Н' әрпін ағылшынның 'H' әрпімен шатастырмаңыз. Орыс тілінде бұл [Н] дыбысы!",
                                "Tip: Don't confuse 'Н' with English 'H'. In Russian, it's the [N] sound!"));

                l1.setContent(c1);

                List<Exercise> ex1 = new ArrayList<>();
                // 1. Match basics
                ex1.add(createExercise(l1, 1, "match", l(sourceCode, "Сопоставьте буквы и звуки:",
                                "Әріптер мен дыбыстарды сәйкестендіріңіз:", "Match letters and sounds:"),
                                "А=a,О=o,У=u,М=m",
                                arr("А=a", "О=o", "У=u", "М=m"), 0, null,
                                arr("audio/ru_a.mp3", "audio/ru_o.mp3", "audio/ru_u.mp3", "audio/ru_m.mp3")));

                // 2. Choose M
                ex1.add(createExercise(l1, 2, "choose", l(sourceCode, "Какая буква читается как [м]?",
                                "Қай әріп [м] деп оқылады?", "Which letter sounds like [m]?"), "М",
                                arr("А", "М", "О", "У"), 1, null, arr(null, "audio/ru_m.mp3", null, null)));

                // 3. Sentence Syllable Mama
                String refMama = l(sourceCode, "Мама", "Ана", "Mom");
                String promptSyllable = l(sourceCode, "Соберите слово:", "Сөзді құрастырыңыз:", "Build the word:");
                ex1.add(createSentenceExercise(l1, 3, promptSyllable + " '" + refMama + "'", "Мама",
                                arr("Ма", "ма", "па", "ба"), "{\"Ма\": \"Ma\", \"ма\": \"ma\"}"));

                // 4. Match false friends
                ex1.add(createExercise(l1, 4, "match", l(sourceCode, "Сопоставьте 'ложных друзей':",
                                "'Жалған достарды' сәйкестендіріңіз (түрі ұқсас, дыбысы басқа):",
                                "Match 'false friends':"),
                                "Н=n,Р=r,С=s,Х=kh",
                                arr("Н=n", "Р=r", "С=s", "Х=kh"), 0, null,
                                arr("audio/ru_n.mp3", "audio/ru_r.mp3", "audio/ru_s.mp3", "audio/ru_kh.mp3")));

                // 5. Choose N
                ex1.add(createExercise(l1, 5, "choose", l(sourceCode, "Звук [н] обозначается буквой:",
                                "[н] дыбысы қай әріппен белгіленеді:", "The sound [n] is represented by:"), "Н",
                                arr("H", "Н", "П", "К"), 1, null, arr(null, "audio/ru_n.mp3", null, null)));

                // 6. Sentence Syllable Papa
                String refPapa = l(sourceCode, "Папа", "Әке", "Dad");
                ex1.add(createSentenceExercise(l1, 6, promptSyllable + " '" + refPapa + "'", "Папа",
                                arr("Па", "па", "ма", "ба"), "{\"Па\": \"Pa\", \"па\": \"pa\"}"));

                // 7. Choose U
                ex1.add(createExercise(l1, 7, "choose", l(sourceCode, "Как читается буква 'У'?",
                                "'У' әрпі қалай оқылады?", "How to read 'У'?"), "u",
                                arr("y", "u", "v", "w"), 1, null, arr(null, "audio/ru_u.mp3", null, null)));

                l1.setExercises(ex1);
                lessons.add(l1);

                // === УРОК 2: ПРИВЕТСТВИЯ ===
                Lesson l2 = new Lesson();
                l2.setLevel(level);
                l2.setLessonNumber(2);
                l2.setTitle(l(sourceCode, "Приветствие", "Сәлемдесу", "Greetings"));
                l2.setLessonType("vocabulary");
                l2.setXpReward(35);

                LessonContent c2 = new LessonContent();
                c2.setLesson(l2);
                c2.setTheoryTitle(l(sourceCode, "Приветствие и вежливость", "Сәлемдесу және сыпайылық",
                                "Greetings and Politeness"));
                c2.setTheoryText(sourceCode.equals("en")
                                ? "In Russian, there are two ways to say 'Hello':\n" +
                                                "1. **Привет** [Privet] — Informal (with friends, family).\n" +
                                                "2. **Здравствуйте** [Zdravstvuyte] — Formal (with teachers, strangers).\n\n"
                                                +
                                                "**Как дела?** — How are you?\n**Хорошо** — Good / Fine.\n**Меня зовут...** — My name is..."
                                : (sourceCode.equals("kk")
                                                ? "Орыс тілінде сәлемдесудің екі түрі бар:\n" +
                                                                "1. **Привет** — Бейресми (достармен, туыстармен).\n" +
                                                                "2. **Здравствуйте** — Ресми (үлкендермен, мұғалімдермен).\n\n"
                                                                +
                                                                "**Как дела?** — Қалайсың?\n**Хорошо** — Жақсы.\n**Меня зовут...** — Менің атым..."
                                                : "В русском языке есть два основных способа поздороваться:\n" +
                                                                "1. **Привет** — неформально (с друзьями, близкими).\n"
                                                                +
                                                                "2. **Здравствуйте** — формально (с коллегами, незнакомыми).\n\n"
                                                                +
                                                                "**Как дела?** — популярный вопрос при встрече.\n**Хорошо** — ответ 'хорошо'."));
                l2.setContent(c2);

                List<Exercise> ex2 = new ArrayList<>();
                // 1. Match basics
                ex2.add(createExercise(l2, 1, "match",
                                l(sourceCode, "Сопоставьте приветствия:", "Сәлемдесуді сәйкестендіріңіз:",
                                                "Match greetings:"),
                                "Привет=Сәлем,Здравствуйте=Сәлеметсіз бе,Как дела=Қалайсың,Хорошо=Жақсы",
                                arr("Привет=Сәлем", "Здравствуйте=Сәлеметсіз бе", "Как дела=Қалайсың", "Хорошо=Жақсы"),
                                0, null,
                                arr("audio/ru_privet.mp3", "audio/ru_zdr.mp3", "audio/ru_kakdela.mp3",
                                                "audio/ru_horosho.mp3")));

                // 2. Sentence Hello (Formal)
                String promptTranslate = l(sourceCode, "Переведите:", "Аударыңыз:", "Translate:");
                ex2.add(createSentenceExercise(l2, 2, promptTranslate + " 'Hello' (Formal)", "Здравствуйте",
                                arr("Здравствуйте", "Привет", "Как", "дела"), "{\"Здравствуйте\": \"Hello\"}"));

                // 3. Sentence How are you?
                ex2.add(createSentenceExercise(l2, 3, promptTranslate + " 'How are you?'", "Как дела",
                                arr("Как", "дела", "Здравствуйте", "Привет"),
                                "{\"Как\": \"How\", \"дела\": \"are things\"}"));

                // 4. Choose formal hello
                ex2.add(createExercise(l2, 4, "choose",
                                l(sourceCode, "Выберите вежливое приветствие:", "Сыпайы сәлемдесуді таңдаңыз:",
                                                "Choose a formal greeting:"),
                                "Здравствуйте",
                                arr("Привет", "Здравствуйте", "Пока", "Мама"), 1, null,
                                arr(null, "audio/ru_zdr.mp3", null, null)));

                // 5. Choose 'Good'
                ex2.add(createExercise(l2, 5, "choose",
                                l(sourceCode, "Как сказать 'Хорошо'?", "'Жақсы' қалай болады?",
                                                "How to say 'Good'?"),
                                "Хорошо",
                                arr("Привет", "Мама", "Хорошо", "Папа"), 2, null,
                                arr(null, null, "audio/ru_horosho.mp3", null)));

                // 6. Sentence 'Hi mom'
                String refHiMom = l(sourceCode, "Привет, мама", "Сәлем, ана", "Hi, mom");
                ex2.add(createSentenceExercise(l2, 6, promptTranslate + " '" + refHiMom + "'", "Привет мама",
                                arr("Привет", "мама", "Здравствуйте", "папа"),
                                "{\"Привет\": \"Hi\", \"мама\": \"mom\"}"));

                l2.setExercises(ex2);
                lessons.add(l2);

                // === УРОК 3: ЧИСЛА 1-5 ===
                Lesson l3 = new Lesson();
                l3.setLevel(level);
                l3.setLessonNumber(3);
                l3.setTitle(l(sourceCode, "Числа 1-5", "Сандар 1-5", "Numbers 1-5"));
                l3.setLessonType("vocabulary");
                l3.setXpReward(30);

                LessonContent c3 = new LessonContent();
                c3.setLesson(l3);
                c3.setTheoryTitle(l(sourceCode, "Счет от 1 до 5", "1-ден 5-ке дейін санау", "Counting 1 to 5"));
                c3.setTheoryText(l(sourceCode,
                                "**Один** — 1\n**Два** — 2\n**Три** — 3\n**Четыре** — 4\n**Пять** — 5\n\n" +
                                                "Обратите внимание на мягкий знак в слове 'Пять'.",
                                "**Один** — 1\n**Два** — 2\n**Три** — 3\n**Четыре** — 4\n**Пять** — 5\n\n" +
                                                "'Пять' сөзіндегі жіңішкелік белгісіне (ь) назар аударыңыз.",
                                "**Один** [Odin] — 1\n**Два** [Dva] — 2\n**Три** [Tri] — 3\n**Четыре** [Chetyre] — 4\n**Пять** [Pyat] — 5"));
                l3.setContent(c3);

                List<Exercise> ex3 = new ArrayList<>();
                // 1. Match
                ex3.add(createExercise(l3, 1, "match",
                                l(sourceCode, "Сопоставьте числа:", "Сандарды сәйкестендіріңіз:",
                                                "Match the numbers:"),
                                "Один=1,Два=2,Три=3,Четыре=4,Пять=5",
                                arr("Один=1", "Два=2", "Три=3", "Четыре=4", "Пять=5"), 0, null,
                                arr("audio/ru_1.mp3", "audio/ru_2.mp3", "audio/ru_3.mp3", "audio/ru_4.mp3",
                                                "audio/ru_5.mp3")));

                // 2. Choose 1
                ex3.add(createExercise(l3, 2, "choose",
                                l(sourceCode, "Как будет число 1?", " 1 саны қалай болады?",
                                                "What is 1?"),
                                "Один",
                                arr("Один", "Два", "Три", "Четыре"), 0, null, arr("audio/ru_1.mp3", null, null, null)));

                // 3. Choose 2
                ex3.add(createExercise(l3, 3, "choose",
                                l(sourceCode, "Как будет число 2?", " 2 саны қалай болады?",
                                                "What is 2?"),
                                "Два",
                                arr("Один", "Два", "Три", "Четыре"), 1, null, arr(null, "audio/ru_2.mp3", null, null)));

                // 4. Choose 5
                ex3.add(createExercise(l3, 4, "choose",
                                l(sourceCode, "Как будет число 5?", " 5 саны қалай болады?",
                                                "What is 5?"),
                                "Пять",
                                arr("Три", "Четыре", "Пять", "Шесть"), 2, null,
                                arr(null, null, "audio/ru_5.mp3", null)));

                // 5. Sentence
                String promptTranslateStrNum = l(sourceCode, "Переведите:", "Аударыңыз:", "Translate:");
                ex3.add(createSentenceExercise(l3, 5, promptTranslateStrNum + " 'Three moms'", "Три мамы",
                                arr("Три", "мамы", "мама", "папа"), "{\"Три\": \"Three\", \"мамы\": \"moms\"}"));

                // 6. Sentence
                ex3.add(createSentenceExercise(l3, 6, promptTranslateStrNum + " 'Two dads'", "Два папы",
                                arr("Два", "папы", "папа", "мама"), "{\"Два\": \"Two\", \"папы\": \"dads\"}"));

                l3.setExercises(ex3);
                lessons.add(l3);

                level.setLessons(lessons);
                return level;
        }

        private Level createRULevel2(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                Level level = new Level();
                level.setCourse(course);
                level.setLevelNumber(2);
                level.setTitle(l(sourceCode, "Животные и цвета", "Жануарлар мен түстер", "Animals and Colors"));
                level.setDescription(l(sourceCode, "Названия животных и базовые цвета", "Жануарлар мен негізгі түстер",
                                "Animal names and basic colors"));
                level.setRequiredXp(100);

                List<Lesson> lessons = new ArrayList<>();
                // Урок 1: Животные
                lessons.add(createInteractiveLesson(level, 1, l(sourceCode, "Животные", "Жануарлар", "Animals"),
                                "vocabulary", 40,
                                arr("Кошка=Мысық", "Собака=Ит", "Лошадь=Ат", "Корова=Сиыр", "Овца=Қой"),
                                arr("audio/ru_cat.mp3", "audio/ru_dog.mp3", "audio/ru_horse.mp3", "audio/ru_cow.mp3",
                                                "audio/ru_sheep.mp3")));

                // Урок 2: Цвета
                lessons.add(createInteractiveLesson(level, 2, l(sourceCode, "Цвета", "Түстер", "Colors"),
                                "vocabulary", 40,
                                arr("Белый=Ақ", "Черный=Қара", "Красный=Қызыл", "Синий=Көк", "Зеленый=Жасыл"),
                                arr("audio/ru_white.mp3", "audio/ru_black.mp3", "audio/ru_red.mp3", "audio/ru_blue.mp3",
                                                "audio/ru_green.mp3")));

                // Урок 3: Простые фразы
                Lesson l3 = new Lesson();
                l3.setLevel(level);
                l3.setLessonNumber(3);
                l3.setTitle(l(sourceCode, "Это есть...", "Бұл...", "This is..."));
                l3.setLessonType("conversation");
                l3.setXpReward(45);
                LessonContent c3 = new LessonContent();
                c3.setLesson(l3);
                c3.setTheoryText(
                                "Конструкция 'Это...' используется для описания предметов.\nПример: Это кошка. Это красное яблоко.");
                l3.setContent(c3);

                List<Exercise> ex3 = new ArrayList<>();
                String promptTranslateStr = l(sourceCode, "Переведите:", "Аударыңыз:", "Translate:");
                ex3.add(createSentenceExercise(l3, 1, promptTranslateStr + " 'This is a white cat'", "Это белая кошка",
                                arr("Это", "белая", "кошка", "черный", "собака"),
                                "{\"Это\": \"This is\", \"белая\": \"white\"}"));

                l3.setExercises(ex3);
                lessons.add(l3);

                level.setLessons(lessons);
                return level;
        }

        private Level createRULevel3(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                Level level = new Level();
                level.setCourse(course);
                level.setLevelNumber(3);
                level.setTitle(l(sourceCode, "Семья и дом", "Отбасы мен үй", "Family and Home"));
                level.setDescription(l(sourceCode, "Члены семьи и предметы в доме", "Отбасы мүшелері мен үй заттары",
                                "Family members and house items"));
                level.setRequiredXp(250);

                List<Lesson> lessons = new ArrayList<>();
                lessons.add(createInteractiveLesson(level, 1, l(sourceCode, "Семья", "Отбасы", "Family"), "vocabulary",
                                45,
                                arr("Отец=Әке", "Мать=Ана", "Брат=Аға", "Сестра=Қарындас", "Сын=Ұл", "Дочь=Қыз"),
                                null));

                Lesson l2 = new Lesson();
                l2.setLevel(level);
                l2.setLessonNumber(2);
                l2.setTitle(l(sourceCode, "Моя семья", "Менің отбасым", "My Family"));
                l2.setLessonType("conversation");
                l2.setXpReward(50);
                LessonContent c2 = new LessonContent();
                c2.setLesson(l2);
                c2.setTheoryText("Мой/Моя/Моё — менің (my).\nМой отец, Моя мать, Моё окно.");
                l2.setContent(c2);

                List<Exercise> ex2 = new ArrayList<>();
                String promptTranslateStr = l(sourceCode, "Переведите:", "Аударыңыз:", "Translate:");
                ex2.add(createSentenceExercise(l2, 1, promptTranslateStr + " 'My father and my mother'",
                                "Мой отец и моя мать",
                                arr("Мой", "отец", "и", "моя", "мать", "брат"), "{\"Мой\": \"My\", \"моя\": \"my\"}"));

                l2.setExercises(ex2);
                lessons.add(l2);

                level.setLessons(lessons);
                return level;
        }

        private Level createRULevel4(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                Level level = new Level();
                level.setCourse(course);
                level.setLevelNumber(4);
                level.setTitle(l(sourceCode, "Еда и ресторан", "Тамақ пен мейрамхана", "Food and Restaurant"));
                level.setDescription(l(sourceCode, "Продукты питания и заказ в кафе",
                                "Тамақтар мен дәмханадағы тапсырыс", "Food and ordering in a cafe"));
                level.setRequiredXp(500);

                List<Lesson> lessons = new ArrayList<>();
                lessons.add(createInteractiveLesson(level, 1, l(sourceCode, "Продукты", "Өнімдер", "Products"),
                                "vocabulary", 45,
                                arr("Хлеб=Нан", "Молоко=Сүт", "Яблоко=Алма", "Вода=Су", "Мясо=Ет"),
                                null));

                Lesson l2 = new Lesson();
                l2.setLevel(level);
                l2.setLessonNumber(2);
                l2.setTitle(l(sourceCode, "В ресторане", "Мейрамханада", "At the Restaurant"));
                l2.setLessonType("conversation");
                l2.setXpReward(55);
                LessonContent c2 = new LessonContent();
                c2.setLesson(l2);
                c2.setTheoryText("Я хочу... — Мен ... қалаймын (I want...)\nСчет, пожалуйста! — Шотты беріңізші!");
                l2.setContent(c2);

                List<Exercise> ex2 = new ArrayList<>();
                String pt = l(sourceCode, "Переведите:", "Аударыңыз:", "Translate:");
                ex2.add(createSentenceExercise(l2, 1, pt + " 'I want water'", "Я хочу воду",
                                arr("Я", "хочу", "воду", "хлеб", "мясо"), "{\"хочу\": \"want\"}"));

                l2.setExercises(ex2);
                lessons.add(l2);

                level.setLessons(lessons);
                return level;
        }

        private Level createRULevel5(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                Level level = new Level();
                level.setCourse(course);
                level.setLevelNumber(5);
                level.setTitle(l(sourceCode, "Город и Дом", "Қала мен Үй", "City and Home"));
                level.setDescription(l(sourceCode, "Транспорт и комнаты", "Көлік пен бөлмелер", "Transport and rooms"));
                level.setRequiredXp(435);

                List<Lesson> lessons = new ArrayList<>();
                lessons.add(createInteractiveLesson(level, 1, l(sourceCode, "Транспорт", "Көлік", "Transport"),
                                "vocabulary", 40,
                                sourceCode.equals("kk")
                                                ? arr("Машина=Машина", "Автобус=Автобус", "Самолет=Ұшақ", "Поезд=Пойыз")
                                                : arr("Машина=Car", "Автобус=Bus", "Самолет=Plane", "Поезд=Train"),
                                null));
                level.setLessons(lessons);
                return level;
        }

        private Level createRULevel6(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                return createSimpleLevel(course, 6,
                                l(sourceCode, "Падежи 1", "Септіктер 1", "Cases 1"),
                                l(sourceCode, "Именительный, родительный", "Атау, ілік септіктері",
                                                "Nominative, genitive"),
                                555, 5, 5);
        }

        private Level createRULevel7(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                return createSimpleLevel(course, 7,
                                l(sourceCode, "Глаголы движения", "Қозғалыс етістіктері", "Verbs of Motion"),
                                l(sourceCode, "Идти, ехать, лететь", "Бару, жүру, ұшу", "Go, drive, fly"), 700, 5, 5);
        }

        private Level createRULevel8(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                return createSimpleLevel(course, 8,
                                l(sourceCode, "Сложные предложения", "Күрделі сөйлемдер", "Complex Sentences"),
                                l(sourceCode, "Союзы и подчинение", "Шылаулар мен бағыныңқы байланыс",
                                                "Conjunctions and subordination"),
                                850, 5, 5);
        }

        private Level createRULevel9(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                return createSimpleLevel(course, 9,
                                l(sourceCode, "Профессиональная лексика", "Кәсіби лексика", "Professional Vocabulary"),
                                l(sourceCode, "Работа и офис", "Жұмыс пен кеңсе", "Work and office"), 1000, 5, 5);
        }

        private Level createRULevel10(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                return createSimpleLevel(course, 10,
                                l(sourceCode, "Литература", "Әдебиет", "Literature"),
                                l(sourceCode, "Классические тексты", "Классикалық мәтіндер", "Classical texts"), 1200,
                                5, 5);
        }

        // ==================== АНГЛИЙСКИЙ ЯЗЫК ====================

        private void createEnglishCourse(Language language, String sourceCode) {
                Course course = new Course();
                course.setTargetLanguage(language);
                course.setName(sourceCode.equals("ru") ? "🇬🇧 Английский язык" : "🇬🇧 Ағылшын тілі");
                course.setLanguageCode("en");
                course.setSourceLanguageCode(sourceCode);
                course.setDescription("Complete English course from alphabet to fluent communication");
                course.setLevelCount(10);

                List<Level> levels = new ArrayList<>();
                levels.add(createENLevel1(course));
                levels.add(createENLevel2(course));
                levels.add(createENLevel3(course));
                levels.add(createENLevel4(course));
                levels.add(createENLevel5(course));
                levels.add(createENLevel6(course));
                levels.add(createENLevel7(course));
                levels.add(createENLevel8(course));
                levels.add(createENLevel9(course));
                levels.add(createENLevel10(course));
                course.setLevels(levels);
                courseRepository.save(course);
        }

        // ========== АНГЛИЙСКИЙ УРОВЕНЬ 1 (5 уроков, по 8-10 упражнений) ==========

        private Level createENLevel1(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                Level level = new Level();
                level.setCourse(course);
                level.setLevelNumber(1);
                level.setTitle(l(sourceCode, "Основы", "Негіздер", "Basics"));
                level.setDescription(l(sourceCode, "Английский алфавит, приветствия", "Ағылшын әліппесі, сәлемдесу",
                                "English alphabet and basic greetings"));
                level.setRequiredXp(0);

                List<Lesson> lessons = new ArrayList<>();

                // === Lesson 1: Alphabet ===
                Lesson l1 = new Lesson();
                l1.setLevel(level);
                l1.setLessonNumber(1);
                l1.setTitle(l(sourceCode, "Алфавит", "Әліппе", "Alphabet"));
                l1.setLessonType("theory");
                l1.setXpReward(35);
                LessonContent c1 = new LessonContent();
                c1.setLesson(l1);
                c1.setTheoryTitle(l(sourceCode, "Английский алфавит", "Ағылшын әліппесі", "English Alphabet"));
                c1.setTheoryText(l(sourceCode,
                                "Английский алфавит состоит из 26 букв. Он использует латиницу.\n\n" +
                                                "Многие буквы вам уже знакомы, но они могут читаться иначе, чем в кириллице.\n"
                                                +
                                                "Например:\n**A** [эй], **B** [би], **C** [си], **D** [ди].",
                                "Ағылшын әліппесінде 26 әріп бар. Ол латын графикасын қолданылады.\n\n" +
                                                "Көптеген әріптер сізге таныс болуы мүмкін, бірақ олардың оқылуы басқаша.\n"
                                                +
                                                "Мысалы:\n**A** [эй], **B** [би], **C** [си], **D** [ди].",
                                "The English alphabet has 26 letters. We use the Latin script."));

                c1.setExamples(l(sourceCode,
                                "A — Apple (Яблоко)\nB — Boy (Мальчик)\nC — Cat (Кошка)\nD — Dog (Собака)",
                                "A — Apple (Алма)\nB — Boy (Бала)\nC — Cat (Мысық)\nD — Dog (Ит)",
                                "A — Apple\nB — Boy\nC — Cat\nD — Dog"));

                c1.setTips(l(sourceCode,
                                "Совет: В английском языке 26 букв, но более 40 звуков! Мы выучим их все постепенно.",
                                "Кеңес: Ағылшын тілінде 26 әріп бар, бірақ 40-тан астам дыбыс бар! Біз олардың бәрін біртіндеп үйренеміз.",
                                "Tip: English has 26 letters but over 40 sounds! We will learn them all gradually."));

                l1.setContent(c1);

                List<Exercise> ex1 = new ArrayList<>();
                // 1. Match basics
                ex1.add(createExercise(l1, 1, "match",
                                l(sourceCode, "Сопоставьте буквы и звуки:", "Әріптер мен дыбыстарды сәйкестендіріңіз:",
                                                "Match the letters and sounds:"),
                                "A=ay,B=bee,C=see,D=dee",
                                arr("A=ay", "B=bee", "C=see", "D=dee"), 0, null,
                                arr("audio/en_a.mp3", "audio/en_b.mp3", "audio/en_c.mp3", "audio/en_d.mp3")));

                // 2. Choose C
                ex1.add(createExercise(l1, 2, "choose",
                                l(sourceCode, "Как читается буква 'C'?", " 'C' әрпі қалай оқылады?",
                                                "How to read 'C'?"),
                                "see",
                                arr("ay", "bee", "see", "dee"), 2, null, arr(null, null, "audio/en_c.mp3", null)));

                // 3. Match more
                ex1.add(createExercise(l1, 3, "match",
                                l(sourceCode, "Сопоставьте буквы и звуки (продолжение):", "Әріптерді сәйкестендіріңіз:",
                                                "Match more letters:"),
                                "E=ee,F=ef,G=gee,H=aitch",
                                arr("E=ee", "F=ef", "G=gee", "H=aitch"), 0, null,
                                arr("audio/en_e.mp3", "audio/en_f.mp3", "audio/en_g.mp3", "audio/en_h.mp3")));

                // 4. Choose G
                ex1.add(createExercise(l1, 4, "choose",
                                l(sourceCode, "Как читается буква 'G'?", " 'G' әрпі қалай оқылады?",
                                                "How to read 'G'?"),
                                "gee",
                                arr("gee", "jee", "gay", "ef"), 0, null, arr("audio/en_g.mp3", null, null, null)));

                // 5. Choose H
                ex1.add(createExercise(l1, 5, "choose",
                                l(sourceCode, "Какая буква читается как 'aitch'?", " Қай әріп 'aitch' деп оқылады?",
                                                "Which letter is 'aitch'?"),
                                "H",
                                arr("A", "G", "H", "F"), 2, null, arr(null, null, "audio/en_h.mp3", null)));

                // 6. Sentence Syllable Apple
                String promptSyllable = l(sourceCode, "Соберите слово:", "Сөзді құрастырыңыз:", "Build the word:");
                ex1.add(createSentenceExercise(l1, 6, promptSyllable + " 'Apple'", "Apple",
                                arr("Ap", "ple", "ba", "nan"), "{\"Ap\": \"Ap\", \"ple\": \"ple\"}"));

                l1.setExercises(ex1);
                lessons.add(l1);

                // === Lesson 2: Greetings ===
                Lesson l2 = new Lesson();
                l2.setLevel(level);
                l2.setLessonNumber(2);
                l2.setTitle(l(sourceCode, "Приветствие", "Сәлемдесу", "Greetings"));
                l2.setLessonType("vocabulary");
                l2.setXpReward(35);

                LessonContent c2 = new LessonContent();
                c2.setLesson(l2);
                c2.setTheoryTitle(l(sourceCode, "Первые слова", "Алғашқы сөздер", "First Words"));
                c2.setTheoryText(l(sourceCode,
                                "**Hello** — универсальное приветствие.\n**Hi** — более формальное.\n**Goodbye** — до свидания.\n\n"
                                                +
                                                "**How are you?** — Как дела?\n**I am fine** — У меня всё хорошо.",
                                "**Hello** — ортақ сәлемдесу.\n**Hi** — бейресми түрі.\n**Goodbye** — сау бол.\n\n" +
                                                "**How are you?** — Қалайсың?\n**I am fine** — Менде бәрі жақсы.",
                                "Greetings in English can be formal or informal.\n\n" +
                                                "**Hello** — General greeting.\n**Hi** — Informal.\n**How are you?** — Common question."));
                l2.setContent(c2);

                List<Exercise> ex2 = new ArrayList<>();
                // 1. Match basics
                ex2.add(createExercise(l2, 1, "match",
                                l(sourceCode, "Сопоставьте приветствия:", "Сәлемдесуді сәйкестендіріңіз:",
                                                "Match greetings:"),
                                "Hello=Привет,Hi=Привет,Goodbye=Пока,Thanks=Спасибо",
                                arr("Hello=Привет", "Hi=Привет", "Goodbye=Пока", "Thanks=Спасибо"),
                                0, null,
                                arr("audio/en_hello.mp3", "audio/en_hi.mp3", "audio/en_bye.mp3",
                                                "audio/en_thanks.mp3")));

                // 2. Sentence Hello
                String promptTranslateStr = l(sourceCode, "Переведите:", "Аударыңыз:", "Translate:");
                ex2.add(createSentenceExercise(l2, 2, promptTranslateStr + " 'Hello'", "Hello",
                                arr("Hello", "Hi", "Goodbye", "Thanks"), "{\"Hello\": \"Hello\"}"));

                // 3. Sentence How are you?
                ex2.add(createSentenceExercise(l2, 3, promptTranslateStr + " 'How are you?'", "How are you",
                                arr("How", "are", "you", "fine", "thanks"),
                                "{\"How\": \"How\", \"are\": \"are\", \"you\": \"you\"}"));

                // 4. Choose Thanks
                ex2.add(createExercise(l2, 4, "choose",
                                l(sourceCode, "Как сказать 'Спасибо'?", " 'Рахмет' қалай болады?",
                                                "How to say 'Thanks'?"),
                                "Thanks",
                                arr("Hello", "Thanks", "Goodbye", "Please"), 1, null,
                                arr(null, "audio/en_thanks.mp3", null, null)));

                // 5. Choose Hello sound
                ex2.add(createExercise(l2, 5, "choose",
                                l(sourceCode, "Выберите 'Hello':", " 'Hello' сөзін таңдаңыз:",
                                                "Choose 'Hello':"),
                                "Hello",
                                arr("Hi", "Goodbye", "Hello", "Thanks"), 2, null,
                                arr(null, null, "audio/en_hello.mp3", null)));

                // 6. Sentence 'Hi thanks'
                ex2.add(createSentenceExercise(l2, 6, promptTranslateStr + " 'Hi, thanks'", "Hi thanks",
                                arr("Hi", "thanks", "hello", "goodbye"), "{\"Hi\": \"Hi\", \"thanks\": \"thanks\"}"));

                l2.setExercises(ex2);
                lessons.add(l2);

                // === Lesson 3: Numbers 1-5 ===
                Lesson l3 = new Lesson();
                l3.setLevel(level);
                l3.setLessonNumber(3);
                l3.setTitle(l(sourceCode, "Числа 1-5", "Сандар 1-5", "Numbers 1-5"));
                l3.setLessonType("vocabulary");
                l3.setXpReward(30);

                LessonContent c3 = new LessonContent();
                c3.setLesson(l3);
                c3.setTheoryTitle(l(sourceCode, "Считаем до пяти", "Беске дейін санау", "Counting to Five"));
                c3.setTheoryText(l(sourceCode,
                                "**One** — 1\n**Two** — 2\n**Three** — 3\n**Four** — 4\n**Five** — 5\n\n" +
                                                "Попробуйте запомнить написание этих слов.",
                                "**One** — 1\n**Two** — 2\n**Three** — 3\n**Four** — 4\n**Five** — 5\n\n" +
                                                "Осы сөздердің жазылуын жаттап алыңыз.",
                                "**One** — 1\n**Two** — 2\n**Three** — 3\n**Four** — 4\n**Five** — 5"));
                l3.setContent(c3);

                List<Exercise> ex3 = new ArrayList<>();
                // 1. Match
                ex3.add(createExercise(l3, 1, "match",
                                l(sourceCode, "Сопоставьте числа:", "Сандарды сәйкестендіріңіз:",
                                                "Match the numbers:"),
                                "One=1,Two=2,Three=3,Four=4,Five=5",
                                arr("One=1", "Two=2", "Three=3", "Four=4", "Five=5"), 0, null,
                                arr("audio/en_1.mp3", "audio/en_2.mp3", "audio/en_3.mp3", "audio/en_4.mp3",
                                                "audio/en_5.mp3")));

                // 2. Choose 1
                ex3.add(createExercise(l3, 2, "choose",
                                l(sourceCode, "Как будет число 1?", " 1 саны қалай болады?",
                                                "What is 1?"),
                                "One",
                                arr("One", "Two", "Three", "Four"), 0, null, arr("audio/en_1.mp3", null, null, null)));

                // 3. Choose 3
                ex3.add(createExercise(l3, 3, "choose",
                                l(sourceCode, "Как будет число 3?", " 3 саны қалай болады?",
                                                "What is 3?"),
                                "Three",
                                arr("Two", "Three", "Four", "Five"), 1, null, arr(null, "audio/en_3.mp3", null, null)));

                // 4. Choose 5
                ex3.add(createExercise(l3, 4, "choose",
                                l(sourceCode, "Как будет число 5?", " 5 саны қалай болады?",
                                                "What is 5?"),
                                "Five",
                                arr("Three", "Four", "Five", "One"), 2, null, arr(null, null, "audio/en_5.mp3", null)));

                // 5. Sentence
                String promptTranslateStrNum = l(sourceCode, "Переведите:", "Аударыңыз:", "Translate:");
                ex3.add(createSentenceExercise(l3, 5, promptTranslateStrNum + " 'Three apples'", "Three apples",
                                arr("Three", "apples", "two", "one"),
                                "{\"Three\": \"Three\", \"apples\": \"apples\"}"));

                // 6. Sentence
                ex3.add(createSentenceExercise(l3, 6, promptTranslateStrNum + " 'One banana'", "One banana",
                                arr("One", "banana", "two", "five"), "{\"One\": \"One\", \"banana\": \"banana\"}"));

                l3.setExercises(ex3);
                lessons.add(l3);

                level.setLessons(lessons);
                return level;
        }

        // ========== АНГЛИЙСКИЙ УРОВЕНЬ 2 (5 уроков, по 8-9 упражнений) ==========

        private Level createENLevel2(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                Level level = new Level();
                level.setCourse(course);
                level.setLevelNumber(2);
                level.setTitle(l(sourceCode, "Предметы и цвета", "Заттар мен түстер", "Items and Colors"));
                level.setDescription(l(sourceCode, "Обычные объекты и цвета", "Күнделікті заттар мен түстер",
                                "Common objects and colors"));
                level.setRequiredXp(100);

                List<Lesson> lessons = new ArrayList<>();
                // Урок 1: Animals
                lessons.add(createInteractiveLesson(level, 1, l(sourceCode, "Животные", "Жануарлар", "Animals"),
                                "vocabulary", 40,
                                sourceCode.equals("ru")
                                                ? arr("Cat=Кошка", "Dog=Собака", "Horse=Лошадь", "Cow=Корова",
                                                                "Sheep=Овца")
                                                : arr("Cat=Мысық", "Dog=Ит", "Horse=Ат", "Cow=Сиыр", "Sheep=Қой"),
                                arr("audio/en_cat.mp3", "audio/en_dog.mp3", "audio/en_horse.mp3", "audio/en_cow.mp3",
                                                "audio/en_sheep.mp3")));

                // Урок 2: Colors
                lessons.add(createInteractiveLesson(level, 2, l(sourceCode, "Цвета", "Түстер", "Colors"),
                                "vocabulary", 40,
                                arr("White=Белый", "Black=Черный", "Red=Красный", "Blue=Синий", "Green=Зеленый"),
                                arr("audio/en_white.mp3", "audio/en_black.mp3", "audio/en_red.mp3", "audio/en_blue.mp3",
                                                "audio/en_green.mp3")));

                // Урок 3: Simple Phrases
                Lesson l3 = new Lesson();
                l3.setLevel(level);
                l3.setLessonNumber(3);
                l3.setTitle(l(sourceCode, "This is...", "Бұл...", "This is..."));
                l3.setLessonType("conversation");
                l3.setXpReward(45);
                LessonContent c3 = new LessonContent();
                c3.setLesson(l3);
                c3.setTheoryText("We use 'This is' to describe things.\nExample: This is a cat. This is a black dog.");
                l3.setContent(c3);

                List<Exercise> ex3 = new ArrayList<>();
                String pt = l(sourceCode, "Переведите:", "Аударыңыз:", "Translate:");
                ex3.add(createSentenceExercise(l3, 1, pt + " 'This is a red horse'", "This is a red horse",
                                arr("This", "is", "a", "red", "horse", "blue"), "{\"red\": \"красный/қызыл\"}"));

                l3.setExercises(ex3);
                lessons.add(l3);

                level.setLessons(lessons);
                return level;
        }

        private Level createENLevel3(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                Level level = new Level();
                level.setCourse(course);
                level.setLevelNumber(3);
                level.setTitle(l(sourceCode, "Семья и Дом", "Отбасы мен Үй", "Family and Home"));
                level.setDescription(l(sourceCode, "Члены семьи и предметы дома", "Отбасы мүшелері мен үй заттары",
                                "Family members and house items"));
                level.setRequiredXp(250);

                List<Lesson> lessons = new ArrayList<>();
                lessons.add(createInteractiveLesson(level, 1, l(sourceCode, "Семья", "Отбасы", "Family"), "vocabulary",
                                45,
                                sourceCode.equals("ru")
                                                ? arr("Father=Отец", "Mother=Мать", "Brother=Брат", "Sister=Сестра",
                                                                "Son=Сын", "Daughter=Дочь")
                                                : arr("Father=Әке", "Mother=Ана", "Brother=Аға", "Sister=Қарындас",
                                                                "Son=Ұл", "Daughter=Қыз"),
                                arr("audio/en_father.mp3", "audio/en_mother.mp3", "audio/en_brother.mp3",
                                                "audio/en_sister.mp3", "audio/en_son.mp3", "audio/en_daughter.mp3")));

                lessons.add(createInteractiveLesson(level, 2, l(sourceCode, "Дом", "Үй", "Home"), "vocabulary", 40,
                                arr("House=Дом", "Door=Дверь", "Window=Окно", "Room=Комната", "Key=Ключ"),
                                arr("audio/en_house.mp3", "audio/en_door.mp3", "audio/en_window.mp3",
                                                "audio/en_room.mp3", "audio/en_key.mp3")));

                level.setLessons(lessons);
                return level;
        }

        // Остальные уровни английского (4-10) - упрощенные
        private Level createENLevel4(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                Level level = new Level();
                level.setCourse(course);
                level.setLevelNumber(4);
                level.setTitle(l(sourceCode, "Еда и Ресторан", "Тамақ пен Мейрамхана", "Food & Restaurant"));
                level.setDescription(l(sourceCode, "Заказ еды и названия ингредиентов",
                                "Тамаққа тапсырыс беру және ингредиенттер", "Ordering food and naming ingredients"));
                level.setRequiredXp(500);

                List<Lesson> lessons = new ArrayList<>();
                lessons.add(createInteractiveLesson(level, 1, l(sourceCode, "Еда", "Тамақ", "Food"), "vocabulary", 45,
                                sourceCode.equals("ru")
                                                ? arr("Bread=Хлеб", "Milk=Молоко", "Meat=Мясо", "Water=Вода", "Tea=Чай",
                                                                "Coffee=Кофе")
                                                : arr("Bread=Нан", "Milk=Сүт", "Meat=Ет", "Water=Су", "Tea=Шай",
                                                                "Coffee=Кофе"),
                                null));

                Lesson l2 = new Lesson();
                l2.setLevel(level);
                l2.setLessonNumber(2);
                l2.setTitle(l(sourceCode, "В кафе", "Дәмханада", "At the Cafe"));
                l2.setLessonType("conversation");
                l2.setXpReward(50);
                LessonContent cont2 = new LessonContent();
                cont2.setLesson(l2);
                cont2.setTheoryText("Order food: I would like a cup of tea, please.\nAsk for bill: The bill, please!");
                l2.setContent(cont2);

                List<Exercise> ex2 = new ArrayList<>();
                String pt = l(sourceCode, "Переведите:", "Аударыңыз:", "Translate:");
                ex2.add(createSentenceExercise(l2, 1, pt + " 'I would like tea'", "I would like tea",
                                arr("I", "would", "like", "tea", "coffee"), "{\"would like\": \"хотел бы/қалаймын\"}"));

                l2.setExercises(ex2);
                lessons.add(l2);

                level.setLessons(lessons);
                return level;
        }

        private Level createENLevel5(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                return createSimpleLevel(course, 5,
                                l(sourceCode, "Работа и Карьера", "Жұмыс пен Мансап", "Work and Career"),
                                l(sourceCode, "Профессии и собеседования", "Мамандықтар мен сұхбаттар",
                                                "Professions and interviews"),
                                450, 5, 5);
        }

        private Level createENLevel6(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                return createSimpleLevel(course, 6,
                                l(sourceCode, "Путешествия", "Саяхат", "Travel"),
                                l(sourceCode, "Бронирование и навигация", "Брондау және навигация",
                                                "Booking and navigation"),
                                600, 5, 5);
        }

        private Level createENLevel7(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                return createSimpleLevel(course, 7,
                                l(sourceCode, "Здоровье", "Денсаулық", "Health"),
                                l(sourceCode, "У врача и части тела", "Дәрігерде және дене мүшелері",
                                                "At the doctor and body parts"),
                                750, 5, 5);
        }

        private Level createENLevel8(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                return createSimpleLevel(course, 8,
                                l(sourceCode, "Технологии", "Технологиялар", "Technology"),
                                l(sourceCode, "Компьютеры и интернет", "Компьютерлер мен интернет",
                                                "Computers and the internet"),
                                900, 5, 5);
        }

        private Level createENLevel9(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                return createSimpleLevel(course, 9,
                                l(sourceCode, "Культура", "Мәдениет", "Culture"),
                                l(sourceCode, "Искусство, музыка, кино", "Өнер, музыка, кино", "Art, music, movies"),
                                1100, 5, 5);
        }

        private Level createENLevel10(Course course) {
                String sourceCode = course.getSourceLanguageCode();
                return createSimpleLevel(course, 10,
                                l(sourceCode, "Продвинутый", "Жетілдірілген", "Advanced"),
                                l(sourceCode, "Идиомы и сложные темы", "Идиомалар мен күрделі тақырыптар",
                                                "Idioms and complex topics"),
                                1350, 5, 5);
        }

        private Exercise createSentenceExercise(Lesson lesson, int num, String question, String fullSentence,
                        String[] words, String mappings) {
                Exercise ex = new Exercise();
                ex.setLesson(lesson);
                ex.setExerciseNumber(num);
                ex.setExerciseType("sentence");
                ex.setQuestionText(question);
                ex.setCorrectAnswer(fullSentence);
                ex.setDifficulty(1);
                ex.setMappings(mappings);

                List<ExerciseOption> opts = new ArrayList<>();
                for (int i = 0; i < words.length; i++) {
                        ExerciseOption opt = new ExerciseOption();
                        opt.setExercise(ex);
                        opt.setOptionText(words[i]);
                        opt.setIsCorrect(true);
                        opt.setOptionOrder(i + 1);
                        opts.add(opt);
                }
                ex.setOptions(opts);
                return ex;
        }

        // ==================== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ====================

        // Создание простого уровня (для уровней 4-10)
        private Level createSimpleLevel(Course course, int levelNum, String title, String desc,
                        int reqXp, int lessonCount, int exCount) {
                String sourceCode = course.getSourceLanguageCode();
                Level level = new Level();
                level.setCourse(course);
                level.setLevelNumber(levelNum);
                level.setTitle(title);
                level.setDescription(desc);
                level.setRequiredXp(reqXp);

                List<Lesson> lessons = new ArrayList<>();
                String[] lessonTitles = {
                                l(sourceCode, "Словарь 1", "Сөздік 1", "Vocabulary 1"),
                                l(sourceCode, "Словарь 2", "Сөздік 2", "Vocabulary 2"),
                                l(sourceCode, "Грамматика", "Грамматика", "Grammar"),
                                l(sourceCode, "Практика", "Тәжірибе", "Practice"),
                                l(sourceCode, "Общение", "Қарым-қатынас", "Conversation"),
                                l(sourceCode, "Тест", "Сынақ", "Test")
                };

                for (int i = 0; i < lessonCount; i++) {
                        Lesson lesson = new Lesson();
                        lesson.setLevel(level);
                        lesson.setLessonNumber(i + 1);
                        lesson.setTitle(lessonTitles[i % lessonTitles.length] + " " + (i + 1));
                        lesson.setLessonType(i % 2 == 0 ? "vocabulary" : "grammar");
                        lesson.setXpReward(15 + (i * 2));

                        LessonContent content = new LessonContent();
                        content.setLesson(lesson);
                        content.setTheoryText(l(sourceCode,
                                        "Содержание урока для " + lesson.getTitle(),
                                        lesson.getTitle() + " үшін сабақ мазмұны",
                                        "Lesson content for " + lesson.getTitle()));
                        content.setExamples(
                                        l(sourceCode, "Примеры предложений", "Сөйлем мысалдары", "Example sentences"));
                        content.setTips(l(sourceCode, "Повторение — мать учения!", "Қайталау — оқу анасы!",
                                        "Practice makes perfect!"));
                        lesson.setContent(content);

                        // Создаем упражнения
                        List<Exercise> exercises = new ArrayList<>();
                        for (int j = 0; j < exCount; j++) {
                                exercises.add(createExercise(lesson, j + 1, "choose",
                                                l(sourceCode, "Вопрос " + (j + 1), (j + 1) + "-сұрақ",
                                                                "Question " + (j + 1)),
                                                l(sourceCode, "Ответ " + (j + 1), (j + 1) + "-жауап",
                                                                "Answer " + (j + 1)),
                                                arr(l(sourceCode, "Ответ 1", "1-жауап", "Answer 1"),
                                                                l(sourceCode, "Ответ 2", "2-жауап", "Answer 2"),
                                                                l(sourceCode, "Ответ 3", "3-жауап", "Answer 3"),
                                                                l(sourceCode, "Ответ 4", "4-жауап", "Answer 4")),
                                                j % 4));
                        }
                        lesson.setExercises(exercises);
                        lessons.add(lesson);
                }

                level.setLessons(lessons);
                return level;
        }

        // Создание упражнения (Main method with audioUrl and mappings)
        private Exercise createExercise(Lesson lesson, int num, String type, String question,
                        String answer, String[] options, int correctIndex, String mappings, String[] audioUrls) {
                Exercise ex = new Exercise();
                ex.setLesson(lesson);
                ex.setExerciseNumber(num);
                ex.setExerciseType(type);
                ex.setQuestionText(question);
                ex.setCorrectAnswer(answer);
                ex.setDifficulty(1);
                ex.setMappings(mappings);

                List<ExerciseOption> opts = new ArrayList<>();
                for (int i = 0; i < options.length; i++) {
                        ExerciseOption opt = new ExerciseOption();
                        opt.setExercise(ex);
                        opt.setOptionText(options[i]);
                        opt.setIsCorrect(i == correctIndex);
                        opt.setOptionOrder(i + 1);
                        if (audioUrls != null && i < audioUrls.length) {
                                opt.setAudioUrl(audioUrls[i]);
                        }
                        opts.add(opt);
                }
                ex.setOptions(opts);
                return ex;
        }

        // ==================== OVERLOADS ====================

        private Exercise createExercise(Lesson lesson, int num, String type, String question,
                        String answer, String[] options, int correctIndex) {
                return createExercise(lesson, num, type, question, answer, options, correctIndex, null, null);
        }

        // Вспомогательный метод для создания массива
        // Helper for localized strings
        private String l(String source, String ru, String kk, String en) {
                if (source.equals("ru"))
                        return ru;
                if (source.equals("kk"))
                        return kk;
                if (source.equals("en"))
                        return en;
                return ru; // fallback
        }

        private String[] arr(String... items) {
                return items;
        }

        // ==================== PUBLIC МЕТОДЫ ====================

        public List<Course> getAllCourses() {
                return courseRepository.findAll();
        }

        public List<Course> getCoursesBySource(String sourceCode) {
                return courseRepository.findBySourceLanguageCode(sourceCode);
        }

        @SuppressWarnings("null")
        public Course getCourseById(Long id) {
                return courseRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Course not found"));
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
}
