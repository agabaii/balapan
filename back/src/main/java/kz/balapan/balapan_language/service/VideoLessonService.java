
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
                // Initialize only if no video lessons exist to preserve progress
                if (videoLessonRepository.count() == 0) {
                        createRealVideoLessons();
                }
        }

        private void createRealVideoLessons() {
                // 1. Разговорный казахский для начинающих
                VideoLesson v1 = new VideoLesson();
                v1.setTitle("Разговорный казахский для начинающих");
                v1.setTitleKk("Бастаушыларға арналған қазақ тілі");
                v1.setDescription("Способы приветствия, прощания и знакомства.");
                v1.setYoutubeUrl("https://youtu.be/vU_7Z8P3ZjU");
                v1.setYoutubeId("vU_7Z8P3ZjU");
                v1.setDifficultyLevel("beginner");
                v1.setDurationMinutes(10);
                v1.setXpReward(50);
                v1.setOrderNumber(1);
                v1.setIsActive(true);
                v1.setLanguage("kazakh");
                v1.setThumbnailUrl("https://img.youtube.com/vi/vU_7Z8P3ZjU/maxresdefault.jpg");

                List<VideoQuestion> q1 = new ArrayList<>();
                q1.add(createQ(v1, 1, "Какие три способа сказать «привет» на казахском и как на них отвечать?",
                                "Сәлеметсіз бе, Сәлем", false,
                                "Қалың қалай?", false,
                                "Рахмет, Кешіріңіз", false,
                                "Сау бол", true));
                q1.add(createQ(v1, 2, "Как сказать «спасибо», «пожалуйста» и «извините»?",
                                "Өтінемін, Кешіріңіз, Рахмет", true,
                                "Күшті", false,
                                "Сәлеметсіз бе", false,
                                "Жақсы", false));
                q1.add(createQ(v1, 3, "Переведите «Как тебя зовут?» и «Как дела?»",
                                "Сен кімсің?", false,
                                "Атың кім? Қалайсың?", true,
                                "Не болды? Қайда оқисың?", false,
                                "Сау бол, Ертең көреміз", false));
                q1.add(createQ(v1, 4, "Какие фразы означают варианты «до свидания», например «до завтра»?",
                                "Сау бол, Сау болсыңдар, Соң", false,
                                "Сау бол, Ертеңге дейін, Көріскенше", true,
                                "Рахмет, Кешіріңіз, Харлы", false,
                                "Сәлеметсіз бе, Жақсы, Өтінемін", false));
                v1.setQuestions(q1);
                videoLessonRepository.save(v1);

                // 2. 10 универсальных фраз
                VideoLesson v2 = new VideoLesson();
                v2.setTitle("10 универсальных фраз");
                v2.setTitleKk("10 әмбебап сөз тіркесі");
                v2.setDescription("Универсальные фразы для общения.");
                v2.setYoutubeUrl("https://youtu.be/4u9g35WNIJ8");
                v2.setYoutubeId("4u9g35WNIJ8");
                v2.setDifficultyLevel("beginner");
                v2.setDurationMinutes(12);
                v2.setXpReward(50);
                v2.setOrderNumber(2);
                v2.setIsActive(true);
                v2.setLanguage("kazakh");
                v2.setThumbnailUrl("https://img.youtube.com/vi/4u9g35WNIJ8/maxresdefault.jpg");

                List<VideoQuestion> q2 = new ArrayList<>();
                q2.add(createQ(v2, 1, "Что значит «қандас» и к кому это обращение?",
                                "Брат, к парням", false,
                                "Сестрёнка, к молодым девушкам", true,
                                "Душа моя, к родным", false,
                                "Вот так, универсально", false));
                q2.add(createQ(v2, 2, "Перечислите три использования «солай солай»",
                                "Вот так; заполнить паузу; согласие", true,
                                "Перестань; удивление; по-своему", false,
                                "Рахмет; не за что; базар жоқ", false,
                                "Кандас; тате; опай", false));
                q2.add(createQ(v2, 3, "Переведите «базар жоқ» и «қой»",
                                "Базар жоқ - круто; Қой - продолжай", false,
                                "Базар жоқ - согласен, классно; Қой - перестань", true,
                                "Базар жоқ - рынок нет; Қой - хорошо", false,
                                "Базар жоқ - не верю; Қой - завтра", false));
                v2.setQuestions(q2);
                videoLessonRepository.save(v2);

                // 3. Как рассказать о себе
                VideoLesson v3 = new VideoLesson();
                v3.setTitle("Как рассказать о себе");
                v3.setTitleKk("Өзің туралы қалай айтуға болады");
                v3.setDescription("Фразы для рассказа о себе.");
                v3.setYoutubeUrl("https://youtu.be/0hG1vDJ5NFw");
                v3.setYoutubeId("0hG1vDJ5NFw");
                v3.setDifficultyLevel("beginner");
                v3.setDurationMinutes(15);
                v3.setXpReward(55);
                v3.setOrderNumber(3);
                v3.setIsActive(true);
                v3.setLanguage("kazakh");
                v3.setThumbnailUrl("https://img.youtube.com/vi/0hG1vDJ5NFw/maxresdefault.jpg");

                List<VideoQuestion> q3 = new ArrayList<>();
                q3.add(createQ(v3, 1, "Как сказать «Меня зовут…» на казахском?",
                                "Менің атым…", true,
                                "Мен …мын", false,
                                "Атың кім?", false,
                                "Баршасың ба?", false));
                q3.add(createQ(v3, 2, "Фраза для «Я учусь на экономическом факультете университета»",
                                "Мен университеттің экономика факультетінде оқимын", true,
                                "Мен мектепті бітірдім", false,
                                "Мен жұмыс істеймін", false,
                                "Менің атым…", false));
                q3.add(createQ(v3, 3, "Переведите «Я женат/замужем» и «Я холост/холоста»",
                                "Ұлымын / Қызмын", false,
                                "Үйленгенмін / Заманым", true,
                                "Бала бар / Баласыз", false,
                                "Жұмыс істеймін / Оқимын", false));
                q3.add(createQ(v3, 4, "Как спросить «Чем вы занимаетесь по работе?»?",
                                "Не істейсіз?", false,
                                "Қайда жұмыс істейсіз?", true,
                                "Атың кім?", false,
                                "Балаларың бар ма?", false));
                q3.add(createQ(v3, 5, "Ответ на «У вас есть дети?»",
                                "Иә, бар / Жоқ", true,
                                "Мен оқимын", false,
                                "Үйленгенмін", false,
                                "Университетте оқимын", false));
                v3.setQuestions(q3);
                videoLessonRepository.save(v3);

                // 4. Праздник Наурыз
                VideoLesson v4 = new VideoLesson();
                v4.setTitle("Праздник Наурыз");
                v4.setTitleKk("Наурыз мейрамы");
                v4.setDescription("Традиции праздника Наурыз.");
                v4.setYoutubeUrl("https://youtu.be/1BnUbCdTWtw");
                v4.setYoutubeId("1BnUbCdTWtw");
                v4.setDifficultyLevel("beginner");
                v4.setDurationMinutes(10);
                v4.setXpReward(50);
                v4.setOrderNumber(4);
                v4.setIsActive(true);
                v4.setLanguage("kazakh");
                v4.setThumbnailUrl("https://img.youtube.com/vi/1BnUbCdTWtw/maxresdefault.jpg");

                List<VideoQuestion> q4 = new ArrayList<>();
                q4.add(createQ(v4, 1, "Назовите 7 ингредиентов наурыз көже и их символы",
                                "Су, ет, бидай, тұз, май, ұн, сүт", true,
                                "Күріш, ет, пияз, сарымай, қымыз", false,
                                "Наурыз, көже, киіз, шапан", false,
                                "Су, от, жер, ауа, металл", false));
                q4.add(createQ(v4, 2, "Переведите «Наурыз құтты болсын»",
                                "С Наурызом!", false,
                                "Пусть Наурыз будет счастливым", true,
                                "Весна пришла", false,
                                "Новый год", false));
                q4.add(createQ(v4, 3, "Этимология слова «Наурыз»",
                                "Новый день (nau - новый, ryz - день)", true,
                                "Весенний праздник", false,
                                "Кочевой праздник", false,
                                "Семь ингредиентов", false));
                q4.add(createQ(v4, 4, "Какие традиции включают одежду и игры?",
                                "Национальная одежда, лошадиные скачки, игры", true,
                                "Только наурыз кошы", false,
                                "Гостеприимство", false,
                                "Молитвы", false));
                v4.setQuestions(q4);
                videoLessonRepository.save(v4);

                // 5. Различение звуков (н/ң, ұ/ү)
                VideoLesson v5 = new VideoLesson();
                v5.setTitle("Различение звуков (н/ң, ұ/ү)");
                v5.setTitleKk("Дыбыстарды ажырату (н/ң, ұ/ү)");
                v5.setDescription("Произношение специфических звуков.");
                v5.setYoutubeUrl("https://youtu.be/wsc7PwL1D6c");
                v5.setYoutubeId("wsc7PwL1D6c");
                v5.setDifficultyLevel("beginner");
                v5.setDurationMinutes(8);
                v5.setXpReward(45);
                v5.setOrderNumber(5);
                v5.setIsActive(true);
                v5.setLanguage("kazakh");
                v5.setThumbnailUrl("https://img.youtube.com/vi/wsc7PwL1D6c/maxresdefault.jpg");

                List<VideoQuestion> q5 = new ArrayList<>();
                q5.add(createQ(v5, 1, "В чём разница между Н и Ң с примерами слов?",
                                "Н - передний, Ң - задний (ана - мама, аң - охотник)", false,
                                "Н - твёрдый, Ң - мягкий (наурыз, аңғам)", true,
                                "Н - гласный, Ң - согласный", false,
                                "Н - короткий, Ң - длинный", false));
                q5.add(createQ(v5, 2, "Опишите звуки Ұ и Ү",
                                "Ұ - задний округлый, Ү - передний округлый", true,
                                "Ұ - как \"у\", Ү - как \"ю\"", false,
                                "Ұ - открытый, Ү - закрытый", false,
                                "Оба как русский \"у\"", false));
                q5.add(createQ(v5, 3, "Положение языка для этих согласных",
                                "Для Ң - корень языка назад, для Н - вперёд", false,
                                "Для Н - язык к зубам, Ң - к нёбу", true,
                                "Одинаковое положение", false,
                                "Ң произносится как \"нг\"", false));
                q5.add(createQ(v5, 4, "Придумайте предложение для практики различий",
                                "Ана наурыз тойын аңғады (мама понимает праздник Наурыз)", true,
                                "Наурызда аң бар", false,
                                "Ұл ұнатады үлкен үйді", false,
                                "Нұр аңды көреді", false));
                v5.setQuestions(q5);
                videoLessonRepository.save(v5);

                // 6. Диалог в ресторане
                VideoLesson v6 = new VideoLesson();
                v6.setTitle("Диалог в ресторане");
                v6.setTitleKk("Мейрамханадағы диалог");
                v6.setDescription("Фразы для заказа еды.");
                v6.setYoutubeUrl("https://youtu.be/uJsmZReKJDI");
                v6.setYoutubeId("uJsmZReKJDI");
                v6.setDifficultyLevel("intermediate");
                v6.setDurationMinutes(12);
                v6.setXpReward(60);
                v6.setOrderNumber(6);
                v6.setIsActive(true);
                v6.setLanguage("kazakh");
                v6.setThumbnailUrl("https://img.youtube.com/vi/uJsmZReKJDI/maxresdefault.jpg");

                List<VideoQuestion> q6 = new ArrayList<>();
                q6.add(createQ(v6, 1, "Переведите «Этот столик свободен?» и ответ",
                                "Бұл дастан бос па? Иә, бос", false,
                                "Бұл үстел бос па? Иә, бос", true,
                                "Мейрамхана бос па? Жоқ", false,
                                "Ас мәзірі бар ма?", false));
                q6.add(createQ(v6, 2, "Закажите закуску: икру и салат из огурцов",
                                "Алдын ала: хайу, қияр салаты", false,
                                "Суыма: икра, қияр салаты", true,
                                "Бірінші: сорпа", false,
                                "Екінші: ет", false));
                q6.add(createQ(v6, 3, "Спросите «Что на первое/второе?»",
                                "Бірінші не аласыз? Екінші не аласыз?", true,
                                "Алдын ала не?", false,
                                "Суыма бар ма?", false,
                                "Шырын ішемін", false));
                q6.add(createQ(v6, 4, "Укажите «чёрную икру, пожалуйста»",
                                "Қара икра, өтінемін", true,
                                "Қызыл икра", false,
                                "Көп икра", false,
                                "Жасыл икра", false));
                q6.add(createQ(v6, 5, "Фраза для «Меню, пожалуйста»",
                                "Ас мәзіріне қараңызшы", false,
                                "Мәзірді көріңіз", true,
                                "Бұл үстел бос па?", false,
                                "Рахмет", false));
                v6.setQuestions(q6);
                videoLessonRepository.save(v6);

                // 7. Падежи в казахском
                VideoLesson v7 = new VideoLesson();
                v7.setTitle("Падежи в казахском");
                v7.setTitleKk("Қазақ тіліндегі септіктер");
                v7.setDescription("Разбор всех падежей.");
                v7.setYoutubeUrl("https://youtu.be/WjJwjoxAytw");
                v7.setYoutubeId("WjJwjoxAytw");
                v7.setDifficultyLevel("intermediate");
                v7.setDurationMinutes(20);
                v7.setXpReward(70);
                v7.setOrderNumber(7);
                v7.setIsActive(true);
                v7.setLanguage("kazakh");
                v7.setThumbnailUrl("https://img.youtube.com/vi/WjJwjoxAytw/maxresdefault.jpg");

                List<VideoQuestion> q7 = new ArrayList<>();
                q7.add(createQ(v7, 1, "Зачем нужны падежи у казахских существительных?",
                                "Показывают принадлежность, направление, средство", true,
                                "Меняют род и число", false,
                                "Добавляют прилагательные", false,
                                "Указывают время", false));
                q7.add(createQ(v7, 2, "Примеры: родительный, дательный",
                                "Анамның (мамы), анаға (маме)", true,
                                "Ана + ны = анаң", false,
                                "Мен анамын", false,
                                "Ана бар", false));
                q7.add(createQ(v7, 3, "Сколько всего падежей?",
                                "7 падежей", false,
                                "6 падежей", true,
                                "12 падежей", false,
                                "Без падежей", false));
                q7.add(createQ(v7, 4, "Составьте предложение с творительным падежом",
                                "Анамен сөйлесемін (говорю с мамой)", false,
                                "Қолымен жазамын (пишу рукой)", true,
                                "Үйге барамын", false,
                                "Кітапты оқимын", false));
                q7.add(createQ(v7, 5, "Отличие от падежей в русском",
                                "Казахские окончания agglutinative (приставляются)", true,
                                "Одинаковые с русскими", false,
                                "Только 3 падежа", false,
                                "Предлоги вместо окончаний", false));
                v7.setQuestions(q7);
                videoLessonRepository.save(v7);

                // 8. Связанные фразы (базовые из Soyle)
                VideoLesson v8 = new VideoLesson();
                v8.setTitle("Связанные фразы (Soyle)");
                v8.setTitleKk("Байланыс фразалары (Soyle)");
                v8.setDescription("Базовые фразы из курса Soyle.");
                v8.setYoutubeUrl("https://youtu.be/kXvFxKZGt6w");
                v8.setYoutubeId("kXvFxKZGt6w");
                v8.setDifficultyLevel("beginner");
                v8.setDurationMinutes(10);
                v8.setXpReward(50);
                v8.setOrderNumber(8);
                v8.setIsActive(true);
                v8.setLanguage("kazakh");
                v8.setThumbnailUrl("https://img.youtube.com/vi/kXvFxKZGt6w/maxresdefault.jpg");

                List<VideoQuestion> q8 = new ArrayList<>();
                q8.add(createQ(v8, 1, "Какие базовые фразы из введения Soyle?",
                                "Сәлеметсіз бе, Рахмет, Сау бол", false,
                                "Қазақша сөйлейік", true,
                                "Барлық сөздер", false,
                                "Тек грамматика", false));
                q8.add(createQ(v8, 2, "Как получить бесплатные ресурсы?",
                                "Soyle.kz онлайн-портал", true,
                                "Купить книгу", false,
                                "Платный курс", false,
                                "Только видео", false));
                q8.add(createQ(v8, 3, "Советы по самостоятельному изучению",
                                "Повторять за диктором, практиковать ежедневно", true,
                                "Читать книги", false,
                                "Смотреть фильмы", false,
                                "Записывать слова", false));
                q8.add(createQ(v8, 4, "Практика приветствий",
                                "Сәлеметсіз бе - формальное, Сәлем - неформальное", true,
                                "Только Сәлем", false,
                                "Рахмет вместо приветствия", false,
                                "Күліп сәлем", false));
                v8.setQuestions(q8);
                videoLessonRepository.save(v8);

                // 9. Семья и рассказы
                VideoLesson v9 = new VideoLesson();
                v9.setTitle("Семья и рассказы");
                v9.setTitleKk("Отбасы және әңгімелер");
                v9.setDescription("Члены семьи и истории.");
                v9.setYoutubeUrl("https://youtu.be/0DpQjP-nZqk");
                v9.setYoutubeId("0DpQjP-nZqk");
                v9.setDifficultyLevel("beginner");
                v9.setDurationMinutes(12);
                v9.setXpReward(55);
                v9.setOrderNumber(9);
                v9.setIsActive(true);
                v9.setLanguage("kazakh");
                v9.setThumbnailUrl("https://img.youtube.com/vi/0DpQjP-nZqk/maxresdefault.jpg");

                List<VideoQuestion> q9 = new ArrayList<>();
                q9.add(createQ(v9, 1, "Опишите членов семьи на казахском",
                                "Ата - отец, Ана - мать, Аға - брат", false,
                                "Отбасы: ата, ана, аға, әже, бала", true,
                                "Дос - друг, Туыс - родственник", false,
                                "Барлық отбасы", false));
                q9.add(createQ(v9, 2, "Простая история в прошедшем времени",
                                "Кеше мен отбасымен болдым", false,
                                "Әжем әңгіме айтты (бабушка рассказала историю)", true,
                                "Бүгін барамын", false,
                                "Ертең келемін", false));
                q9.add(createQ(v9, 3, "Фразы для прослушивания",
                                "Отбасы туралы сөйлесу", false,
                                "Ата-анам қайда? Балаларың бар ма?", true,
                                "Тек грамматика", false,
                                "Ресторан диалоги", false));
                q9.add(createQ(v9, 4, "Повторите за спикером",
                                "Shadowing: отбасы мүшелерін атай салу", false,
                                "Тенируйте 3 раза: \"Менің ағам бар\"", true,
                                "Только чтение", false,
                                "Жазу ғана", false));
                v9.setQuestions(q9);
                videoLessonRepository.save(v9);

                // 10. Прослушивание
                VideoLesson v10 = new VideoLesson();
                v10.setTitle("Прослушивание");
                v10.setTitleKk("Тыңдалым");
                v10.setDescription("Тренировка понимания на слух.");
                v10.setYoutubeUrl("https://youtu.be/hkLp0_T9ymg");
                v10.setYoutubeId("hkLp0_T9ymg");
                v10.setDifficultyLevel("intermediate");
                v10.setDurationMinutes(15);
                v10.setXpReward(60);
                v10.setOrderNumber(10);
                v10.setIsActive(true);
                v10.setLanguage("kazakh");
                v10.setThumbnailUrl("https://img.youtube.com/vi/hkLp0_T9ymg/maxresdefault.jpg");

                List<VideoQuestion> q10 = new ArrayList<>();
                q10.add(createQ(v10, 1, "Ключевые слова из короткой истории",
                                "Күнделікті сөздер: үй, жұмыс, отбасы", false,
                                "Қысқа әңгіме: кеше, бардым, көрдім", true,
                                "Абстракт сөздер", false,
                                "Тек сұрақтар", false));
                q10.add(createQ(v10, 2, "Разница 1-го и 3-го лица",
                                "Мен бардым vs О барды", true,
                                "1-ши тұлға: -мын; 3-ши: -ды", false,
                                "Одинаковые формы", false,
                                "Тек сұрақтар", false));
                q10.add(createQ(v10, 3, "Тенирование аудио три раза",
                                "Shadowing техниканы қолданыңыз", false,
                                "3 рет қайталаңыз: толық сөйлеу", true,
                                "Тек тыңдау", false,
                                "Жазып алыңыз", false));
                q10.add(createQ(v10, 4, "Вопросы на понимание",
                                "Не болды? Кім бар? Қайда?", false,
                                "Түсінік сұрақтары: негізгі идея не?", true,
                                "Грамматика тексеру", false,
                                "Вокабуляр ғана", false));
                v10.setQuestions(q10);
                videoLessonRepository.save(v10);

                // 11. Разбор песни «Ана туралы жыр»
                VideoLesson v11 = new VideoLesson();
                v11.setTitle("Разбор песни «Ана туралы жыр»");
                v11.setTitleKk("«Ана туралы жыр» әнін талдау");
                v11.setDescription("Учим язык через песни.");
                v11.setYoutubeUrl("https://youtu.be/5nOnhiBsG8I");
                v11.setYoutubeId("5nOnhiBsG8I");
                v11.setDifficultyLevel("advanced");
                v11.setDurationMinutes(20);
                v11.setXpReward(80);
                v11.setOrderNumber(11);
                v11.setIsActive(true);
                v11.setLanguage("kazakh");
                v11.setThumbnailUrl("https://img.youtube.com/vi/5nOnhiBsG8I/maxresdefault.jpg");

                List<VideoQuestion> q11 = new ArrayList<>();
                q11.add(createQ(v11, 1, "Что значит «жастар» (свет мира)?",
                                "Темнота", false,
                                "Әлемнің жарығы - свет мира", true,
                                "Глаза", false,
                                "Крылья", false));
                q11.add(createQ(v11, 2, "Примеры родительного падежа «-ның»",
                                "Маганның, ананың (моей, мамы)", false,
                                "-ның сұйықтық: барлық жақтауыш", true,
                                "-ға дательный", false,
                                "-мен творительный", false));
                q11.add(createQ(v11, 3, "Переведите «алайлап» (колыбельная)",
                                "Убайкивает (алдырап)", false,
                                "Алайлап - колыбельная поёт", true,
                                "Обнимает", false,
                                "Развивается", false));
                q11.add(createQ(v11, 4, "Метафора свободы/крыльев",
                                "Қанаттар бердің (крылья дала)", false,
                                "Құстар қанаты - свобода метафорасы", true,
                                "Глаза весны", false,
                                "Цветы краёв", false));
                q11.add(createQ(v11, 5, "Значения «самал»",
                                "Лёгкий ветерок; имя Самал", true,
                                "Самал - жел, аялап күтеді", false,
                                "Объятия", false,
                                "Настроение", false));
                v11.setQuestions(q11);
                videoLessonRepository.save(v11);

                // 12. Диалог (парк/разговор)
                VideoLesson v12 = new VideoLesson();
                v12.setTitle("Диалог в парке");
                v12.setTitleKk("Саябақтағы диалог");
                v12.setDescription("Разговорная практика.");
                v12.setYoutubeUrl("https://youtu.be/rAWPSzIfzcI");
                v12.setYoutubeId("rAWPSzIfzcI");
                v12.setDifficultyLevel("intermediate");
                v12.setDurationMinutes(10);
                v12.setXpReward(50);
                v12.setOrderNumber(12);
                v12.setIsActive(true);
                v12.setLanguage("kazakh");
                v12.setThumbnailUrl("https://img.youtube.com/vi/rAWPSzIfzcI/maxresdefault.jpg");

                List<VideoQuestion> q12 = new ArrayList<>();
                q12.add(createQ(v12, 1, "Обмен приветствиями в парке",
                                "Сәлеметсіз бе? Қалайсыз?", false,
                                "Паркте: Сәлем, Харлы! Жақсы ма?", true,
                                "Ресторан фразалары", false,
                                "Наурыз тілектері", false));
                q12.add(createQ(v12, 2, "Повседневные вопросы и ответы",
                                "Не істеп жатырсың? Жақсымын", false,
                                "Күнделікті: ауа райы, жұмыс", true,
                                "Тек грамматика", false,
                                "Ән сөздері", false));
                q12.add(createQ(v12, 3, "Разбор предложений",
                                "Жай сөздерді талдау", false,
                                "Диалогты сөйлем-сөйлем талдау", true,
                                "Тек тыңдау", false,
                                "Жазу ғана", false));
                q12.add(createQ(v12, 4, "Практика фраз вслух",
                                "Дауыстап қайталау", false,
                                "Парк диалогын 3 рет айту", true,
                                "Тек оқу", false,
                                "Жаттау ғана", false));
                v12.setQuestions(q12);
                videoLessonRepository.save(v12);

                // 13. Глубокая грамматика (существительные)
                VideoLesson v13 = new VideoLesson();
                v13.setTitle("Глубокая грамматика");
                v13.setTitleKk("Тереңдетілген грамматика");
                v13.setDescription("Множественное число существительных.");
                v13.setYoutubeUrl("https://youtu.be/A_bdkXO8fXg");
                v13.setYoutubeId("A_bdkXO8fXg");
                v13.setDifficultyLevel("advanced");
                v13.setDurationMinutes(25);
                v13.setXpReward(75);
                v13.setOrderNumber(13);
                v13.setIsActive(true);
                v13.setLanguage("kazakh");
                v13.setThumbnailUrl("https://img.youtube.com/vi/A_bdkXO8fXg/maxresdefault.jpg");

                List<VideoQuestion> q13 = new ArrayList<>();
                q13.add(createQ(v13, 1, "Образование множественного числа существительных",
                                "-лар / -лер суффикси", false,
                                "Көпше: үйлер, адамдар", true,
                                "-дар тек", false,
                                "Без өзгеріс", false));
                q13.add(createQ(v13, 2, "Ключевые правила урока 1",
                                "Существительные + падежи + көпше", true,
                                "Номинатив, көпше ережелері", false,
                                "Тек глаголдар", false,
                                "Временалар", false));
                q13.add(createQ(v13, 3, "Примеры с прилагательными",
                                "Үлкен үйлер (большие дома)", false,
                                "Сын есімдер: жақсы кітаптар", true,
                                "Тек зат есім", false,
                                "Глаголдар", false));
                q13.add(createQ(v13, 4, "Упражнения на множественное число",
                                "Бір үй → үйлер", false,
                                "Көпше жасау: адам → адамдар", true,
                                "Тек сұрақтар", false,
                                "Тыңдау ғана", false));
                v13.setQuestions(q13);
                videoLessonRepository.save(v13);
        }

        // Helper to create a single question with answers
        private VideoQuestion createQ(VideoLesson video, int number, String text, Object... answers) {
                VideoQuestion q = new VideoQuestion();
                q.setVideoLesson(video);
                q.setQuestionNumber(number);
                q.setQuestionText(text);

                List<VideoAnswer> ansList = new ArrayList<>();
                for (int i = 0; i < answers.length; i += 2) {
                        String ansText = (String) answers[i];
                        Boolean isCorrect = (Boolean) answers[i + 1];
                        ansList.add(createVideoAnswer(q, ansText, (i / 2) + 1, isCorrect));
                }
                q.setAnswers(ansList);
                return q;
        }

        private VideoAnswer createVideoAnswer(VideoQuestion question, String text, int order, boolean isCorrect) {
                VideoAnswer answer = new VideoAnswer();
                answer.setQuestion(question);
                answer.setAnswerText(text);
                answer.setAnswerOrder(order);
                answer.setIsCorrect(isCorrect);
                return answer;
        }

        // ==================== PUBLIC METHODS ====================

        public List<VideoLesson> getAllActiveVideos(String language) {
                if (language == null)
                        language = "kazakh";
                return videoLessonRepository.findByLanguageAndIsActiveTrueOrderByOrderNumber(language);
        }

        public List<VideoLesson> getVideosByDifficulty(String difficulty, String language) {
                if (language == null)
                        language = "kazakh";
                return videoLessonRepository.findByLanguageAndDifficultyLevelAndIsActiveTrueOrderByOrderNumber(language,
                                difficulty);
        }

        public Optional<VideoLesson> getVideoById(Long id) {
                @SuppressWarnings("null")
                Optional<VideoLesson> video = videoLessonRepository.findById(id);
                return video;
        }

        @Transactional
        public UserVideoProgress startVideo(Long userId, Long videoId) {
                @SuppressWarnings("null")
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                @SuppressWarnings("null")
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
