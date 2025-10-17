import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { useSocket } from "./SocketContext"

export type Channel = {
  id: string
  name: string
  description?: string | null
  isPrivate?: boolean
}

export type ChatMessage = {
  id: string
  channelId: string
  content: string
  userId: string
  createdAt: string
}

type ChatContextValue = {
  channels: Channel[]
  activeChannelId: string | null
  messagesByChannel: Record<string, ChatMessage[]>
  setActiveChannel: (id: string) => void
  sendMessage: (content: string) => void
  createChannel: (payload: { name: string; description?: string; isPrivate?: boolean }) => Promise<void>
  updateChannel: (id: string, payload: Partial<Channel>) => Promise<void>
  deleteChannel: (id: string) => Promise<void>
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { socket } = useSocket()
  const [channels, setChannels] = useState<Channel[]>([])
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null)
  const [messagesByChannel, setMessagesByChannel] = useState<Record<string, ChatMessage[]>>({})

  useEffect(() => {
    if (!socket) return
    const onMessage = (msg: ChatMessage) => {
      setMessagesByChannel(prev => ({
        ...prev,
        [msg.channelId]: [...(prev[msg.channelId] ?? []), msg],
      }))
    }
    socket.on("message", onMessage)
    return () => {
      socket.off("message", onMessage)
    }
  }, [socket])

  const setActiveChannel = useCallback((id: string) => setActiveChannelId(id), [])

  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !activeChannelId || !content.trim()) return
      socket.emit("message", activeChannelId, content)
    },
    [socket, activeChannelId]
  )

  const createChannel = useCallback(async (_payload: { name: string; description?: string; isPrivate?: boolean }) => {
    // Wire to backend via REST later
  }, [])

  const updateChannel = useCallback(async (_id: string, _payload: Partial<Channel>) => {
    // Wire to backend via REST later
  }, [])

  const deleteChannel = useCallback(async (_id: string) => {
    // Wire to backend via REST later
  }, [])

  const value: ChatContextValue = useMemo(
    () => ({ channels, activeChannelId, messagesByChannel, setActiveChannel, sendMessage, createChannel, updateChannel, deleteChannel }),
    [channels, activeChannelId, messagesByChannel, setActiveChannel, sendMessage, createChannel, updateChannel, deleteChannel]
  )

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error("useChat must be used within ChatProvider")
  return ctx
}


