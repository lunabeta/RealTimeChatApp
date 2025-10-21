import { api } from "./api"
import type { AuthUser } from "../contexts/AuthContext"

export async function loginRequest(email: string, password: string): Promise<{ access_token: string; user: AuthUser }> {
  const { data } = await api.post("/auth/login", { email, password })
  
  // Store JWT token in localStorage
  if (data.access_token) {
    localStorage.setItem('access_token', data.access_token)
  }
  
  return data
}

export async function registerRequest(name: string, email: string, password: string): Promise<{ access_token: string; user: AuthUser }> {
  const { data } = await api.post("/auth/register", { username: name, email, password })
  
  // Store JWT token in localStorage
  if (data.access_token) {
    localStorage.setItem('access_token', data.access_token)
  }
  
  return data
}

export async function refreshRequest(): Promise<void> {
  // For JWT, we don't need refresh - just check if token exists
  const token = localStorage.getItem('access_token')
  if (!token) {
    throw new Error('No token found')
  }
}

export async function logoutRequest(): Promise<void> {
  // Clear JWT token from localStorage
  localStorage.removeItem('access_token')
}

export async function getMe(): Promise<AuthUser> {
  const token = localStorage.getItem('access_token')
  if (!token) {
    throw new Error('No token found')
  }
  
  // For now, we'll use the user data from login/register
  // In a real app, you'd have a /users/me endpoint
  const userData = localStorage.getItem('user_data')
  if (userData) {
    return JSON.parse(userData)
  }
  
  throw new Error('No user data found')
}


