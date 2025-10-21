import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { createChatRoom, getChatRooms, getChatRoom, createMessage, getRoomMessages, ChatRoom, ChatMessage } from "../services/chat"
import { getUsers, getUser, User } from "../services/users"
import { Plus, Trash2, Edit, Eye, Loader2, Users, MessageSquare } from "lucide-react"

export default function CRUDDemo() {
  const { user, logout } = useAuth()
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newRoomName, setNewRoomName] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null)

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [roomsData, usersData] = await Promise.all([
        getChatRooms(),
        getUsers()
      ])
      setChatRooms(roomsData)
      setUsers(usersData)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoomName.trim()) return

    setLoading(true)
    setError(null)
    try {
      const newRoom = await createChatRoom({ name: newRoomName })
      setChatRooms(prev => [...prev, newRoom])
      setNewRoomName("")
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to create room")
    } finally {
      setLoading(false)
    }
  }

  const handleLoadRoomMessages = async (roomId: number) => {
    setLoading(true)
    setError(null)
    try {
      const roomMessages = await getRoomMessages(roomId)
      setMessages(roomMessages)
      setSelectedRoom(roomId)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to load messages")
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedRoom) return

    setLoading(true)
    setError(null)
    try {
      const newMsg = await createMessage({ 
        content: newMessage, 
        roomId: selectedRoom 
      })
      setMessages(prev => [...prev, newMsg])
      setNewMessage("")
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to send message")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#E6F4FF] to-[#DCEBFF]">
      <header className="sticky top-0 z-10 glass backdrop-blur-lg p-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <span className="font-semibold text-slate-800">CRUD Demo</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-600">Welcome, {user?.name}</span>
          <button onClick={logout} className="glass-dark px-3 py-2 rounded-lg inline-flex items-center gap-2">
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Rooms Section */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-800">Chat Rooms</h2>
            </div>

            <form onSubmit={handleCreateRoom} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Room name"
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Create
                </button>
              </div>
            </form>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {chatRooms.map((room) => (
                <div
                  key={room.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedRoom === room.id 
                      ? 'bg-blue-100 border-blue-300' 
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                  onClick={() => handleLoadRoomMessages(room.id)}
                >
                  <div className="font-medium text-slate-800">#{room.name}</div>
                  <div className="text-sm text-slate-500">
                    Created: {new Date(room.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Messages Section */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-slate-800">Messages</h2>
            </div>

            {selectedRoom ? (
              <>
                <div className="mb-4 h-48 overflow-y-auto border border-slate-200 rounded-lg p-3 bg-slate-50">
                  {messages.map((msg) => (
                    <div key={msg.id} className="mb-2 p-2 bg-white rounded border">
                      <div className="text-sm text-slate-600">{msg.content}</div>
                      <div className="text-xs text-slate-400">
                        {new Date(msg.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage}>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-slate-500 text-center py-8">
                Select a room to view messages
              </div>
            )}
          </div>

          {/* Users Section */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-slate-800">Users</h2>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {users.map((user) => (
                <div key={user.id} className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="font-medium text-slate-800">{user.username}</div>
                  <div className="text-sm text-slate-500">{user.email}</div>
                  <div className="text-xs text-slate-400">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* API Status */}
        <div className="mt-6 glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">API Connection Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-100 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{chatRooms.length}</div>
              <div className="text-sm text-green-700">Chat Rooms</div>
            </div>
            <div className="text-center p-4 bg-blue-100 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{messages.length}</div>
              <div className="text-sm text-blue-700">Messages</div>
            </div>
            <div className="text-center p-4 bg-purple-100 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{users.length}</div>
              <div className="text-sm text-purple-700">Users</div>
            </div>
            <div className="text-center p-4 bg-orange-100 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">✓</div>
              <div className="text-sm text-orange-700">Connected</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
