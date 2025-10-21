import { api } from "./api"

export interface User {
  id: number
  username: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserDto {
  username: string
  email: string
  password: string
}

// User CRUD operations
export async function createUser(data: CreateUserDto): Promise<User> {
  const { data: response } = await api.post("/users", data)
  return response
}

export async function getUsers(): Promise<User[]> {
  const { data } = await api.get("/users")
  return data
}

export async function getUser(id: number): Promise<User> {
  const { data } = await api.get(`/users/${id}`)
  return data
}

export async function getUserByEmail(email: string): Promise<User> {
  const { data } = await api.get(`/users/email/${email}`)
  return data
}
