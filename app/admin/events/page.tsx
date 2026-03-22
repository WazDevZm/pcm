"use client"

import { useEffect, useState } from 'react'
import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar, MapPin, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getEvents } from '@/lib/database'
import type { Event } from '@/lib/supabase'

export default function EventsDashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { value: 'all', label: 'All Events' },
    { value: 'worship', label: 'Worship' },
    { value: 'outreach', label: 'Outreach' },
    { value: 'study', label: 'Bible Study' },
    { value: 'fellowship', label: 'Fellowship' },
    { value: 'special', label: 'Special Events' }
  ]

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getEvents()
        setEvents(data)
      } catch (error) {
        console.error('Error loading events:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'worship': return 'bg-purple-500/20 text-purple-300 ring-purple-500/30'
      case 'outreach': return 'bg-green-500/20 text-green-300 ring-green-500/30'
      case 'study': return 'bg-blue-500/20 text-blue-300 ring-blue-500/30'
      case 'fellowship': return 'bg-yellow-500/20 text-yellow-300 ring-yellow-500/30'
      case 'special': return 'bg-red-500/20 text-red-300 ring-red-500/30'
      default: return 'bg-gray-500/20 text-gray-300 ring-gray-500/30'
    }
  }

  if (loading) {
    return (
      <div className="p-8">
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Events Management</h1>
          <p className="text-white/70 text-sm md:text-base">Manage worship services, outreach programs, and special events</p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700 self-start sm:self-auto">
          <Link href="/admin/events/new">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-500/50"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto pl-10 pr-8 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 appearance-none"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value} className="bg-gray-800">
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-4">
          <div className="text-xl md:text-2xl font-bold">{events.length}</div>
          <div className="text-white/70 text-xs md:text-sm">Total Events</div>
        </div>
        <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-4">
          <div className="text-xl md:text-2xl font-bold">{events.filter(e => new Date(e.date) > new Date()).length}</div>
          <div className="text-white/70 text-xs md:text-sm">Upcoming</div>
        </div>
        <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-4">
          <div className="text-xl md:text-2xl font-bold">{events.reduce((sum, e) => sum + e.current_attendees, 0)}</div>
          <div className="text-white/70 text-xs md:text-sm">Total Attendees</div>
        </div>
        <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-4">
          <div className="text-xl md:text-2xl font-bold">{events.filter(e => e.category === 'worship').length}</div>
          <div className="text-white/70 text-xs md:text-sm">Worship Services</div>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white/5 ring-1 ring-white/10 rounded-lg overflow-hidden">
        <div className="p-4 md:p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold">All Events ({filteredEvents.length})</h2>
        </div>
        
        <div className="divide-y divide-white/10">
          {filteredEvents.map((event) => (
            <div key={event.id} className="p-4 md:p-6 hover:bg-white/5 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-base md:text-lg font-semibold text-white">{event.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ring-1 ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                  </div>
                  
                  <p className="text-white/70 mb-3 line-clamp-2 text-sm">{event.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-sm text-white/50">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="truncate max-w-[120px] md:max-w-none">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{event.current_attendees} attendees</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 md:gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-black/40 ring-1 ring-white/20 backdrop-blur border-0 text-white hover:bg-black/50 p-2"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-black/40 ring-1 ring-white/20 backdrop-blur border-0 text-white hover:bg-black/50 p-2"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-red-500/20 ring-1 ring-red-500/30 backdrop-blur border-0 text-red-200 hover:bg-red-500/30 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredEvents.length === 0 && (
            <div className="p-8 md:p-12 text-center">
              <div className="text-white/50 mb-4">No events found</div>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/admin/events/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Event
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}