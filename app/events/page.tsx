'use client'
import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminAvatarMenu from '@/components/AdminAvatarMenu'
import AdminSidebar from '@/components/AdminSidebar'
import api from '@/lib/api'

// ⚠️ Route à confirmer avec le backend — hypothèse : GET /api/events
interface AdminEvent {
  id: string
  title: string
  date?: string
  city?: string
  category?: string
   status?: string
    organizer?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
 
}

export default function EventsPage() {
  return (
    <ProtectedRoute>
      <EventsContent />
    </ProtectedRoute>
  )
}

function EventsContent() {
  const [events, setEvents] = useState<AdminEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      try {
        const res = await api.get('/api/events/')
        setEvents(res.data.data || [])
      } catch (err) {
        setErrorMsg("Impossible de charger les événements — route à confirmer avec le backend")
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  return (
    <div style={{ display: 'flex', backgroundColor: '#EFEDE6', minHeight: '100vh' }}>
      <AdminSidebar />

      <div style={{ flex: 1 }}>

        {/* TOPBAR */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 24px', backgroundColor: '#FFFFFE', borderBottom: '1px solid #E4E2DA',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 16, color: '#0C6B54' }}>EventHub</span>
            <span style={{
              fontSize: 10, fontWeight: 500, color: '#fff',
              backgroundColor: '#4A3DAA', padding: '2px 8px', borderRadius: 20,
            }}>ADMIN</span>
          </div>
          <AdminAvatarMenu />
        </div>

        <div style={{ maxWidth: '80%', margin: '0 auto', padding: '24px 16px' }}>

          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#1A1A18', marginBottom: 2 }}>
            Événements
          </h1>
          <p style={{ fontSize: 12, color: '#7A7A74', marginBottom: 20 }}>
            Tous les événements publiés sur la plateforme
          </p>

          {errorMsg && (
            <div style={{
              fontSize: 13, borderRadius: 8, padding: '10px 14px', marginBottom: 16,
              backgroundColor: '#FDEAE4', color: '#8C3018',
            }}>
              {errorMsg}
            </div>
          )}

          {loading && (
            <p style={{ fontSize: 12, color: '#7A7A74', textAlign: 'center', padding: 20 }}>
              Chargement...
            </p>
          )}

          {!loading && !errorMsg && events.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '40px 20px', color: '#7A7A74', fontSize: 13,
              backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E4E2DA',
            }}>
              Aucun événement trouvé.
            </div>
          )}

          {events.length > 0 && (
            <div style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E4E2DA', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ backgroundColor: '#F6F5F0' }}>
                    <th style={thStyle}>Titre</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Ville</th>
                    <th style={thStyle}>Catégorie</th>
                    <th style={thStyle}>Organisateur</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(ev => (
                    <tr key={ev.id} style={{ borderTop: '1px solid #E4E2DA' }}>
                      <td style={tdStyle}>{ev.title}</td>
                      <td style={tdStyle}>{ev.date || '—'}</td>
                      <td style={tdStyle}>{ev.city || '—'}</td>
                      <td style={tdStyle}>{ev.category || '—'}</td>
                      <td style={tdStyle}>
                      {ev.organizer
                        ? `${ev.organizer.firstName} ${ev.organizer.lastName}`
                        : '—'}
                    </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '10px 14px', fontSize: 10, fontWeight: 500,
  color: '#7A7A74', textTransform: 'uppercase', letterSpacing: '0.05em',
}
const tdStyle: React.CSSProperties = { padding: '10px 14px', color: '#1A1A18' }