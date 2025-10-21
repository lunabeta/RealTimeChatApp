import { useEffect, useState } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { LucideLoader2 } from "lucide-react"

import { AuthProvider } from "./contexts/AuthContext"
import { SocketProvider } from "./contexts/SocketContext"
import { ChatProvider } from "./contexts/ChatContext"

import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import OAuthCallback from "./pages/auth/OAuthCallback"
import ChatPage from "./pages/chat/ChatPage"
import CRUDDemo from "./pages/CRUDDemo"
import AuthDemo from "./pages/AuthDemo"
import ProtectedRoute from "./components/layout/ProtectedRoute"

function App() {
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    setBooting(false)
  }, [])

  if (booting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="glass p-6 rounded-2xl shadow-xl flex items-center gap-3">
          <LucideLoader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="text-slate-700">Loading…</span>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <SocketProvider>
        <ChatProvider>
          <Routes>
            <Route path="/demo" element={<AuthDemo />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth/google/callback" element={<OAuthCallback />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crud"
              element={
                <ProtectedRoute>
                  <CRUDDemo />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ChatProvider>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App


