import { useState, useEffect, useRef } from "react"
import { initSocket, disconnectSocket, getSocket } from "../services/socket"
import { api } from "../services/api"

export default function Chat({ user, onLogout }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [onlineUsers, setOnlineUsers] = useState([])
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(1)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    const socket = initSocket(token)

    // Load initial data
    loadRooms()
    loadMessages(selectedRoom)
    loadUsers()

    socket.on("message:new", (message) => {
      setMessages((prev) => [...prev, message])
    })

    socket.on("user:joined", (userData) => {
      setOnlineUsers(prev => [...prev, userData])
    })

    socket.on("user:left", (userId) => {
      setOnlineUsers(prev => prev.filter(u => u.id !== userId))
    })

    return () => {
      disconnectSocket()
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const loadRooms = async () => {
    try {
      const res = await api.get("/chat/rooms")
      setRooms(res.data)
    } catch (error) {
      console.error("Failed to load rooms:", error)
    }
  }

  const loadMessages = async (roomId) => {
    try {
      const res = await api.get(`/chat/messages/${roomId}`)
      setMessages(res.data)
    } catch (error) {
      console.error("Failed to load messages:", error)
    }
  }

  const loadUsers = async () => {
    try {
      const res = await api.get("/users")
      setOnlineUsers(res.data)
    } catch (error) {
      console.error("Failed to load users:", error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const socket = getSocket()
      if (socket) {
        socket.emit("sendMessage", {
          content: newMessage,
          roomId: selectedRoom,
          userId: user.id
        })
      }
      
      await api.post("/chat/messages", {
        content: newMessage,
        chatRoomId: selectedRoom,
        userId: user.id
      })
      setNewMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleRoomChange = (roomId) => {
    setSelectedRoom(roomId)
    loadMessages(roomId)
    
    const socket = getSocket()
    if (socket) {
      socket.emit("joinRoom", roomId)
    }
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Sidebar */}
      <div className="w-80 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700/30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-light text-white">Messenger</h1>
              <p className="text-slate-400 text-sm mt-1">@{user.username}</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Rooms */}
        <div className="p-4 border-b border-slate-700/30">
          <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Rooms</h3>
          <div className="space-y-1">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => handleRoomChange(room.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                  selectedRoom === room.id
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{room.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Online Users */}
        <div className="flex-1 p-4 overflow-hidden">
          <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">
            Online Users ({onlineUsers.length})
          </h3>
          <div className="space-y-2 overflow-y-auto max-h-96">
            {onlineUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-700/30 transition-colors duration-200"
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {u.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">
                    {u.username}
                    {u.id === user.id && (
                      <span className="text-slate-400 text-xs ml-1">(You)</span>
                    )}
                  </p>
                  <p className="text-slate-400 text-xs truncate">{u.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Room Header */}
        <div className="bg-slate-800/30 backdrop-blur-xl border-b border-slate-700/50 p-6">
          <h2 className="text-xl font-light text-white">
            {rooms.find(r => r.id === selectedRoom)?.name || "Chat Room"}
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-slate-400 mt-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.user.id === user.id ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                  message.user.id === user.id 
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white" 
                    : "bg-slate-700/50 text-white border border-slate-600/50"
                } rounded-2xl p-4 shadow-lg`}>
                  {message.user.id !== user.id && (
                    <p className="text-xs text-slate-300 mb-1">{message.user.username}</p>
                  )}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2 text-right">
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-slate-800/30 backdrop-blur-xl border-t border-slate-700/50 p-6">
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}