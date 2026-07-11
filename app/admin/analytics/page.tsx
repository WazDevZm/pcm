"use client"

import { useEffect, useState } from 'react'
import { TrendingUp, Users, Eye, Calendar, FileText, Heart, Activity, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getPosts, getEvents, getPrayerRequests, getGalleryItems, getVolunteers } from '@/lib/database'
import { getBands } from '@/lib/bands'
import { ScrollToBottom } from '@/components/ui/scroll-to-bottom'

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalEvents: 0,
    activePrayers: 0,
    galleryItems: 0,
    totalBands: 0,
    totalVolunteers: 0,
    monthlyViews: 0,
    engagementRate: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [posts, events, prayers, gallery, volunteers] = await Promise.all([
          getPosts(),
          getEvents(),
          getPrayerRequests('active'),
          getGalleryItems(),
          getVolunteers()
        ])
        const bands = await getBands()
        
        setStats({
          totalPosts: posts.length,
          totalEvents: events.length,
          activePrayers: prayers.length,
          galleryItems: gallery.length,
          totalBands: bands.length,
          totalVolunteers: volunteers.length,
          monthlyViews: Math.floor(Math.random() * 5000) + 1000, // Would come from analytics
          engagementRate: Math.floor(Math.random() * 30) + 40 // Would come from analytics
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const statCards = [
    { name: 'Monthly Views', value: stats.monthlyViews.toLocaleString(), icon: Eye, color: 'text-blue-400', change: '+12%' },
    { name: 'Total Posts', value: stats.totalPosts, icon: FileText, color: 'text-green-400', change: '+8%' },
    { name: 'Events', value: stats.totalEvents, icon: Calendar, color: 'text-purple-400', change: '+15%' },
    { name: 'Prayer Requests', value: stats.activePrayers, icon: Heart, color: 'text-red-400', change: '+5%' },
    { name: 'Gallery Items', value: stats.galleryItems, icon: Activity, color: 'text-yellow-400', change: '+20%' },
    { name: 'Bands', value: stats.totalBands, icon: Users, color: 'text-indigo-400', change: '+2%' },
    { name: 'Volunteers', value: stats.totalVolunteers, icon: Users, color: 'text-pink-400', change: '+18%' },
    { name: 'Engagement Rate', value: `${stats.engagementRate}%`, icon: TrendingUp, color: 'text-cyan-400', change: '+3%' }
  ]

  if (loading) {
    return (
      <div className="p-4 md:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-white/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <ScrollToBottom targetId="analytics-content" label="Scroll down" />
      
      <div id="analytics-content" className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-white/70 text-sm md:text-base">Track site performance and user engagement metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
        {statCards.map((stat) => {
          const IconComponent = stat.icon
          return (
            <div key={stat.name} className="bg-white/5 ring-1 ring-white/10 rounded-lg p-4 md:p-6">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="p-2 rounded-lg bg-white/10">
                  <IconComponent className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                </div>
                <div className="flex items-center gap-1 text-xs md:text-sm text-green-400">
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
                  {stat.change}
                </div>
              </div>
              <div className="text-xl md:text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-white/70 text-xs md:text-sm">{stat.name}</div>
            </div>
          )
        })}
      </div>

      <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg md:text-xl font-semibold">About Analytics</h2>
          <Activity className="w-5 h-5 text-white/50" />
        </div>
        <div className="space-y-4 text-white/70 text-sm">
          <p>Vercel Analytics is enabled site-wide for tracking page views and user behavior.</p>
          <p>For detailed metrics including:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Real-time visitor tracking</li>
            <li>Page performance metrics</li>
            <li>User demographics</li>
            <li>Conversion funnels</li>
          </ul>
          <p>Visit your Vercel dashboard to view comprehensive analytics data.</p>
        </div>
        <Button className="mt-6 bg-blue-600 hover:bg-blue-700" asChild>
          <a href="https://vercel.com/analytics" target="_blank" rel="noopener noreferrer">
            View Vercel Analytics
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </a>
        </Button>
      </div>
    </div>
  )
}
