import { create } from 'zustand'

const DEFAULT_PROMPT = 'You are a helpful, friendly, and knowledgeable AI assistant. Answer questions clearly and concisely.'

export const useChatStore = create((set) => ({
  sessions: [],
  activeSession: null,
  messages: [],
  isTyping: false,
  systemPrompt: DEFAULT_PROMPT,

  setSessions: (sessions) => set({ sessions }),

  addSession: (session) => set((state) => ({
    sessions: [session, ...state.sessions],
    activeSession: session,
    messages: []
  })),

  setActiveSession: (session) => set({
    activeSession: session,
    messages: []
  }),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),

  setTyping: (isTyping) => set({ isTyping }),

  setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),

  updateSessionTitle: (sessionId, title) => set((state) => ({
    sessions: state.sessions.map(s =>
      s.id === sessionId ? { ...s, title } : s
    ),
    activeSession: state.activeSession?.id === sessionId
      ? { ...state.activeSession, title }
      : state.activeSession
  })),

  removeSession: (sessionId) => set((state) => ({
    sessions: state.sessions.filter(s => s.id !== sessionId),
    activeSession: state.activeSession?.id === sessionId
      ? null : state.activeSession,
    messages: state.activeSession?.id === sessionId
      ? [] : state.messages
  })),

  removeMessage: (messageId) => set((state) => ({
    messages: state.messages.filter(m => m.id !== messageId)
  }))
}))