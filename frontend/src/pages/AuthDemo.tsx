import { Link } from "react-router-dom"
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react"

export default function AuthDemo() {
  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <div className="logo">
          <svg width="32" height="32" fill="#2B6CB0" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2a10 10 0 0 0-9 14l-1 4 4-1a10 10 0 1 0 6-17z"/>
          </svg>
          <span>RealTimeChat</span>
        </div>
        
        <h2>Welcome to RealTimeChat 🚀</h2>
        <p className="auth-subtitle">
          Experience modern, secure, and real-time communication with our beautifully designed chat platform.
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Shield className="w-6 h-6" />
            </div>
            <h3>Secure Authentication</h3>
            <p>JWT tokens and Google OAuth for maximum security</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Zap className="w-6 h-6" />
            </div>
            <h3>Real-time Messaging</h3>
            <p>Instant message delivery with WebSocket technology</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3>Modern UI/UX</h3>
            <p>Beautiful, responsive design with smooth animations</p>
          </div>
        </div>

        <div className="demo-actions">
          <Link to="/login" className="auth-button primary">
            <span className="button-content">
              Sign In
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
          
          <Link to="/register" className="auth-button google">
            <span className="button-content">
              Create Account
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        <div className="tech-stack">
          <h4>Built with modern technology:</h4>
          <div className="tech-badges">
            <span className="tech-badge">React</span>
            <span className="tech-badge">TypeScript</span>
            <span className="tech-badge">NestJS</span>
            <span className="tech-badge">WebSocket</span>
            <span className="tech-badge">JWT</span>
            <span className="tech-badge">OAuth</span>
          </div>
        </div>
      </div>
    </div>
  )
}

