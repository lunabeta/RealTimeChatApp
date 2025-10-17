import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Mail, Lock, LogIn, Loader2, Chrome } from "lucide-react"

export default function LoginPage() {
  const { login, googleLoginUrl } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
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

  return (
    <div className="min-h-screen aurora-bg flex items-center justify-center p-4">
      <div className="glass rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] w-full max-w-lg p-10 border-white/30">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white/90 tracking-tight">Login Form</h1>
          <div className="mt-2 w-20 h-[3px] bg-white/70 rounded"></div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="text-rose-300 bg-rose-900/30 border border-rose-400/30 rounded px-3 py-2 text-sm">{error}</div>}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Username"
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white/20 text-white placeholder-white/70 border border-white/30 outline-none focus:ring-2 focus:ring-white/70"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white/20 text-white placeholder-white/70 border border-white/30 outline-none focus:ring-2 focus:ring-white/70"
              required
            />
          </div>
          <div className="flex items-center justify-between text-white/90 text-sm">
            <label className="inline-flex items-center gap-2 select-none">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded bg-white/20 border-white/40" />
              Remember Me
            </label>
            <Link to="#" className="hover:underline">Forgot Password?</Link>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-40 mx-auto block text-center font-medium tracking-wide text-white py-3 rounded-full transition-all disabled:opacity-60"
            style={{ background: "linear-gradient(180deg, #6a0d37 0%, #5a0a2f 100%)", boxShadow: "0 10px 30px rgba(90,10,47,0.5)" }}
          >
            {submitting ? <span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading</span> : <span className="inline-flex items-center gap-2"><LogIn className="w-4 h-4" /> Login</span>}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px bg-white/30 flex-1" />
          <span className="text-white/70 text-xs">or</span>
          <div className="h-px bg-white/30 flex-1" />
        </div>

        <a
          href={googleLoginUrl}
          className="w-full inline-flex items-center justify-center gap-3 py-3 rounded-full text-white font-medium"
          style={{ background: "linear-gradient(180deg, #4285F4 0%, #357AE8 100%)", boxShadow: "0 10px 24px rgba(66,133,244,0.45)" }}
        >
          <Chrome className="w-5 h-5 text-white" /> Continue with Google
        </a>

        <p className="text-sm text-white/90 mt-6 text-center">
          Don’t have an account? <Link to="/register" className="underline">Sign Up</Link>
        </p>
      </div>
    </div>
  )
}


