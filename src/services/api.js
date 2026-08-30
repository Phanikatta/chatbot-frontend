import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://chatbot-backend-z12t.onrender.com'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Auto-attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth
export const register = (email, password) =>
  api.post('/auth/register', { email, password })

export const login = (email, password) =>
  api.post('/auth/login', { email, password })

// Sessions
export const createSession = () =>
  api.post('/chat/session')

export const updateSessionTitle = (sessionId, title) =>
  api.patch(`/chat/session/${sessionId}/title`, { title })

export const getSessions = () =>
  api.get('/history/sessions')

// Chat
export const sendMessage = (message, sessionId, systemPrompt) =>
  api.post('/chat/', {
    message,
    session_id: sessionId,
    system_prompt: systemPrompt || 'You are a helpful AI assistant.'
  })

// History
export const getHistory = (sessionId) =>
  api.get(`/history/${sessionId}`)

export default api

// Delete entire session
export const deleteSession = (sessionId) =>
  api.delete(`/chat/session/${sessionId}`)

// Delete single message
export const deleteMessage = (messageId) =>
  api.delete(`/chat/message/${messageId}`)