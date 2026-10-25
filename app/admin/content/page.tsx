"use client"

import { useEffect, useState } from 'react'
import { Plus, Search, Filter, Trash2, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { listPosts, deletePost } from '@/lib/data/admin'
import { toast } from 'sonner'
import type { AdminPost } from '@/lib/data/admin'

export default function ContentDashboard() {
  const [posts, setPosts] = useState<AdminPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
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
    listPosts()
      .then(setPosts)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Could not load posts.'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeletingId(id)
    try {
      await deletePost(id)
      setPosts((prev) => prev.filter((x) => x.id !== id))
      toast.success('Post deleted')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Could not delete post')
    } finally {
      setDeletingId(null)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'testimony': return 'bg-navy-soft text-navy ring-navy/20'
      case 'news': return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      case 'announcement': return 'bg-amber-50 text-amber-700 ring-amber-200'
      case 'ministry': return 'bg-violet-50 text-violet-700 ring-violet-200'
      default: return 'bg-muted text-muted-foreground ring-border'
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

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Content Management</h1>
          <p className="text-muted-foreground text-sm md:text-base">Manage posts, testimonies, news, and announcements</p>
        </div>
        <Button asChild className="bg-navy hover:bg-navy-deep self-start sm:self-auto">
          <Link href="/admin/content/new">
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Link>
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 ring-1 ring-red-200 rounded-lg text-sm text-red-700">
          Could not load posts: {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-ink placeholder:text-[#8a93a3] focus:outline-none focus:ring-2 focus:ring-navy/20"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto pl-10 pr-8 py-2 bg-muted border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-navy/20 appearance-none"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value} className="bg-white">
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        <div className="bg-white ring-1 ring-border rounded-lg p-4">
          <div className="text-xl md:text-2xl font-bold">{posts.length}</div>
          <div className="text-muted-foreground text-xs md:text-sm">Total Posts</div>
        </div>
        <div className="bg-white ring-1 ring-border rounded-lg p-4">
          <div className="text-xl md:text-2xl font-bold">{posts.filter(p => p.category === 'testimony').length}</div>
          <div className="text-muted-foreground text-xs md:text-sm">Testimonies</div>
        </div>
        <div className="bg-white ring-1 ring-border rounded-lg p-4">
          <div className="text-xl md:text-2xl font-bold">{posts.filter(p => p.category === 'news').length}</div>
          <div className="text-muted-foreground text-xs md:text-sm">News Articles</div>
        </div>
        <div className="bg-white ring-1 ring-border rounded-lg p-4">
          <div className="text-xl md:text-2xl font-bold">{posts.filter(p => p.category === 'announcement').length}</div>
          <div className="text-muted-foreground text-xs md:text-sm">Announcements</div>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white ring-1 ring-border rounded-lg overflow-hidden">
        <div className="p-4 md:p-6 border-b border-border">
          <h2 className="text-lg font-semibold">All Posts ({filteredPosts.length})</h2>
        </div>
        
        <div className="divide-y divide-border">
          {filteredPosts.map((post) => (
            <div key={post.id} className="p-4 md:p-6 hover:bg-canvas transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-base md:text-lg font-semibold text-ink">{post.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ring-1 ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">{post.excerpt}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-sm text-muted-foreground">
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
                    onClick={() => handleDelete(post.id, post.title)}
                    disabled={deletingId === post.id}
                    aria-label={`Delete ${post.title}`}
                    className="bg-red-50 ring-1 ring-red-200 backdrop-blur border-0 text-red-700 hover:bg-red-100 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredPosts.length === 0 && (
            <div className="p-8 md:p-12 text-center">
              <div className="text-muted-foreground mb-4">No posts found</div>
              <Button asChild className="bg-navy hover:bg-navy-deep">
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