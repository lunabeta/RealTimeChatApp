import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Mail, Lock, User, UserPlus, Loader2, Chrome, Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const { register, googleLoginUrl } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setSubmitting(false)
      return
    }
    
    try {
      await register(name, email, password)
      navigate("/", { replace: true })
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Registration failed")
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
        
        <h2>Create Account 🚀</h2>
        <p className="auth-subtitle">Join RealTimeChat and start connecting</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="input-group">
            <User className="input-icon" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="auth-input"
              required
            />
          </div>
          
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

          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="auth-input"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="password-toggle"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="auth-button primary"
          >
            {submitting ? (
              <span className="button-content">
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating account...
              </span>
            ) : (
              <span className="button-content">
                <UserPlus className="w-4 h-4" />
                Create Account
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
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  )
}


