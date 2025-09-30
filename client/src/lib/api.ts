import axios from 'axios'
import { useMemo } from 'react'
import { useAuth } from '../state/AuthContext'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const api = axios.create({ baseURL, withCredentials: false })

export function useAuthedApi() {
  const { token } = useAuth()
  return useMemo(() => {
    const instance = axios.create({ baseURL })
    instance.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`
      return config
    })
    return instance
  }, [token])
}
