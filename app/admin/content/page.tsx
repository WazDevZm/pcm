"use client"

import { useEffect, useState } from 'react'
import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar, User, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getPosts } from '@/lib/database'
import type { Post, User as UserType } from '@/lib/supabase'

type PostWithAuthor = Post & { author: Pick<UserType, 'name' | 'email'> }

export default function ContentDashboard() {
  const [posts, setPosts] = useState<PostWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { value: 'all', label: 'All Posts' },
    { value: 'testimony', label: 'Testimonies' },
    { value: 'news', label: 'News' },
    { value: 'announcement', label: 'Announcements' },
    { value: 'ministry', label: 'Ministry Updates' }
  ]

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await getPosts()
        setPosts(data)
      } catch (error) {
        console.error('Error loading posts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'testimony': return 'bg-blue-500/20 text-blue-300 ring-blue-500/30'
      case 'news': return 'bg-green-500/20 text-green-300 ring-green-500/30'
      case 'announcement': return 'bg-yellow-500/20 text-yellow-300 ring-yellow-500/30'
      case 'ministry': return 'bg-purple-500/20 text-purple-300 ring-purple-500/30'
      default: return 'bg-gray-500/20 text-gray-300 ring-gray-500/30'
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Content Management</h1>
          <p className="text-white/70 text-sm md:text-base">Manage posts, testimonies, news, and announcements</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 self-start sm:self-auto">
          <Link href="/admin/content/new">
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto pl-10 pr-8 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
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
          <div className="text-xl md:text-2xl font-bold">{posts.length}</div>
          <div className="text-white/70 text-xs md:text-sm">Total Posts</div>
        </div>
        <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-4">
          <div className="text-xl md:text-2xl font-bold">{posts.filter(p => p.category === 'testimony').length}</div>
          <div className="text-white/70 text-xs md:text-sm">Testimonies</div>
        </div>
        <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-4">
          <div className="text-xl md:text-2xl font-bold">{posts.filter(p => p.category === 'news').length}</div>
          <div className="text-white/70 text-xs md:text-sm">News Articles</div>
        </div>
        <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-4">
          <div className="text-xl md:text-2xl font-bold">{posts.filter(p => p.category === 'announcement').length}</div>
          <div className="text-white/70 text-xs md:text-sm">Announcements</div>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white/5 ring-1 ring-white/10 rounded-lg overflow-hidden">
        <div className="p-4 md:p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold">All Posts ({filteredPosts.length})</h2>
        </div>
        
        <div className="divide-y divide-white/10">
          {filteredPosts.map((post) => (
            <div key={post.id} className="p-4 md:p-6 hover:bg-white/5 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-base md:text-lg font-semibold text-white">{post.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ring-1 ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                  </div>
                  
                  <p className="text-white/70 mb-3 line-clamp-2 text-sm">{post.excerpt}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-sm text-white/50">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{post.author?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{new Date(post.published_at).toLocaleDateString()}</span>
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
          
          {filteredPosts.length === 0 && (
            <div className="p-8 md:p-12 text-center">
              <div className="text-white/50 mb-4">No posts found</div>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/admin/content/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Post
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}