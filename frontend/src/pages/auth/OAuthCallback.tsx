import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Loader2 } from "lucide-react"

export default function OAuthCallback() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Check if we have token and user data in URL params (from backend redirect)
        const token = searchParams.get('token')
        const userData = searchParams.get('user')
        
        if (token && userData) {
          // Store the token and user data
          localStorage.setItem('access_token', token)
          localStorage.setItem('user_data', userData)
          
          // Update the auth context
          setUser(JSON.parse(userData))
          
          // Redirect to home
          navigate("/", { replace: true })
        } else {
          // If no token in URL, redirect to Google OAuth
          window.location.href = "http://localhost:3000/auth/google"
        }
      } catch (err) {
        console.error('OAuth callback error:', err)
        setError('Authentication failed. Please try again.')
        setTimeout(() => {
          navigate("/login", { replace: true })
        }, 2000)
      }
    }

    handleOAuthCallback()
  }, [navigate, searchParams, setUser])

  if (error) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="logo">
            <svg width="24" height="24" fill="#2B6CB0" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2a10 10 0 0 0-9 14l-1 4 4-1a10 10 0 1 0 6-17z"/>
            </svg>
            <span>RealTimeChat</span>
          </div>
          <div className="error-message">
            {error}
          </div>
          <p className="auth-footer">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo">
          <svg width="24" height="24" fill="#2B6CB0" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2a10 10 0 0 0-9 14l-1 4 4-1a10 10 0 1 0 6-17z"/>
          </svg>
          <span>RealTimeChat</span>
        </div>
        <h2>Completing Sign-in 🔐</h2>
        <div className="flex items-center justify-center gap-3 text-slate-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Please wait...</span>
        </div>
      </div>
    </div>
  )
}


