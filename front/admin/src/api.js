import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const userApi = {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    ban: (id) => api.post(`/users/${id}/ban`),
    unban: (id) => api.post(`/users/${id}/unban`),
    delete: (id) => api.delete(`/users/${id}`),
    setXp: (id, xp) => api.post(`/users/${id}/xp/set`, { xp }),
    setGems: (id, amount) => api.post(`/users/${id}/gems/set`, { amount }),
    updateProfile: (id, data) => api.put(`/users/${id}`, data),
};

export const courseApi = {
    getAll: (source) => api.get('/courses', { params: { source } }),
    getById: (id) => api.get(`/courses/${id}`),
    update: (id, data) => api.put(`/courses/${id}`, data),
    delete: (id) => api.delete(`/courses/${id}`),
    reseed: (force = false) => api.post(`/courses/reseed?force=${force}`),

    // Levels
    addLevel: (courseId, data) => api.post(`/courses/${courseId}/levels`, data),
    updateLevel: (levelId, data) => api.put(`/courses/levels/${levelId}`, data),
    deleteLevel: (levelId) => api.delete(`/courses/levels/${levelId}`),

    // Lessons
    getLessonById: (lessonId) => api.get(`/courses/lessons/${lessonId}`), // Wait, does the backend have this?
    addLesson: (levelId, data) => api.post(`/courses/levels/${levelId}/lessons`, data),
    updateLesson: (lessonId, data) => api.put(`/courses/lessons/${lessonId}`, data),
    deleteLesson: (lessonId) => api.delete(`/courses/lessons/${lessonId}`),

    // Lesson Content & Exercises
    saveLessonContent: (lessonId, data) => api.post(`/courses/lessons/${lessonId}/content`, data),
    addExercise: (lessonId, data) => api.post(`/courses/lessons/${lessonId}/exercises`, data),
    updateExercise: (exerciseId, data) => api.put(`/courses/exercises/${exerciseId}`, data),
    deleteExercise: (exerciseId) => api.delete(`/courses/exercises/${exerciseId}`),
};

export default api;
