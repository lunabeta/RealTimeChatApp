import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Mail, Lock, LogIn, Loader2, Chrome, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const { login, googleLoginUrl } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation() as any

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await login(email, password)
      const to = location.state?.from?.pathname ?? "/"
      navigate(to, { replace: true })
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Login failed")
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = googleLoginUrl
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
        
        <h2>Welcome Back 👋</h2>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="input-group">
            <Mail className="input-icon" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="auth-input"
              required
            />
          </div>
          
          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="auth-input"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={remember} 
                onChange={(e) => setRemember(e.target.checked)} 
                className="checkbox"
              />
              <span>Remember me</span>
            </label>
            <Link to="#" className="forgot-link">Forgot password?</Link>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="auth-button primary"
          >
            {submitting ? (
              <span className="button-content">
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              <span className="button-content">
                <LogIn className="w-4 h-4" />
                Sign In
              </span>
            )}
          </button>
        </form>

        <div className="divider">
          <div className="divider-line"></div>
          <span className="divider-text">or</span>
          <div className="divider-line"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="auth-button google"
        >
          <Chrome className="w-5 h-5" />
          Continue with Google
        </button>

        <p className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
        </p>
      </div>
    </div>
  )
}


