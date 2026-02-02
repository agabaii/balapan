// src/services/api.js
const API_BASE_URL = 'http://localhost:8081/api';

class ApiService {
  constructor() {
    this.currentUser = null;
    this.baseURL = API_BASE_URL;
  }

  // ==================== AUTH ====================

  async register(username, email, password, nativeLanguage = 'ru') {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, nativeLanguage })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('username', username);
        this.currentUser = { id: data.userId, username };
        return { success: true, userId: data.userId };
      }

      return { success: false, message: data.message };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Ошибка соединения с сервером' };
    }
  }

  async verify(email, code) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Verify error:', error);
      return { success: false, message: 'Ошибка сети' };
    }
  }

  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success && data.user) {
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('username', data.user.username);
        this.currentUser = data.user;
        return { success: true, user: data.user };
      }

      return { success: false, message: data.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Ошибка соединения с сервером' };
    }
  }

  async forgotPassword(email) {
    try {
      const response = await fetch(`${this.baseURL}/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, message: 'Ошибка сети' };
    }
  }

  async resetPassword(email, code, newPassword) {
    try {
      const response = await fetch(`${this.baseURL}/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, message: 'Ошибка сети' };
    }
  }

  logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('selectedCourseId');
    localStorage.removeItem('currentLessonId');
    localStorage.removeItem('currentVideoId');
    this.currentUser = null;
  }

  isLoggedIn() {
    return localStorage.getItem('userId') !== null;
  }

  getCurrentUserId() {
    return localStorage.getItem('userId');
  }

  // ==================== USER PROFILE ====================

  async getUserProfile() {
    const userId = this.getCurrentUserId();

    if (!userId) {
      return { success: false, message: 'Не авторизован' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`);
      const data = await response.json();

      if (response.ok) {
        return { success: true, user: data };
      }

      return { success: false, message: 'Пользователь не найден' };
    } catch (error) {
      console.error('Get user error:', error);
      return { success: false, message: 'Ошибка загрузки профиля' };
    }
  }

  async addXp(xpAmount) {
    const userId = this.getCurrentUserId();

    if (!userId) {
      return { success: false, message: 'Не авторизован' };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/xp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xp: xpAmount })
      });

      const data = await response.json();
      return { success: true, user: data };
    } catch (error) {
      console.error('Add XP error:', error);
      return { success: false, message: 'Ошибка добавления XP' };
    }
  }

  // ==================== COURSES ====================

  async getCourses() {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`);
      const data = await response.json();
      return { success: true, courses: data };
    } catch (error) {
      console.error('Get courses error:', error);
      return { success: false, courses: [] };
    }
  }

  async getCourseById(courseId) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
      const data = await response.json();
      return { success: true, course: data };
    } catch (error) {
      console.error('Get course error:', error);
      return { success: false, course: null };
    }
  }

  // ==================== PROGRESS ====================

  async completeLesson(lessonId, correctAnswers, totalQuestions, xpEarned) {
    const userId = this.getCurrentUserId();

    if (!userId) {
      console.error('❌ User not logged in');
      return { success: false, message: 'Пользователь не авторизован' };
    }

    try {
      const requestBody = {
        userId: parseInt(userId),
        lessonId: parseInt(lessonId),
        correctAnswers: parseInt(correctAnswers),
        totalQuestions: parseInt(totalQuestions),
        xpEarned: parseInt(xpEarned)
      };

      console.log('📤 Отправка запроса:', requestBody);

      const response = await fetch(`${API_BASE_URL}/progress/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Урок успешно завершен!');
        return {
          success: true,
          progress: data.progress,
          xpEarned: data.xpEarned
        };
      }

      console.error('❌ Ошибка от сервера:', data.message);
      return {
        success: false,
        message: data.message || 'Неизвестная ошибка от сервера'
      };
    } catch (error) {
      console.error('❌ Ошибка сети:', error);
      return {
        success: false,
        message: 'Не удалось соединиться с сервером. Проверьте, что бэкенд запущен на http://localhost:8081'
      };
    }
  }

  async getUserProgress() {
    const userId = this.getCurrentUserId();

    if (!userId) {
      return { success: false, progress: [] };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/progress/user/${userId}`);
      const data = await response.json();
      return { success: true, progress: data };
    } catch (error) {
      console.error('Get progress error:', error);
      return { success: false, progress: [] };
    }
  }

  async checkLessonCompleted(lessonId) {
    const userId = this.getCurrentUserId();

    if (!userId) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/progress/check/${userId}/${lessonId}`);
      const data = await response.json();
      return data.completed || false;
    } catch (error) {
      console.error('Check lesson error:', error);
      return false;
    }
  }

  // ==================== VIDEO LESSONS ====================

  async getVideoLessons(difficulty = 'all') {
    try {
      const endpoint = difficulty === 'all'
        ? `${this.baseURL}/videos`
        : `${this.baseURL}/videos/difficulty/${difficulty}`;

      const response = await fetch(endpoint);
      const data = await response.json();

      return {
        success: true,
        videos: data
      };
    } catch (error) {
      console.error('Error loading videos:', error);
      return {
        success: false,
        videos: []
      };
    }
  }

  async getVideoById(videoId) {
    try {
      const response = await fetch(`${this.baseURL}/videos/${videoId}`);
      const data = await response.json();

      return {
        success: true,
        video: data
      };
    } catch (error) {
      console.error('Error loading video:', error);
      return {
        success: false,
        video: null
      };
    }
  }

  async startVideo(userId, videoId) {
    try {
      const response = await fetch(`${this.baseURL}/videos/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, videoId })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error starting video:', error);
      return { success: false };
    }
  }

  async completeVideo(userId, videoId, watchTimeSeconds) {
    try {
      const response = await fetch(`${this.baseURL}/videos/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, videoId, watchTimeSeconds })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error completing video:', error);
      return { success: false };
    }
  }

  async getUserVideoStats(userId) {
    try {
      const response = await fetch(`${this.baseURL}/videos/stats/${userId}`);
      const data = await response.json();

      return {
        success: true,
        stats: data
      };
    } catch (error) {
      console.error('Error loading video stats:', error);
      return {
        success: false,
        stats: { totalVideos: 0, completed: 0, inProgress: 0, progress: [] }
      };
    }
  }

  // ==================== STORIES (PODCASTS) ====================

  async getStories(difficulty = 'all') {
    try {
      const endpoint = difficulty === 'all'
        ? `${this.baseURL}/stories`
        : `${this.baseURL}/stories/difficulty/${difficulty}`;

      const response = await fetch(endpoint);
      const data = await response.json();

      return {
        success: true,
        stories: data
      };
    } catch (error) {
      console.error('Error loading stories:', error);
      return {
        success: false,
        stories: []
      };
    }
  }

  async getStoryById(storyId) {
    try {
      const response = await fetch(`${this.baseURL}/stories/${storyId}`);
      const data = await response.json();

      return {
        success: true,
        story: data
      };
    } catch (error) {
      console.error('Error loading story:', error);
      return {
        success: false,
        story: null
      };
    }
  }

  async startStory(userId, storyId) {
    try {
      const response = await fetch(`${this.baseURL}/stories/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, storyId })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error starting story:', error);
      return { success: false };
    }
  }

  async completeStory(userId, storyId, correctAnswers, totalQuestions) {
    try {
      const response = await fetch(`${this.baseURL}/stories/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, storyId, correctAnswers, totalQuestions })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error completing story:', error);
      return { success: false };
    }
  }

  async getUserStoryStats(userId) {
    try {
      const response = await fetch(`${this.baseURL}/stories/stats/${userId}`);
      const data = await response.json();

      return {
        success: true,
        stats: data
      };
    } catch (error) {
      console.error('Error loading story stats:', error);
      return {
        success: false,
        stats: { totalStories: 0, completed: 0, inProgress: 0, progress: [] }
      };
    }
  }

  // ==================== STREAK STATS ====================

  async getStreakStats(userId) {
    try {
      const response = await fetch(`${this.baseURL}/progress/streak/${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get streak stats error:', error);
      return {
        currentStreak: 0,
        longestStreak: 0,
        activeDaysThisMonth: 0,
        xpThisWeek: 0,
        xpThisMonth: 0,
        streakAtRisk: false,
        last30DaysActivity: []
      };
    }
  }




  // ==================== BIRD STAGE ====================

  calculateBirdStage(xp) {
    if (xp >= 1125) return 3; // Птенец-выпускник
    if (xp >= 750) return 2;  // Маленький птенец
    if (xp >= 375) return 1;  // Вылупление
    return 0; // В яйце
  }
}

// Создаем единственный экземпляр
const apiService = new ApiService();

export default apiService;