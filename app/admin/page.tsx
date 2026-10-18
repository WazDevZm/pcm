"use client"

import { useEffect, useState } from 'react'
import {
  Users, Calendar, FileText, Heart, Image, BookOpen,
  MessageCircle, HandHeart, ShoppingBag, AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { ScrollToBottom } from '@/components/ui/scroll-to-bottom'
import { getAdminCounts, type AdminCounts, type AdminCountKey } from '@/lib/data/admin'

export default function AdminDashboard() {
  const [counts, setCounts] = useState<AdminCounts | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminCounts()
      .then(setCounts)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Could not load dashboard data.'))
      .finally(() => setLoading(false))
  }, [])

  const quickActions = [
    { name: 'Create Post', href: '/admin/content/new', icon: FileText, color: 'bg-blue-500' },
    { name: 'Add Event', href: '/admin/events/new', icon: Calendar, color: 'bg-green-500' },
    { name: 'Upload Media', href: '/admin/gallery/upload', icon: Image, color: 'bg-purple-500' },
    { name: 'Add Resource', href: '/admin/resources/new', icon: BookOpen, color: 'bg-orange-500' }
  ]

  const statCards: { key: AdminCountKey; name: string; icon: typeof Users; color: string; href: string }[] = [
    { key: 'users', name: 'Users', icon: Users, color: 'text-blue-400', href: '/admin/users' },
    { key: 'posts', name: 'Posts', icon: FileText, color: 'text-green-400', href: '/admin/content' },
    { key: 'upcomingEvents', name: 'Upcoming Events', icon: Calendar, color: 'text-purple-400', href: '/admin/events' },
    { key: 'resources', name: 'Resources', icon: BookOpen, color: 'text-cyan-400', href: '/admin/resources' }
  ]

  const pendingItems: { key: AdminCountKey; name: string; icon: typeof Users; href: string; unit: string }[] = [
    { key: 'pendingPrayers', name: 'Prayer Requests', icon: Heart, href: '/admin/prayers', unit: 'active' },
    { key: 'pendingCounseling', name: 'Counseling Requests', icon: MessageCircle, href: '/admin/counseling', unit: 'pending' },
    { key: 'pendingVolunteers', name: 'Volunteer Applications', icon: HandHeart, href: '/admin/volunteers', unit: 'pending review' },
    { key: 'pendingOrders', name: 'Merch Orders', icon: ShoppingBag, href: '/admin', unit: 'pending' }
  ]

  const show = (key: AdminCountKey) => {
    const value = counts?.[key]
    return value === null || value === undefined ? '—' : value
  }

  const unavailable = counts ? Object.values(counts).filter((v) => v === null).length : 0

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-white/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 relative min-h-screen">
      <ScrollToBottom targetId="dashboard-content" label="Scroll down" />

      {/* Header */}
      <div id="dashboard-content" className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-white/70 text-sm md:text-base">Welcome back! Here&apos;s what&apos;s happening with your ministry.</p>
      </div>

      {(error || unavailable > 0) && (
        <div className="mb-8 flex items-start gap-3 p-4 bg-yellow-500/10 ring-1 ring-yellow-500/20 rounded-lg text-sm">
          <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0" />
          <p className="text-white/80">
            {error
              ? `Could not reach the database: ${error}`
              : 'Some figures could not be loaded (shown as —). The database tables may not be set up yet.'}
          </p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {quickActions.map((action) => {
            const IconComponent = action.icon
            return (
              <Link
                key={action.name}
                href={action.href}
                className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-white/5 ring-1 ring-white/10 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className={`p-2 rounded-lg ${action.color} shrink-0`}>
                  <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <span className="font-medium text-sm md:text-base">{action.name}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {statCards.map((stat) => {
            const IconComponent = stat.icon
            return (
              <Link
                key={stat.key}
                href={stat.href}
                className="bg-white/5 ring-1 ring-white/10 rounded-lg p-4 md:p-6 hover:bg-white/10 transition-colors"
              >
                <div className="mb-3 md:mb-4">
                  <div className="inline-flex p-2 rounded-lg bg-white/10">
                    <IconComponent className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-xl md:text-2xl font-bold mb-1">{show(stat.key)}</div>
                <div className="text-white/70 text-xs md:text-sm">{stat.name}</div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Pending Items */}
      <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Needs Attention</h3>
          <AlertCircle className="w-5 h-5 text-yellow-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pendingItems.map((item) => {
            const IconComponent = item.icon
            const value = show(item.key)
            const content = (
              <>
                <div className="flex items-center gap-3">
                  <IconComponent className="w-5 h-5 text-white/60" />
                  <div>
                    <p className="text-white/90 text-sm">{item.name}</p>
                    <p className="text-white/50 text-xs">
                      {value === '—' ? 'Unavailable' : `${value} ${item.unit}`}
                    </p>
                  </div>
                </div>
                <span className="text-xl font-bold">{value}</span>
              </>
            )
            const cls = 'flex items-center justify-between p-3 bg-white/5 ring-1 ring-white/10 rounded-lg'
            return item.key === 'pendingOrders' ? (
              <div key={item.key} className={cls}>{content}</div>
            ) : (
              <Link key={item.key} href={item.href} className={`${cls} hover:bg-white/10 transition-colors`}>
                {content}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
