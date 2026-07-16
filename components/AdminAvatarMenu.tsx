'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function AdminAvatarMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/login')
    setOpen(false)
  }

  const firstName = user?.firstName || ''
  const lastName = user?.lastName || ''
  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || '?'

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: '#EEF9F4',
          border: '1.5px solid #D6F0E8',
          color: '#0C6B54',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {initials}
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '44px',
          backgroundColor: '#fff',
          border: '1px solid #E4E2DA',
          borderRadius: '10px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          minWidth: '160px',
          overflow: 'hidden',
          zIndex: 100,
        }}>
        
          <button
            onClick={handleLogout}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '10px 16px',
              fontSize: '13px',
              color: '#8C3018',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}>
            Déconnexion
          </button>
        </div>
      )}
    </div>
  )
}