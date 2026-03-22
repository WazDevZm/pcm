"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Eye, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createPost } from '@/lib/database'
import { useAuth } from '@/components/auth/AuthProvider'

export default function NewPostPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'news' as 'testimony' | 'news' | 'announcement' | 'ministry',
    image_url: ''
  })

  const categories = [
    { value: 'news', label: 'News Article' },
    { value: 'testimony', label: 'Testimony' },
    { value: 'announcement', label: 'Announcement' },
    { value: 'ministry', label: 'Ministry Update' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData(prev => ({ ...prev, image_url: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setFormData(prev => ({ ...prev, image_url: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      await createPost({
        ...formData,
        author_id: user.id,
        published_at: new Date().toISOString()
      })
      
      router.push('/admin/content')
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Error creating post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = () => {
    // Open preview in new tab/modal
    console.log('Preview:', formData)
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="bg-black/40 ring-1 ring-white/20 backdrop-blur border-0 text-white hover:bg-black/50 self-start"
          >
            <Link href="/admin/content">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Create New Post</h1>
            <p className="text-white/70 text-sm">Share news, testimonies, and ministry updates</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            type="button"
            onClick={handlePreview}
            variant="outline"
            className="bg-black/40 ring-1 ring-white/20 backdrop-blur border-0 text-white hover:bg-black/50"
          >
            <Eye className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Preview</span>
          </Button>
          <Button
            form="post-form"
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      <form id="post-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-6">
            <label htmlFor="title" className="block text-sm font-medium text-white/90 mb-2">
              Post Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-xl font-semibold"
              placeholder="Enter post title..."
            />
          </div>

          {/* Excerpt */}
          <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-6">
            <label htmlFor="excerpt" className="block text-sm font-medium text-white/90 mb-2">
              Excerpt *
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              placeholder="Brief summary of the post (will be shown in previews)..."
            />
            <div className="text-right text-sm text-white/50 mt-1">
              {formData.excerpt.length}/200 characters
            </div>
          </div>

          {/* Content */}
          <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-6">
            <label htmlFor="content" className="block text-sm font-medium text-white/90 mb-2">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={15}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              placeholder="Write your post content here..."
            />
            <div className="text-right text-sm text-white/50 mt-1">
              {formData.content.length} characters
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category */}
          <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-6">
            <label htmlFor="category" className="block text-sm font-medium text-white/90 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value} className="bg-gray-800">
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Image */}
          <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-6">
            <label className="block text-sm font-medium text-white/90 mb-2">
              Featured Image
            </label>
            
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 text-white/50 mx-auto mb-2" />
                <p className="text-white/70 text-sm mb-2">Upload an image</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  variant="outline"
                  size="sm"
                  className="bg-black/40 ring-1 ring-white/20 backdrop-blur border-0 text-white hover:bg-black/50"
                >
                  Choose File
                </Button>
              </div>
            )}
          </div>

          {/* Publishing Options */}
          <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-6">
            <h3 className="text-sm font-medium text-white/90 mb-4">Publishing Options</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Status</span>
                <span className="text-green-400 text-sm">Ready to Publish</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Visibility</span>
                <span className="text-white/90 text-sm">Public</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white/70 text-sm">Publish Date</span>
                <span className="text-white/90 text-sm">Immediately</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-500/10 ring-1 ring-blue-500/20 rounded-lg p-6">
            <h3 className="text-sm font-medium text-blue-300 mb-2">Writing Tips</h3>
            <ul className="text-blue-200/80 text-sm space-y-1">
              <li>• Keep titles clear and engaging</li>
              <li>• Write compelling excerpts</li>
              <li>• Use personal stories in testimonies</li>
              <li>• Include relevant scripture references</li>
              <li>• Proofread before publishing</li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  )
}