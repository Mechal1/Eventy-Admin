'use client'
import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/context/AuthContext'
import AdminAvatarMenu from '@/components/AdminAvatarMenu'
import AdminSidebar from '@/components/AdminSidebar'
import api from '@/lib/api'

// ---- Forme réelle confirmée par GET /api/become-organizer/ ----
interface Application {
  id: string
  userId: string
  email: string
  phone: string
  organizationName: string
  organizationType: string
  status: 'in-review' | 'approved' | 'declined'
  createdAt: string
  updatedAt: string
}

type FilterStatus = 'in-review' | 'approved' | 'declined'

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('in-review')

  useEffect(() => {
    async function fetchApplications() {
      setLoading(true)
      try {
        const res = await api.get('/api/become-organizer/')
        setApplications(res.data.data || [])
      } catch (err) {
        setErrorMsg("Impossible de charger les candidatures")
      } finally {
        setLoading(false)
      }
    }
    fetchApplications()
  }, [])

  const pendingCount = applications.filter(a => a.status === 'in-review').length
  const approvedCount = applications.filter(a => a.status === 'approved').length
  const declinedCount = applications.filter(a => a.status === 'declined').length

  async function handleApprove(id: string) {
    try {
      await api.put(`/api/become-organizer/${id}/status`, { status: 'approved' })
      setApplications(prev =>
        prev.map(a => (a.id === id ? { ...a, status: 'approved' } : a))
      )
    } catch (err) {
      setErrorMsg("Impossible d'approuver cette candidature")
    }
  }

  async function handleReject(id: string) {
    try {
      await api.put(`/api/become-organizer/${id}/status`, { status: 'declined' })
      setApplications(prev =>
        prev.map(a => (a.id === id ? { ...a, status: 'declined' } : a))
      )
    } catch (err) {
      setErrorMsg("Impossible de rejeter cette candidature")
    }
  }

  const filteredApplications = applications.filter(a => a.status === activeFilter)

  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    } catch {
      return iso
    }
  }

  const emptyMessages: Record<FilterStatus, string> = {
    'in-review': 'Aucune candidature en attente pour le moment.',
    'approved': 'Aucune candidature approuvée pour le moment.',
    'declined': 'Aucune candidature rejetée pour le moment.',
  }

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
            Candidatures organisateur
          </h1>
          <p style={{ fontSize: 12, color: '#7A7A74', marginBottom: 20 }}>
            {user?.firstName ? `Bonjour ${user.firstName}, ` : ''}
            voici les demandes à examiner
          </p>

          {errorMsg && (
            <div style={{
              fontSize: 13, borderRadius: 8, padding: '10px 14px', marginBottom: 16,
              backgroundColor: '#FDEAE4', color: '#8C3018',
            }}>
              {errorMsg}
            </div>
          )}

          {/* STATS — cliquables pour filtrer */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center', marginBottom: 20 }}>
            <StatBox
              n={pendingCount}
              label="En attente"
              active={activeFilter === 'in-review'}
              onClick={() => setActiveFilter('in-review')}
            />
            <StatBox
              n={approvedCount}
              label="Approuvées"
              active={activeFilter === 'approved'}
              onClick={() => setActiveFilter('approved')}
            />
            <StatBox
              n={declinedCount}
              label="Rejetées"
              active={activeFilter === 'declined'}
              onClick={() => setActiveFilter('declined')}
            />
          </div>

          {loading && (
            <p style={{ fontSize: 12, color: '#7A7A74', textAlign: 'center', padding: 20 }}>
              Chargement...
            </p>
          )}

          {!loading && filteredApplications.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '40px 20px', color: '#7A7A74', fontSize: 13,
              backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E4E2DA',
            }}>
              {emptyMessages[activeFilter]}
            </div>
          )}

          {/* LISTE DES CANDIDATURES (filtrée) */}
          {filteredApplications.length > 0 && (
            <div style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E4E2DA', overflow: 'hidden' }}>
              {filteredApplications.map((app, i) => (
                <div
                  key={app.id}
                  style={{
                    display: 'flex', gap: 12, padding: 14,
                    borderBottom: i < filteredApplications.length - 1 ? '1px solid #E4E2DA' : 'none',
                  }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                    backgroundColor: '#EEF9F4', border: '1.5px solid #D6F0E8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 600, color: '#0C6B54',
                  }}>
                    {app.organizationName?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div style={{ flex: 1 }}>

                    {/* Nom + boutons (uniquement pour "en attente") */}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4,
                    }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: '#1A1A18' }}>
                        {app.organizationName}
                      </div>

                      {activeFilter === 'in-review' && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => handleApprove(app.id)}
                            style={{
                              fontSize: 11, fontWeight: 500, padding: '5px 10px', borderRadius: 6,
                              cursor: 'pointer', color: '#0C6B54', border: '1px solid #A9DCC7',
                              backgroundColor: '#EEF9F4',
                            }}>
                            Approuver
                          </button>

                          <button
                            onClick={() => handleReject(app.id)}
                            style={{
                              fontSize: 11, fontWeight: 500, padding: '5px 10px', borderRadius: 6,
                              cursor: 'pointer', color: '#8C3018', border: '1px solid #F0BDB1',
                              backgroundColor: '#FDEAE4',
                            }}>
                            Rejeter
                          </button>
                        </div>
                      )}

                      {activeFilter === 'approved' && (
                        <span style={{
                          fontSize: 10, fontWeight: 500, padding: '3px 10px', borderRadius: 20,
                          backgroundColor: '#EEF9F4', color: '#0C6B54',
                        }}>
                          Approuvée
                        </span>
                      )}

                      {activeFilter === 'declined' && (
                        <span style={{
                          fontSize: 10, fontWeight: 500, padding: '3px 10px', borderRadius: 20,
                          backgroundColor: '#FDEAE4', color: '#8C3018',
                        }}>
                          Rejetée
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: 10.5, color: '#7A7A74', marginTop: 1 }}>
                      {app.email} · {app.phone}
                    </div>

                    <div style={{ fontSize: 10, color: '#7A7A74', marginTop: 4 }}>
                      Candidature du {formatDate(app.createdAt)}
                    </div>

                    <div style={{
                      display: 'inline-block', fontSize: 11, color: '#4A4A45', marginTop: 8,
                      backgroundColor: '#F6F5F0', borderRadius: 6, padding: '4px 10px',
                    }}>
                      Type d'organisation : <strong>{app.organizationType}</strong>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

function StatBox({
  n, label, active, onClick,
}: {
  n: number
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: active ? '#EEF9F4' : '#fff',
        border: active ? '1.5px solid #0C6B54' : '1px solid #E4E2DA',
        borderRadius: 10,
        padding: '12px 10px',
        cursor: 'pointer',
        textAlign: 'center',
      }}>
      <div style={{ fontSize: 20, fontWeight: 600, color: '#1A1A18' }}>{n}</div>
      <div style={{ fontSize: 10, color: active ? '#0C6B54' : '#7A7A74', marginTop: 2, fontWeight: active ? 600 : 400 }}>{label}</div>
    </button>
  )
}