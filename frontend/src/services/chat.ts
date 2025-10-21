import { api } from "./api"

export interface ChatRoom {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: number
  content: string
  roomId: number
  userId: number
  createdAt: string
  updatedAt: string
}

export interface CreateChatRoomDto {
  name: string
}

export interface CreateMessageDto {
  content: string
  roomId: number
}

// Chat Room CRUD operations
export async function createChatRoom(data: CreateChatRoomDto): Promise<ChatRoom> {
  const { data: response } = await api.post("/chat/rooms", data)
  return response
}

export async function getChatRooms(): Promise<ChatRoom[]> {
  const { data } = await api.get("/chat/rooms")
  return data
}

export async function getChatRoom(id: number): Promise<ChatRoom> {
  const { data } = await api.get(`/chat/rooms/${id}`)
  return data
}

// Message CRUD operations
export async function createMessage(data: CreateMessageDto): Promise<ChatMessage> {
  const { data: response } = await api.post("/chat/messages", data)
  return response
}

export async function getRoomMessages(roomId: number): Promise<ChatMessage[]> {
  const { data } = await api.get(`/chat/messages/${roomId}`)
  return data
}
