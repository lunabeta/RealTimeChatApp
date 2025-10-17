import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Loader2 } from "lucide-react"

export default function OAuthCallback() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // After backend sets httpOnly cookies, hit refresh and me via AuthProvider bootstrap on next mount.
    // We just push to home; AuthProvider will pick up the session. If it fails, send back to login.
    const timer = setTimeout(() => {
      navigate("/", { replace: true })
    }, 500)
    return () => clearTimeout(timer)
  }, [navigate, logout])

  return (
    <div className="min-h-screen aurora-bg flex items-center justify-center p-6">
      <div className="glass rounded-2xl p-6 flex items-center gap-3 text-white/90">
        <Loader2 className="w-5 h-5 animate-spin" />
        Completing sign-in…
      </div>
    </div>
  )
}


