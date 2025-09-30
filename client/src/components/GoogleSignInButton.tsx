import { GoogleLogin } from '@react-oauth/google'
import { api } from '../lib/api'
import { useAuth } from '../state/AuthContext'

export default function GoogleSignInButton() {
  const { setAuth } = useAuth()
  return (
    <GoogleLogin
      onSuccess={async (cred) => {
        try {
          const idToken = cred.credential
          if (!idToken) return
          const { data } = await api.post('/auth/google', { idToken })
          setAuth(data.token, data.user)
        } catch (e) {
          alert('Google login failed')
          console.error(e)
        }
      }}
      onError={() => {
        alert('Google login failed')
      }}
      theme="outline"
      shape="pill"
      useOneTap
    />
  )
}
