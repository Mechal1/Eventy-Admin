'use client'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const NAV_ITEMS = [
  {
    label: 'Candidatures',
    path: '/dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 2h6l4 4v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
        <path d="M9 2v4h4" />
        <path d="M5 9h6M5 11.5h6" />
      </svg>
    ),
  },
  {
    label: 'Utilisateurs',
    path: '/users',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="6" cy="5" r="2.5" />
        <path d="M1 14c0-3.3 2.2-5.5 5-5.5S11 10.7 11 14" />
        <circle cx="12.5" cy="5.5" r="2" />
        <path d="M11 13.5c0-1.7.7-3.2 2-4" />
      </svg>
    ),
  },
  {
    label: 'Événements',
    path: '/events',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="12" height="11" rx="2" />
        <path d="M2 7h12M6 1v4M10 1v4" />
      </svg>
    ),
  },
]

export default function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{
      width: collapsed ? 64 : 200,
      flexShrink: 0,
      backgroundColor: '#FFFFFE',
      borderRight: '1px solid #E4E2DA',
      padding: '12px',
      transition: 'width 0.2s ease',
      boxSizing: 'border-box',
    }}>
      {/* Bouton toggle, en haut de la sidebar */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? 'Ouvrir le menu' : 'Réduire le menu'}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: 10,
          width: '100%',
          padding: collapsed ? '9px' : '9px 12px',
          marginBottom: 10,
          border: 'none',
          borderRadius: 8,
          background: 'transparent',
          cursor: 'pointer',
          color: '#8A8A82',
        }}
      >
        <svg
          width="14" height="14" viewBox="0 0 16 16" fill="none"
          stroke="currentColor" strokeWidth="2"
          style={{
            transform: collapsed ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
          }}
        >
          <path d="M10 2 5 8l5 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap: 10,
                padding: collapsed ? '9px' : '9px 12px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: 13,
                fontWeight: 500,
                whiteSpace: 'nowrap',
                backgroundColor: isActive ? '#D6F0E8' : 'transparent',
                color: isActive ? '#0C6B54' : '#4A4A45',
              }}>
              {item.icon}
              {!collapsed && item.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}