// front/src/StreakDisplay.js
import React, { useState, useEffect } from 'react';
import apiService from './services/api';

const StreakDisplay = ({ userId }) => {
  const [streakStats, setStreakStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    loadStreakStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadStreakStats = async () => {
    try {
      const stats = await apiService.getStreakStats(userId);
      console.log('Streak stats loaded:', stats);
      setStreakStats(stats);
    } catch (error) {
      console.error('Error loading streak stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCalendarData = () => {
    const today = new Date();
    const calendar = [];
    
    // Создаем массив последних 30 дней
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Ищем активность за этот день
      let activity = null;
      if (streakStats && streakStats.last30DaysActivity) {
        activity = streakStats.last30DaysActivity.find(
          a => a.activityDate === dateStr
        );
      }
      
      calendar.push({
        date: dateStr,
        active: !!activity,
        xp: activity ? activity.xpEarned : 0,
        lessons: activity ? activity.lessonsCompleted : 0
      });
    }
    
    console.log('Calendar data:', calendar);
    return calendar;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!streakStats) {
    return null;
  }

  const calendarData = getCalendarData();
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <div className="space-y-4">
      {/* Main Streak Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🔥</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  {streakStats.currentStreak}
                </h2>
                <span className="text-gray-600 text-sm">дней подряд</span>
              </div>
              {streakStats.streakAtRisk && (
                <p className="text-red-500 text-sm mt-1 font-medium">
                  ⚠️ Риск потери streak! Завершите урок сегодня
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="text-pink-400 hover:text-pink-500 text-sm font-medium"
          >
            {showCalendar ? 'Скрыть' : 'Показать'} календарь
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
            <div className="text-orange-600 text-sm font-medium mb-1">
              Лучший streak
            </div>
            <div className="text-2xl font-bold text-orange-700 flex items-center gap-2">
              <span>🏆</span>
              <span>{streakStats.longestStreak}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <div className="text-blue-600 text-sm font-medium mb-1">
              Активных дней в месяц
            </div>
            <div className="text-2xl font-bold text-blue-700 flex items-center gap-2">
              <span>📅</span>
              <span>{streakStats.activeDaysThisMonth}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
            <div className="text-purple-600 text-sm font-medium mb-1">
              XP за неделю
            </div>
            <div className="text-2xl font-bold text-purple-700 flex items-center gap-2">
              <span>⭐</span>
              <span>{streakStats.xpThisWeek}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <div className="text-green-600 text-sm font-medium mb-1">
              XP за месяц
            </div>
            <div className="text-2xl font-bold text-green-700 flex items-center gap-2">
              <span>💎</span>
              <span>{streakStats.xpThisMonth}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Calendar */}
      {showCalendar && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Календарь активности (последние 30 дней)
          </h3>
          
          {calendarData.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Нет данных для отображения</p>
          ) : (
            <>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarData.map((day, index) => {
                  const date = new Date(day.date);
                  const dayOfWeek = (date.getDay() + 6) % 7;
                  const isToday = day.date === new Date().toISOString().split('T')[0];
                  
                  return (
                    <div
                      key={day.date}
                      className="relative group"
                    >
                      {index < 7 && (
                        <div className="text-xs text-gray-500 text-center mb-1">
                          {weekDays[dayOfWeek]}
                        </div>
                      )}
                      
                      <div
                        className={`
                          aspect-square rounded-lg transition-all duration-200
                          ${isToday ? 'ring-2 ring-pink-400' : ''}
                          ${day.active 
                            ? 'bg-gradient-to-br from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 cursor-pointer' 
                            : 'bg-gray-100 hover:bg-gray-200'
                          }
                        `}
                      >
                        {day.active && (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {day.lessons}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10 pointer-events-none">
                        <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                          <div className="font-medium">{day.date}</div>
                          {day.active ? (
                            <>
                              <div>{day.lessons} уроков</div>
                              <div>{day.xp} XP</div>
                            </>
                          ) : (
                            <div>Нет активности</div>
                          )}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                            <div className="border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-4 mt-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 rounded"></div>
                  <span>Нет активности</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-pink-400 to-pink-500 rounded"></div>
                  <span>Есть активность</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-pink-400 to-pink-500 rounded ring-2 ring-pink-400"></div>
                  <span>Сегодня</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StreakDisplay;