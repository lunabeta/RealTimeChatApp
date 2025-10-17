import axios from "axios"

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // send httpOnly cookies
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        await api.post("/auth/refresh")
        return api(original)
      } catch (_e) {
        // fallthrough
      }
    }
    return Promise.reject(error)
  }
)


