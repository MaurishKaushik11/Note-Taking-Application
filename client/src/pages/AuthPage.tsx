import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import EmailOtpForm from '../components/EmailOtpForm'
import GoogleSignInButton from '../components/GoogleSignInButton'
import { useAuth } from '../state/AuthContext'

export default function AuthPage() {
  const { token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (token) navigate('/notes', { replace: true })
  }, [token, navigate])

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:flex items-center justify-center p-10 bg-gray-900">
        <div className="w-full max-w-2xl aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          <img
            src={"/assets/Revised%20Assessment.png"}
            alt="Design visual"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Sign up</h1>
            <p className="text-sm text-gray-500">Secure login with Email OTP or Google</p>
          </div>
          <EmailOtpForm />
          <div className="text-center text-sm text-gray-500">or</div>
          <div className="flex items-center justify-center">
            <GoogleSignInButton />
          </div>
        </div>
      </div>
    </div>
  )
}
