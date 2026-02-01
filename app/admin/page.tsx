"use client"

import { useEffect, useState } from 'react'
import { 
  Users, Calendar, FileText, Heart, Image, BookOpen, 
  TrendingUp, Activity, Clock, AlertCircle 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getPosts, getEvents, getPrayerRequests, getGalleryItems } from '@/lib/database'

interface DashboardStats {
  totalUsers: number
  totalPosts: number
  upcomingEvents: number
  activePrayers: number
  galleryItems: number
  recentActivity: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPosts: 0,
    upcomingEvents: 0,
    activePrayers: 0,
    galleryItems: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [posts, events, prayers, gallery] = await Promise.all([
          getPosts(),
          getEvents(undefined, true), // upcoming events
          getPrayerRequests('active'),
          getGalleryItems()
        ])

        setStats({
          totalUsers: 156, // This would come from a user count query
          totalPosts: posts.length,
          upcomingEvents: events.length,
          activePrayers: prayers.length,
          galleryItems: gallery.length,
          recentActivity: [
            { type: 'post', title: 'New testimony published', time: '2 hours ago' },
            { type: 'event', title: 'Bible Study event created', time: '4 hours ago' },
            { type: 'prayer', title: 'New prayer request submitted', time: '6 hours ago' },
            { type: 'user', title: 'New user registered', time: '1 day ago' }
          ]
        })
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const quickActions = [
    { name: 'Create Post', href: '/admin/content/new', icon: FileText, color: 'bg-blue-500' },
    { name: 'Add Event', href: '/admin/events/new', icon: Calendar, color: 'bg-green-500' },
    { name: 'Upload Media', href: '/admin/gallery/upload', icon: Image, color: 'bg-purple-500' },
    { name: 'Add Resource', href: '/admin/resources/new', icon: BookOpen, color: 'bg-orange-500' }
  ]

  const statCards = [
    { name: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-400', change: '+12%' },
    { name: 'Published Posts', value: stats.totalPosts, icon: FileText, color: 'text-green-400', change: '+8%' },
    { name: 'Upcoming Events', value: stats.upcomingEvents, icon: Calendar, color: 'text-purple-400', change: '+15%' },
    { name: 'Active Prayers', value: stats.activePrayers, icon: Heart, color: 'text-red-400', change: '+5%' },
    { name: 'Gallery Items', value: stats.galleryItems, icon: Image, color: 'text-yellow-400', change: '+20%' },
    { name: 'Resources', value: 24, icon: BookOpen, color: 'text-indigo-400', change: '+3%' }
  ]

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-white/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-white/70">Welcome back! Here's what's happening with your ministry.</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const IconComponent = action.icon
            return (
              <Link
                key={action.name}
                href={action.href}
                className="flex items-center gap-3 p-4 bg-white/5 ring-1 ring-white/10 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className={`p-2 rounded-lg ${action.color}`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium">{action.name}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat) => {
            const IconComponent = stat.icon
            return (
              <div key={stat.name} className="bg-white/5 ring-1 ring-white/10 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-white/10`}>
                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-white/70 text-sm">{stat.name}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
            <Activity className="w-5 h-5 text-white/50" />
          </div>
          
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white/90 text-sm">{activity.title}</p>
                  <p className="text-white/50 text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full mt-4 bg-black/40 ring-1 ring-white/20 backdrop-blur border-0 text-white hover:bg-black/50">
            View All Activity
          </Button>
        </div>

        {/* Pending Items */}
        <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Pending Items</h3>
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-yellow-500/10 ring-1 ring-yellow-500/20 rounded-lg">
              <div>
                <p className="text-white/90 text-sm">Volunteer Applications</p>
                <p className="text-white/50 text-xs">3 pending review</p>
              </div>
              <Button size="sm" className="bg-yellow-500 text-black hover:bg-yellow-400">
                Review
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-500/10 ring-1 ring-blue-500/20 rounded-lg">
              <div>
                <p className="text-white/90 text-sm">Counseling Requests</p>
                <p className="text-white/50 text-xs">2 need scheduling</p>
              </div>
              <Button size="sm" className="bg-blue-500 text-white hover:bg-blue-400">
                Schedule
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-500/10 ring-1 ring-green-500/20 rounded-lg">
              <div>
                <p className="text-white/90 text-sm">Event Registrations</p>
                <p className="text-white/50 text-xs">15 new registrations</p>
              </div>
              <Button size="sm" className="bg-green-500 text-white hover:bg-green-400">
                View
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-8 bg-white/5 ring-1 ring-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-white/90">Database: Online</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-white/90">Storage: Online</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-white/90">Email: Online</span>
          </div>
        </div>
      </div>
    </div>
  )
}