"use client"

import { useCallback, useEffect, useState } from 'react'
import { Search, Filter, Shield, User as UserIcon, Mail, Calendar, Crown, Music } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/components/auth/AuthProvider'
import type { User } from '@/lib/supabase'
import { getBandAdminAssignments, listUsers, setUserOffice, setUserRole, type Office, type Role } from '@/lib/data/admin'
import { AdminPage } from '@/components/admin/kit'
import { OFFICE_LABEL } from '@/lib/brand'

const ROLES: Role[] = ['student', 'leader', 'admin']

export default function AdminUsersPage() {
  const { user: me, isAdmin } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [bandAssignments, setBandAssignments] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<'all' | Role>('all')
  const [savingId, setSavingId] = useState<string | null>(null)

  const load = useCallback(async (search: string) => {
    try {
      const rows = await listUsers(search)
      setUsers(rows)
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not load users.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounced server-side search by name/email
  useEffect(() => {
    const t = setTimeout(() => load(searchTerm), 300)
    return () => clearTimeout(t)
  }, [searchTerm, load])

  useEffect(() => {
    getBandAdminAssignments()
      .then(setBandAssignments)
      .catch(() => setBandAssignments({}))
  }, [])

  const changeRole = async (target: User, role: Role) => {
    if (role === target.role) return
    if (!confirm(`Change ${target.name}'s role from ${target.role} to ${role}?`)) return
    setSavingId(target.id)
    try {
      const updated = await setUserRole(target.id, role)
      setUsers((prev) => prev.map((u) => (u.id === target.id ? { ...u, role: updated.role } : u)))
      toast.success(`${target.name} is now ${role === 'admin' ? 'an admin' : `a ${role}`}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Could not change role')
    } finally {
      setSavingId(null)
    }
  }

  const filteredUsers = users.filter((u) => selectedRole === 'all' || u.role === selectedRole)

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-violet-50 text-violet-700 ring-violet-200'
      case 'leader': return 'bg-navy-soft text-navy ring-navy/20'
      case 'student': return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      default: return 'bg-muted text-muted-foreground ring-border'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Crown
      case 'leader': return Shield
      default: return UserIcon
    }
  }

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const changeOffice = async (target: User, office: Office | null) => {
    if ((target.office ?? null) === office) return
    const label = office ? OFFICE_LABEL[office] : 'no office'
    if (!confirm(`Set ${target.name}'s office to ${label}?${office ? ' This also makes them an admin.' : ''}`)) return
    setSavingId(target.id)
    try {
      const updated = await setUserOffice(target.id, office)
      setUsers((prev) => prev.map((u) => (u.id === target.id ? { ...u, role: updated.role, office: updated.office } : u)))
      toast.success(`${target.name}: ${label}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Could not change office')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <AdminPage
      title="Users & roles"
      description={
        isAdmin
          ? 'View accounts, change roles and leadership offices, and see who runs each band.'
          : 'View accounts and band assignments. Only admins can change roles.'
      }
    >

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-ink placeholder:text-[#8a93a3] focus:outline-none focus:ring-2 focus:ring-navy/20"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as 'all' | Role)}
            className="w-full sm:w-auto pl-10 pr-8 py-2 bg-muted border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-navy/20 appearance-none"
          >
            <option value="all" className="bg-white">All Roles</option>
            <option value="admin" className="bg-white">Admins</option>
            <option value="leader" className="bg-white">Leaders</option>
            <option value="student" className="bg-white">Students</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 ring-1 ring-red-200 rounded-lg text-sm text-red-700">
          Could not load users: {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        <div className="bg-white ring-1 ring-border rounded-lg p-4">
          <div className="text-xl md:text-2xl font-bold">{users.length}</div>
          <div className="text-muted-foreground text-xs md:text-sm">{searchTerm ? 'Matching Users' : 'Total Users'}</div>
        </div>
        <div className="bg-white ring-1 ring-border rounded-lg p-4">
          <div className="text-xl md:text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</div>
          <div className="text-muted-foreground text-xs md:text-sm">Admins</div>
        </div>
        <div className="bg-white ring-1 ring-border rounded-lg p-4">
          <div className="text-xl md:text-2xl font-bold">{users.filter(u => u.role === 'leader').length}</div>
          <div className="text-muted-foreground text-xs md:text-sm">Leaders</div>
        </div>
        <div className="bg-white ring-1 ring-border rounded-lg p-4">
          <div className="text-xl md:text-2xl font-bold">{users.filter(u => u.role === 'student').length}</div>
          <div className="text-muted-foreground text-xs md:text-sm">Students</div>
        </div>
      </div>

      <div className="bg-white ring-1 ring-border rounded-lg overflow-hidden">
        <div className="p-4 md:p-6 border-b border-border">
          <h2 className="text-lg font-semibold">Users ({filteredUsers.length})</h2>
        </div>

        <div className="divide-y divide-border">
          {filteredUsers.map((u) => {
            const RoleIcon = getRoleIcon(u.role)
            const bands = bandAssignments[u.id] ?? []
            const isSelf = u.id === me?.id
            return (
              <div key={u.id} className="p-4 md:p-6 hover:bg-canvas transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-semibold shrink-0">
                      {(u.name || u.email || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-base md:text-lg font-semibold text-ink">{u.name || 'Unnamed'}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ring-1 flex items-center gap-1 ${getRoleColor(u.role)}`}>
                          <RoleIcon className="w-3 h-3" />
                          {u.role}
                        </span>
                        {u.office && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gold-soft text-gold-ink">
                            {OFFICE_LABEL[u.office]}
                          </span>
                        )}
                        {isSelf && <span className="text-xs text-muted-foreground">(you)</span>}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1 min-w-0">
                          <Mail className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                          <span className="truncate">{u.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                          <span>Joined {new Date(u.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {bands.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Music className="w-3 h-3" /> Band admin:
                          </span>
                          {bands.map((band) => (
                            <span key={band} className="px-2 py-1 bg-muted rounded-full text-xs text-ink/85">
                              {band}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="shrink-0 sm:pl-0 pl-16 flex flex-col gap-2">
                      <select
                        aria-label={`Office for ${u.name}`}
                        value={u.office ?? ''}
                        disabled={isSelf || savingId === u.id}
                        onChange={(e) => changeOffice(u, (e.target.value || null) as Office | null)}
                        className="px-3 py-2 bg-white border border-border rounded-lg text-ink text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 disabled:opacity-50"
                      >
                        <option value="">No office</option>
                        {Object.entries(OFFICE_LABEL).map(([k, v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                      <select
                        aria-label={`Role for ${u.name}`}
                        value={u.role}
                        disabled={isSelf || savingId === u.id}
                        title={isSelf ? 'You cannot change your own role' : undefined}
                        onChange={(e) => changeRole(u, e.target.value as Role)}
                        className="px-3 py-2 bg-muted border border-border rounded-lg text-ink text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 disabled:opacity-50"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r} className="bg-white">{r}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {filteredUsers.length === 0 && !error && (
            <div className="p-8 md:p-12 text-center">
              <div className="text-muted-foreground">No users found</div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-navy-soft ring-1 ring-navy/20 rounded-lg p-6">
        <h3 className="font-semibold mb-2">About Roles</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Accounts are created when people sign up on the website or app. Only admins can change roles,
          and nobody can change their own. Band admin assignments come from the band_admins table.
        </p>
        <ul className="text-muted-foreground text-sm space-y-1">
          <li>• <strong>Offices:</strong> Developer, PCM Chairperson and Vice Chairperson are admins with their own dashboards</li>
          <li>• <strong>Admins:</strong> Full access, including changing roles</li>
          <li>• <strong>Leaders:</strong> Manage content, events, media, and requests</li>
          <li>• <strong>Band heads:</strong> Students assigned to a band (Bands &amp; committees) run that band’s dashboard</li>
          <li>• <strong>Students:</strong> Member dashboard, RSVPs, bands, and requests</li>
        </ul>
      </div>
    </AdminPage>
  )
}
