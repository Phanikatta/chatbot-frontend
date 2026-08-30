import { create } from 'zustand'

export const useChatStore = create((set, get) => ({
  sessions: [],
  activeSession: null,
  messages: [],
  isTyping: false,

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

  updateSessionTitle: (sessionId, title) => set((state) => ({
    sessions: state.sessions.map(s =>
      s.id === sessionId ? { ...s, title } : s
    ),
    activeSession: state.activeSession?.id === sessionId
      ? { ...state.activeSession, title }
      : state.activeSession
  })),

  // ← NEW: remove session from list
  removeSession: (sessionId) => set((state) => ({
    sessions: state.sessions.filter(s => s.id !== sessionId),
    activeSession: state.activeSession?.id === sessionId
      ? null
      : state.activeSession,
    messages: state.activeSession?.id === sessionId
      ? []
      : state.messages
  })),

  // ← NEW: remove single message
  removeMessage: (messageId) => set((state) => ({
    messages: state.messages.filter(m => m.id !== messageId)
  }))
}))