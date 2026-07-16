'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'


export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (user && user.role === 'admin') {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [user, loading, router])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#EFEDE6', color: '#7A7A74', fontSize: 13,
    }}>
      Chargement...
    </div>
  )
}