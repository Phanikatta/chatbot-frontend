import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useTheme } from './hooks/useTheme'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Chat from './pages/Chat'

export default function App() {
  useTheme() // Initialize theme on app load

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
          },
          success: { iconTheme: { primary: '#e50914', secondary: 'white' } }
        }}
      />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}