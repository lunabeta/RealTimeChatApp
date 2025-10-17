import { useMemo, useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useChat } from "../../contexts/ChatContext"
import { useSocket } from "../../contexts/SocketContext"
import { LogOut, MessageSquare, Send, Users } from "lucide-react"

export default function ChatPage() {
  const { user, logout } = useAuth()
  const { channels, activeChannelId, setActiveChannel, messagesByChannel, sendMessage } = useChat()
  const [text, setText] = useState("")
  const activeMessages = useMemo(() => (activeChannelId ? messagesByChannel[activeChannelId] ?? [] : []), [messagesByChannel, activeChannelId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#E6F4FF] to-[#DCEBFF]">
      <header className="sticky top-0 z-10 glass backdrop-blur-lg p-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <span className="font-semibold text-slate-800">Realtime Chat</span>
        </div>
        <div className="flex items-center gap-3">
          <img src={user?.avatarUrl ?? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name ?? "U")}`} className="w-8 h-8 rounded-full" />
          <button onClick={() => logout()} className="glass-dark px-3 py-2 rounded-lg inline-flex items-center gap-2">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <div className="grid md:grid-cols-[320px_1fr] gap-4 p-4 max-w-6xl mx-auto">
        <aside className="glass rounded-2xl p-4 h-[calc(100vh-120px)] overflow-y-auto">
          <div className="flex items-center gap-2 mb-3 text-slate-700">
            <Users className="w-4 h-4" /> Channels
          </div>
          <div className="space-y-2">
            {(channels.length ? channels : [{ id: "general", name: "general" }]).map((ch) => (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className={`w-full text-left px-3 py-2 rounded-lg ${activeChannelId === ch.id ? "bg-blue-600 text-white" : "glass-dark"}`}
              >
                #{ch.name}
              </button>
            ))}
          </div>
        </aside>

        <main className="glass rounded-2xl p-4 h-[calc(100vh-120px)] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {activeMessages.map((m) => (
              <div key={m.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100" />
                <div>
                  <div className="text-sm text-slate-500">{new Date(m.createdAt).toLocaleTimeString()}</div>
                  <div className="px-3 py-2 rounded-xl bg-white/80 border border-white/60 shadow-sm">{m.content}</div>
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!text.trim()) return
              sendMessage(text)
              setText("")
            }}
            className="mt-3 flex gap-2"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Message"
              className="flex-1 px-4 py-3 rounded-xl bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl">
              <Send className="w-4 h-4" /> Send
            </button>
          </form>
        </main>
      </div>
    </div>
  )
}


