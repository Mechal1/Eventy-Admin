'use client'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function UnauthorizedPage() {
  const { logout } = useAuth()
  const router = useRouter()

  const handleBack = () => {
    logout()
    router.push('/login')
  }

  return (
    <div style={{
      backgroundColor: '#EFEDE6', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center"
        style={{ border: '1px solid #E4E2DA' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%', backgroundColor: '#FDEAE4',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', fontSize: 20, color: '#8C3018',
        }}>✕</div>
        <h1 className="text-lg font-semibold mb-2" style={{ color: '#1A1A18' }}>
          Accès refusé
        </h1>
        <p className="text-sm mb-6" style={{ color: '#7A7A74' }}>
          Ce compte n'a pas les droits administrateur nécessaires pour accéder à cette application.
        </p>
        <button
          onClick={handleBack}
          className="w-full font-medium rounded-lg py-2 text-sm"
          style={{ backgroundColor: '#0C6B54', color: '#fff' }}>
          Retour à la connexion
        </button>
      </div>
    </div>
  )
}