import { Link } from 'react-router-dom';

export default function SectionPage() {
  const sections = [
    { name: 'СЕКЦИЯ 1', path: '/Les' },
    { name: 'СЕКЦИЯ 2', path: '/Set' },
    { name: 'СЕКЦИЯ 3', path: '/section3' },
    { name: 'СЕКЦИЯ 4', path: '/section4' },
    { name: 'СЕКЦИЯ 5', path: '/section5' },
    { name: 'СЕКЦИЯ 6', path: '/section6' },
    { name: 'ДОМАШНЯЯ РАБОТА', path: '/homework' }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFECF' }}>
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center">
        <Link to="/">
          <img 
            src="/fav.png" 
            className="h-18 cursor-pointer hover:opacity-80 transition"
            alt="Balapan Logo"
          />
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/lesson" className="text-base font-bold text-gray-700 hover:text-gray-900">
            Learn
          </Link>
          <Link to="/profile">
            <img 
              src="/ava.jpg" 
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
              alt="Avatar"
            />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Left Column */}
          <div className="flex-1">
            {/* Reading Button */}
            <div className="mb-6">
              <button 
                className="px-6 py-3 rounded-full font-bold text-sm border-2 transition"
                style={{ 
                  backgroundColor: '#FFFECF',
                  borderColor: '#000000',
                  color: '#000000'
                }}
              >
                ЧТЕНИЕ
              </button>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              {/* Image */}
              <div className="mb-6">
                <img 
                  src="/hogwarts.png" 
                  className="w-full h-80 object-cover rounded-xl"
                  alt="Hogwarts"
                />
              </div>

              {/* Text Content */}
              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-900 leading-relaxed">
                  ХОТЕЛИ ЛИ ВЫ КОГДА НИБУДЬ БЫТЬ СТУДЕНТОМ ХОГВАРТСА? ДАВАЙТЕ ПОСМОТРИМ, КАКОВ ДЕНЬ ИЗ ЖИЗНИ МОЛОДОГО ЧАРОВНИКА ИЛИ ЧАРОВНИЦЫ.
                </p>
                
                <p className="text-sm font-bold text-gray-900 leading-relaxed">
                  ХОГВАРТС - ЭТО ОСОБАЯ ШКОЛА-ПАНСИОН ДЛЯ МОЛОДЫХ УЧЕНИКОВ, КОТОРАЯ ДОСТАВЛЯЕТСЯ ЭКСПРЕССОМ ХОГВАРТСА ИЗ ЛОНДОНА В ШКОЛУ. УЧЕНИКИ ПЕРВОГО ГОДА ПЛАВАЮТ НА ЛОДКАХ, А СТАРШЕКЛАССНИКИ ЕДУТ НА МАГИЧЕСКИХ КАРЕТАХ.
                </p>

                <p className="text-sm font-bold text-gray-900 leading-relaxed">
                  УЧЕНИКИ ПРОСЫПАЮТСЯ, И ЗАНЯТИЯ НАЧИНАЮТСЯ. УЧЕНИКИ ПОЛУЧАЮТ СВОЙ ЗАЧЕТ НА ЗАВТРАКЕ. ЭТО НАПРЯЖЕННАЯ НЕДЕЛЯ.
                </p>

                <p className="text-sm font-bold text-gray-900 leading-relaxed">
                  ТИПИЧНЫЙ ДЕНЬ
                </p>

                <p className="text-sm font-bold text-gray-900 leading-relaxed">
                  ПОСЛЕ ЗАВТРАКА УЧЕНИКИ, КАК ПРАВИЛО, ВСТРЕЧАЮТСЯ В ВЕЛИКОМ ЗАЛЕ. ЗАТЕМ ОНИ ИДУТ НА ДВА УТРОЧНЫХ УРОКА С 9:00 ДО 12:30.
                </p>

                <p className="text-sm font-bold text-gray-900 leading-relaxed">
                  ОБЕД: ОБЕД С 12:30 ДО 13:30.
                </p>

                <p className="text-sm font-bold text-gray-900 leading-relaxed">
                  ПОСЛЕ ПОЛДНЯ: УЧЕНИКИ ИМЕЮТ ДВА УРОКА ДО 16:30.
                </p>

                <p className="text-sm font-bold text-gray-900 leading-relaxed">
                  ВЕЧЕРОМ: УЧЕНИКИ УЖИНАЮТ, А ЗАТЕМ ДЕЛАЮТ СВОИ ДОМАШНИЕ ЗАДАНИЯ. ЭТО ХОРОШЕЕ ВРЕМЯ, ЧТОБЫ УЧИТЬСЯ ИЛИ ПОГОВОРИТЬ С ДРУЗЬЯМИ.
                </p>

                <p className="text-sm font-bold text-gray-900 leading-relaxed">
                  ВЫХОДНЫЕ
                </p>

                <p className="text-sm font-bold text-gray-900 leading-relaxed">
                  БИБЛИОТЕКА ОТКРЫТА ДО ПОЗДНЕГО ВРЕМЕНИ ДЛЯ УЧЕНИКОВ, КОТОРЫЕ ХОТЯТ ЧИТАТЬ ИЛИ УЧИТЬСЯ БОЛЬШЕ. У НИХ ЕСТЬ УРОКИ С ПОНЕДЕЛЬНИКА ПО ПЯТНИЦУ, НО СУББОТА И ВОСКРЕСЕНЬЕ - СВОБОДНЫЕ ДНИ!
                </p>

                <p className="text-sm font-bold text-gray-900 leading-relaxed">
                  ВЫХОДНЫЕ: УЧЕНИКИ МОГУТ ОТДОХНУТЬ, ИГРАТЬ В КВИДДИЧ ИЛИ ПОСЕТИТЬ ХОГСМИД. ПРАЗДНИК ХЭЛЛОУИНА В ОКТЯБРЕ И РОЖДЕСТВЕНСКИЙ ПРАЗДНИК В ДЕКАБРЕ. У НИХ ТАКЖЕ ЕСТЬ МАТЧИ ПО КВИДДИЧУ В НОЯБРЕ, ШКОЛЬНЫЙ ГОД ЗАКАНЧИВАЕТСЯ В МАЕ / ИЮНЕ, ЧТО ЯВЛЯЕТСЯ ПОЛНЫМ ЧАРОВНИКОМ, НО ЭТО МНОГО РАБОТЫ!
                </p>
              </div>

              {/* Quiz Section */}
              <div className="mt-8 p-6 rounded-2xl border-2 border-black" style={{ backgroundColor: '#FFFECF' }}>
                <h3 className="text-sm font-bold text-gray-900 mb-4">
                  КВИЗ НА ДОМ В ХОГВАРТСЕ
                </h3>

                <div className="space-y-6">
                  {/* Question 1 */}
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-3">
                      1. ЧТО ДЛЯ ТЕБЯ ВАЖНО В ШКОЛЕ?
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="radio" name="q1" className="w-4 h-4" />
                        <span className="text-sm font-medium text-gray-800">A) ДОСТИЖЕНИЕ СВОИХ ЦЕЛЕЙ И БЫТЬ ЛУЧШИМ</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="radio" name="q1" className="w-4 h-4" />
                        <span className="text-sm font-medium text-gray-800">B) ЗАЩИТА СВОИХ ДРУЗЕЙ И БОРЬБА ЗА ПРАВДУ</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="radio" name="q1" className="w-4 h-4" />
                        <span className="text-sm font-medium text-gray-800">C) ИЗУЧЕНИЕ НОВЫХ ВЕЩЕЙ И БЫТЬ САМЫМ УМНЫМ</span>
                      </label>
                    </div>
                  </div>

                  {/* Question 2 */}
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-3">
                      КАКУЮ МАГИЧЕСКУЮ СПОСОБНОСТЬ ВЫ БЫ ХОТЕЛИ ИМЕТЬ?
                    </p>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="radio" name="q2" className="w-4 h-4" />
                        <span className="text-sm font-medium text-gray-800">A) СПОСОБНОСТЬ ЧИТАТЬ МЫСЛИ, ЧТОБЫ ВСЕГДА БЫТЬ НА ШАГ ВПЕРЕДИ.</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="radio" name="q2" className="w-4 h-4" />
                        <span className="text-sm font-medium text-gray-800">B) СПОСОБНОСТЬ ЛЕТАТЬ, ЧТОБЫ БЫТЬ САМОЙ СМЕЛОЙ.</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="radio" name="q2" className="w-4 h-4" />
                        <span className="text-sm font-medium text-gray-800">C) СПОСОБНОСТЬ ГОВОРИТЬ С ДРЕВНИМИ КНИГАМИ.</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sections */}
          <div className="w-80">
            {/* Chick Decoration */}
            <div className="rounded-2xl p-0 mb-6 relative" style={{ backgroundColor: '#FFDAEC' }}>
              <div className="flex justify-center">
                <img 
                  src="/mal.png" 
                  className="w-30 h-30 object-contain"
                  alt="Chick"
                />
              </div>
            </div>

            {/* Sections List */}
            <div className="rounded-2xl p-6 space-y-3" style={{ backgroundColor: '#FFDAEC' }}>
              {sections.map((section, index) => (
                <Link 
                  key={index}
                  to={section.path}
                  className="block px-4 py-3 rounded-lg font-bold text-sm text-gray-900 border-b-2 border-black hover:bg-opacity-80 transition"
                  style={{ backgroundColor: '#FFDAEC' }}
                >
                  {section.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}