"use client"

import { useAuth } from '@/components/auth/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard, FileText, Calendar, Users, Image, BookOpen, 
  Heart, HandHeart, MessageCircle, UserCheck, BarChart3, Settings,
  LogOut, Home
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

  useEffect(() => {
    if (!loading && (!user || !profile || !['admin', 'leader'].includes(profile.role))) {
      router.push('/')
    }
  }, [user, profile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F12] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user || !profile || !['admin', 'leader'].includes(profile.role)) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0B0F12] text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-black/40 backdrop-blur border-r border-white/10 min-h-screen">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <img src="/logo (2).png" alt="Logo" className="w-10 h-10 object-contain" />
              <div>
                <h2 className="font-bold text-lg">Admin Panel</h2>
                <p className="text-white/60 text-sm">CBU SDA Ministry</p>
              </div>
            </div>

            <nav className="space-y-2">
              {adminNavItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group"
                  >
                    <IconComponent className="w-5 h-5 text-white/70 group-hover:text-white" />
                    <span className="text-white/70 group-hover:text-white">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
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
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}