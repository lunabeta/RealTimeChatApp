import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { io, Socket } from "socket.io-client"
import { useAuth } from "./AuthContext"

type ClientToServerEvents = {
  typing: (channelId: string, isTyping: boolean) => void
  message: (channelId: string, content: string) => void
}

type ServerToClientEvents = {
  message: (payload: { id: string; channelId: string; content: string; userId: string; createdAt: string }) => void
  typing: (payload: { channelId: string; userId: string; isTyping: boolean }) => void
  presence: (payload: { userId: string; online: boolean }) => void
}

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>

type SocketContextValue = {
  socket: AppSocket | null
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined)

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [socket, setSocket] = useState<AppSocket | null>(null)

  useEffect(() => {
    if (!user) {
      setSocket(null)
      return
    }
    const s: AppSocket = io("/", {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: true,
    })
    setSocket(s)
    return () => {
      s.close()
    }
  }, [user])

  const value = useMemo(() => ({ socket }), [socket])
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export function useSocket() {
  const ctx = useContext(SocketContext)
  if (!ctx) throw new Error("useSocket must be used within SocketProvider")
  return ctx
}
