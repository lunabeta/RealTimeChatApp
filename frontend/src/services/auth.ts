import { api } from "./api"
import type { AuthUser } from "../contexts/AuthContext"

export async function loginRequest(email: string, password: string): Promise<void> {
  await api.post("/auth/login", { email, password })
}

export async function registerRequest(name: string, email: string, password: string): Promise<void> {
  await api.post("/auth/register", { name, email, password })
}

export async function refreshRequest(): Promise<void> {
  await api.post("/auth/refresh")
}

export async function logoutRequest(): Promise<void> {
  await api.post("/auth/logout")
}

export async function getMe(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>("/users/me")
  return data
}


