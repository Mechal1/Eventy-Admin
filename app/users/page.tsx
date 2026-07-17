'use client'
import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import AdminAvatarMenu from '@/components/AdminAvatarMenu'
import AdminSidebar from '@/components/AdminSidebar'
import api from '@/lib/api'

// ⚠️ Route à confirmer avec le backend — hypothèse : GET /api/users
interface AppUser {
  id: string
  firstName?: string
  lastName?: string
  email: string
  role: string
  createdAt?: string
}

export default function UsersPage() {
  return (
    <ProtectedRoute>
      <UsersContent />
    </ProtectedRoute>
  )
}

function UsersContent() {
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<AppUser | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      try {
        const res = await api.get('/api/users/')
        setUsers(res.data.data || [])
      } catch (err) {
        setErrorMsg("Impossible de charger les utilisateurs — route à confirmer avec le backend")
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleDeleteUser = async (id: string) => {
    setDeleting(id)
    try {
      await api.delete(`/api/users/${id}`)
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch (err) {
      setErrorMsg("Impossible de supprimer cet utilisateur")
    } finally {
      setDeleting(null)
      setShowDeleteConfirm(null)
    }
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
            Utilisateurs
          </h1>
          <p style={{ fontSize: 12, color: '#7A7A74', marginBottom: 20 }}>
            Liste de tous les comptes inscrits sur EventHub
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

          {!loading && !errorMsg && users.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '40px 20px', color: '#7A7A74', fontSize: 13,
              backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E4E2DA',
            }}>
              Aucun utilisateur trouvé.
            </div>
          )}

          {users.length > 0 && (
            <div style={{ backgroundColor: '#fff', borderRadius: 14, border: '1px solid #E4E2DA', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ backgroundColor: '#F6F5F0' }}>
                    <th style={thStyle}>Nom</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Rôle</th>
                    <th style={thStyle}>Inscrit le</th>
                    <th style={thStyle}>Action</th>
                    <th style={thStyle}></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderTop: '1px solid #E4E2DA' }}>
                      <td style={tdStyle}>{u.firstName || ''} {u.lastName || ''}</td>
                      <td style={tdStyle}>{u.email}</td>
                      <td style={tdStyle}>
                        <span style={{
                          fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 20,
                          backgroundColor: u.role === 'admin' ? '#ECEAFB' : u.role === 'organizer' ? '#D6F0E8' : '#F6F5F0',
                          color: u.role === 'admin' ? '#4A3DAA' : u.role === 'organizer' ? '#0C6B54' : '#7A7A74',
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={tdStyle}>{u.createdAt || '—'}</td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>
                        <button
                          onClick={() => setShowDeleteConfirm(u)}
                          disabled={deleting === u.id}
                          title="Supprimer"
                          style={{
                            padding: '5px 10px', borderRadius: 6, fontSize: 11, fontWeight: 500,
                            border: '1px solid #F0BDB1', backgroundColor: '#FDEAE4', color: '#8C3018',
                            cursor: 'pointer', opacity: deleting === u.id ? 0.5 : 1,
                          }}>
                          {deleting === u.id ? '...' : 'Supprimer'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODAL CONFIRMATION SUPPRESSION */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #E4E2DA', padding: 24, width: '100%', maxWidth: 320, margin: '0 18px' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#1A1A18', marginBottom: 8 }}>
              Supprimer cet utilisateur ?
            </h2>
            <p style={{ fontSize: 12, color: '#7A7A74', marginBottom: 18, lineHeight: 1.5 }}>
              Tu es sur le point de supprimer définitivement{' '}
              <strong style={{ color: '#1A1A18' }}>
                {showDeleteConfirm.firstName || showDeleteConfirm.email} {showDeleteConfirm.lastName || ''}
              </strong>.
              Cette action est irréversible.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                disabled={deleting === showDeleteConfirm.id}
                style={{ flex: 1, padding: 9, borderRadius: 8, fontSize: 12, border: '1px solid #E4E2DA', background: '#fff', color: '#1A1A18', cursor: 'pointer' }}>
                Annuler
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteConfirm.id)}
                disabled={deleting === showDeleteConfirm.id}
                style={{ flex: 1, padding: 9, borderRadius: 8, fontSize: 12, border: 'none', background: '#8C3018', color: '#fff', cursor: 'pointer', opacity: deleting === showDeleteConfirm.id ? 0.5 : 1 }}>
                {deleting === showDeleteConfirm.id ? 'Suppression...' : 'Oui, supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '10px 14px', fontSize: 10, fontWeight: 500,
  color: '#7A7A74', textTransform: 'uppercase', letterSpacing: '0.05em',
}
const tdStyle: React.CSSProperties = { padding: '10px 14px', color: '#1A1A18' }