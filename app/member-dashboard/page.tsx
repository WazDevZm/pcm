'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ScrollToBottom } from '@/components/ui/scroll-to-bottom'
import {
  Calendar,
  Users,
  BookOpen,
  Heart,
  LogOut,
  Settings,
  Bell,
  ChevronRight
} from 'lucide-react'

export default function MemberDashboard() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    upcomingEvents: 3,
    joinedBands: 1,
    attendedEvents: 12,
    prayerRequests: 2
  })

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push('/login')
      return
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F12] flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  if (!user) {
    return null
  }

  const quickActions = [
    {
      title: 'View Events',
      description: 'See upcoming ministry events',
      icon: Calendar,
      href: '/events',
      color: 'bg-blue-500/20 text-blue-400'
    },
    {
      title: 'Join a Band',
      description: 'Find and join ministry bands',
      icon: Users,
      href: '/bands',
      color: 'bg-purple-500/20 text-purple-400'
    },
    {
      title: 'Bible Study',
      description: 'Join weekly Bible study',
      icon: BookOpen,
      href: '/bands/bible-study-band',
      color: 'bg-green-500/20 text-green-400'
    },
    {
      title: 'Prayer Request',
      description: 'Submit a prayer request',
      icon: Heart,
      href: '/prayer-request',
      color: 'bg-red-500/20 text-red-400'
    }
  ]

  const recentActivities = [
    { title: 'Joined Bible Study Band', date: '2 days ago', type: 'band' },
    { title: 'Registered for Worship Service', date: '5 days ago', type: 'event' },
    { title: 'Submitted prayer request', date: '1 week ago', type: 'prayer' }
  ]

  return (
    <div className="min-h-screen bg-[#0B0F12] text-white relative">
      <ScrollToBottom targetId="dashboard-content" label="Scroll" />
      
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {profile?.name || user.email?.split('@')[0]}</h1>
            <p className="text-white/60 text-sm">Member Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="text-white/70 hover:text-white"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="dashboard-content" className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-1">{stats.upcomingEvents}</div>
            <div className="text-sm text-white/60">Upcoming Events</div>
          </div>
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-1">{stats.joinedBands}</div>
            <div className="text-sm text-white/60">Joined Bands</div>
          </div>
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">{stats.attendedEvents}</div>
            <div className="text-sm text-white/60">Events Attended</div>
          </div>
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-red-400 mb-1">{stats.prayerRequests}</div>
            <div className="text-sm text-white/60">Prayer Requests</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div mb-8>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-4 p-6 rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/20 transition-all group"
                >
                  <div className={`p-3 rounded-xl ${action.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{action.title}</h3>
                    <p className="text-sm text-white/60">{action.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-white/50">{activity.date}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70 capitalize">
                    {activity.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ministry Info */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Ministry Information</h2>
          <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Next Worship Service</h3>
                <p className="text-white/70 text-sm mb-1">Saturday, 9:00 AM</p>
                <p className="text-white/50 text-sm">Main Chapel</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Bible Study</h3>
                <p className="text-white/70 text-sm mb-1">Wednesday, 7:00 PM</p>
                <p className="text-white/50 text-sm">Room 201</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-8">
          <div className="rounded-xl bg-gradient-to-r from-[#0f2d6e]/30 to-[#0f2d6e]/10 ring-1 ring-[#0f2d6e]/30 p-6">
            <h2 className="font-semibold mb-2">Need Help?</h2>
            <p className="text-white/70 text-sm mb-4">
              Contact the ministry team for support or questions about your membership.
            </p>
            <Button asChild className="bg-white text-black hover:bg-white/90 rounded-full">
              <Link href="/support">Contact Ministry Team</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
