"use client"

import { useAuth } from '@/components/auth/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard, FileText, Calendar, Users, Image, BookOpen, 
  Heart, HandHeart, MessageCircle, UserCheck, BarChart3, Settings,
  LogOut, Home, Menu, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const adminNavItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Content', href: '/admin/content', icon: FileText },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Committees', href: '/admin/committees', icon: Users },
  { name: 'Gallery', href: '/admin/gallery', icon: Image },
  { name: 'Resources', href: '/admin/resources', icon: BookOpen },
  { name: 'Prayer Requests', href: '/admin/prayers', icon: Heart },
  { name: 'Volunteers', href: '/admin/volunteers', icon: HandHeart },
  { name: 'Counseling', href: '/admin/counseling', icon: MessageCircle },
  { name: 'Users', href: '/admin/users', icon: UserCheck },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && (!user || !profile || !['admin', 'leader'].includes(profile.role))) {
      router.push('/')
    }
  }, [user, profile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F12] flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-md px-8">
          <div className="h-8 bg-white/10 rounded w-48 mx-auto" />
          <div className="h-4 bg-white/10 rounded w-32 mx-auto" />
        </div>
      </div>
    )
  }

  if (!user || !profile || !['admin', 'leader'].includes(profile.role)) {
    return null
  }

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <img src="/logo (2).png" alt="Logo" className="w-10 h-10 object-contain" />
          <div>
            <h2 className="font-bold text-lg">Admin Panel</h2>
            <p className="text-white/60 text-sm">CBU SDA Ministry</p>
          </div>
        </div>

        <nav className="space-y-1">
          {adminNavItems.map((item) => {
            const IconComponent = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <IconComponent className="w-5 h-5 text-white/70 group-hover:text-white" />
                <span className="text-white/70 group-hover:text-white text-sm">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-white/10 mt-auto">
        <div className="mb-4">
          <p className="text-white/90 font-medium">{profile.name}</p>
          <p className="text-white/60 text-sm capitalize">{profile.role}</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="flex-1 bg-black/40 ring-1 ring-white/20 backdrop-blur border-0 text-white hover:bg-black/50"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Site
            </Link>
          </Button>
          
          <Button
            onClick={signOut}
            variant="outline"
            size="sm"
            className="bg-red-500/20 ring-1 ring-red-500/30 backdrop-blur border-0 text-red-200 hover:bg-red-500/30"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-[#0B0F12] text-white">
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-black/60 border-b border-white/10 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <img src="/logo (2).png" alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-semibold text-sm">Admin Panel</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-20 bg-black/60"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden md:flex md:flex-col w-64 bg-black/40 backdrop-blur border-r border-white/10 min-h-screen sticky top-0 h-screen overflow-y-auto">
          <SidebarContent />
        </div>

        {/* Mobile sidebar drawer */}
        <div className={`md:hidden fixed top-0 left-0 z-30 h-full w-64 bg-[#0B0F12] border-r border-white/10 flex flex-col overflow-y-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <SidebarContent />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  )
}