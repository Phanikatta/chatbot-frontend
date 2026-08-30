import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useChatStore } from '../store/chatStore'
import { getSessions } from '../services/api'
import { useTheme } from '../hooks/useTheme'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'

export default function Chat() {
  const { token } = useAuthStore()
  const { setSessions } = useChatStore()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    if (!token) { navigate('/'); return }
    getSessions()
      .then(res => setSessions(res.data.sessions || []))
      .catch(() => setSessions([]))
  }, [token])

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <ChatWindow />
      </div>
    </div>
  )
}