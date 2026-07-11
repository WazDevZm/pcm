"use client"

import { useEffect, useState } from 'react'
import { Search, Filter, Shield, UserPlus, MoreVertical, Mail, Calendar, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollToBottom } from '@/components/ui/scroll-to-bottom'
import { getBands } from '@/lib/bands'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'leader' | 'member'
  joined_at: string
  band_assignments?: string[]
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [bands, setBands] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const allBands = await getBands()
        setBands(allBands)
        
        // Mock users data - would come from Supabase Auth + profiles
        setUsers([
          {
            id: '1',
            name: 'John Smith',
            email: 'john@example.com',
            role: 'admin',
            joined_at: '2024-01-15',
            band_assignments: ['Bible Study Band', 'Welfare Band']
          },
          {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            role: 'leader',
            joined_at: '2024-02-20',
            band_assignments: ['Worship Committee']
          },
          {
            id: '3',
            name: 'Michael Davis',
            email: 'michael@example.com',
            role: 'leader',
            joined_at: '2024-03-10',
            band_assignments: ['Witnessing Band']
          },
          {
            id: '4',
            name: 'Emily Brown',
            email: 'emily@example.com',
            role: 'member',
            joined_at: '2024-04-05',
            band_assignments: ['Bible Study Band']
          },
          {
            id: '5',
            name: 'David Wilson',
            email: 'david@example.com',
            role: 'member',
            joined_at: '2024-05-12',
            band_assignments: []
          }
        ])
      } catch (error) {
        console.error('Error loading users:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-500/20 text-purple-300 ring-purple-500/30'
      case 'leader': return 'bg-blue-500/20 text-blue-300 ring-blue-500/30'
      case 'member': return 'bg-green-500/20 text-green-300 ring-green-500/30'
      default: return 'bg-gray-500/20 text-gray-300 ring-gray-500/30'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Crown
      case 'leader': return Shield
      case 'member': return UserPlus
      default: return UserPlus
    }
  }

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-64 mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-white/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <ScrollToBottom targetId="users-content" label="Scroll down" />
      
      <div id="users-content" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">User Management</h1>
          <p className="text-white/70 text-sm md:text-base">Manage user accounts, roles, and band assignments.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 self-start sm:self-auto">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full sm:w-auto pl-10 pr-8 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
          >
            <option value="all" className="bg-gray-800">All Roles</option>
            <option value="admin" className="bg-gray-800">Admins</option>
            <option value="leader" className="bg-gray-800">Leaders</option>
            <option value="member" className="bg-gray-800">Members</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-4">
          <div className="text-xl md:text-2xl font-bold">{users.length}</div>
          <div className="text-white/70 text-xs md:text-sm">Total Users</div>
        </div>
        <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-4">
          <div className="text-xl md:text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</div>
          <div className="text-white/70 text-xs md:text-sm">Admins</div>
        </div>
        <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-4">
          <div className="text-xl md:text-2xl font-bold">{users.filter(u => u.role === 'leader').length}</div>
          <div className="text-white/70 text-xs md:text-sm">Band Leaders</div>
        </div>
        <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-4">
          <div className="text-xl md:text-2xl font-bold">{users.filter(u => u.role === 'member').length}</div>
          <div className="text-white/70 text-xs md:text-sm">Members</div>
        </div>
      </div>

      <div className="bg-white/5 ring-1 ring-white/10 rounded-lg overflow-hidden">
        <div className="p-4 md:p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold">All Users ({filteredUsers.length})</h2>
        </div>
        
        <div className="divide-y divide-white/10">
          {filteredUsers.map((user) => {
            const RoleIcon = getRoleIcon(user.role)
            return (
              <div key={user.id} className="p-4 md:p-6 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-lg font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-base md:text-lg font-semibold text-white">{user.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ring-1 flex items-center gap-1 ${getRoleColor(user.role)}`}>
                          <RoleIcon className="w-3 h-3" />
                          {user.role}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-sm text-white/50 mb-2">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 md:w-4 md:h-4" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                          <span>Joined {new Date(user.joined_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {user.band_assignments && user.band_assignments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {user.band_assignments.map((band) => (
                            <span key={band} className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80">
                              {band}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    className="bg-black/40 ring-1 ring-white/20 backdrop-blur border-0 text-white hover:bg-black/50"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
          
          {filteredUsers.length === 0 && (
            <div className="p-8 md:p-12 text-center">
              <div className="text-white/50 mb-4">No users found</div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 bg-blue-500/10 ring-1 ring-blue-500/20 rounded-lg p-6">
        <h3 className="font-semibold mb-2">About User Management</h3>
        <p className="text-white/70 text-sm mb-4">
          User accounts are managed through Supabase Auth. Band leaders are assigned via the band_admins table.
          Admin users have full access to all features.
        </p>
        <ul className="text-white/60 text-sm space-y-1">
          <li>• <strong>Admins:</strong> Full site access, can manage all users and settings</li>
          <li>• <strong>Leaders:</strong> Can manage their assigned band/committee pages</li>
          <li>• <strong>Members:</strong> Can access member dashboard and participate in ministry activities</li>
        </ul>
      </div>
    </div>
  )
}
