"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Eye, EyeOff, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { createPost } from '@/lib/database'
import { useAuth } from '@/components/auth/AuthProvider'
import { uploadMedia } from '@/lib/data/admin'
import { toast } from 'sonner'

export default function NewPostPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file')
      return
    }
    setUploading(true)
    try {
      const url = await uploadMedia(file, 'posts')
      setImagePreview(url)
      setFormData(prev => ({ ...prev, image_url: url }))
      toast.success('Image uploaded')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? `Upload failed: ${err.message}` : 'Upload failed')
    } finally {
      setUploading(false)
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
        image_url: formData.image_url || undefined,
        author_id: user.id,
        published_at: new Date().toISOString()
      })
      
      router.push('/admin/content')
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error(error instanceof Error ? error.message : 'Error creating post. Please try again.')
    } finally {
      setLoading(false)
    }
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
            className="bg-white ring-1 ring-border backdrop-blur border-0 text-ink hover:bg-canvas self-start"
          >
            <Link href="/admin/content">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Create New Post</h1>
            <p className="text-muted-foreground text-sm">Share news, testimonies, and ministry updates</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            type="button"
            onClick={() => setShowPreview(v => !v)}
            variant="outline"
            aria-pressed={showPreview}
            className="bg-white ring-1 ring-border backdrop-blur border-0 text-ink hover:bg-canvas"
          >
            {showPreview ? <EyeOff className="w-4 h-4 sm:mr-2" /> : <Eye className="w-4 h-4 sm:mr-2" />}
            <span className="hidden sm:inline">{showPreview ? 'Hide Preview' : 'Preview'}</span>
          </Button>
          <Button
            form="post-form"
            type="submit"
            disabled={loading || uploading}
            className="bg-navy hover:bg-navy-deep"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      {showPreview && (
        <article className="mb-8 bg-white ring-1 ring-border rounded-lg overflow-hidden">
          {formData.image_url && (
            <img src={formData.image_url} alt="" className="w-full max-h-80 object-cover" />
          )}
          <div className="p-6 md:p-8">
            <span className="inline-block px-2 py-1 mb-3 rounded-full text-xs font-medium bg-muted text-ink/85 capitalize">
              {formData.category}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{formData.title || 'Untitled post'}</h2>
            {formData.excerpt && <p className="text-muted-foreground mb-6">{formData.excerpt}</p>}
            <div className="text-ink whitespace-pre-wrap leading-relaxed">
              {formData.content || <span className="text-muted-foreground">No content yet.</span>}
            </div>
          </div>
        </article>
      )}

      <form id="post-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white ring-1 ring-border rounded-lg p-6">
            <label htmlFor="title" className="block text-sm font-medium text-ink mb-2">
              Post Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-ink placeholder:text-[#8a93a3] focus:outline-none focus:ring-2 focus:ring-navy/20 text-xl font-semibold"
              placeholder="Enter post title..."
            />
          </div>

          {/* Excerpt */}
          <div className="bg-white ring-1 ring-border rounded-lg p-6">
            <label htmlFor="excerpt" className="block text-sm font-medium text-ink mb-2">
              Excerpt *
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-ink placeholder:text-[#8a93a3] focus:outline-none focus:ring-2 focus:ring-navy/20 resize-none"
              placeholder="Brief summary of the post (will be shown in previews)..."
            />
            <div className="text-right text-sm text-muted-foreground mt-1">
              {formData.excerpt.length}/200 characters
            </div>
          </div>

          {/* Content */}
          <div className="bg-white ring-1 ring-border rounded-lg p-6">
            <label htmlFor="content" className="block text-sm font-medium text-ink mb-2">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={15}
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-ink placeholder:text-[#8a93a3] focus:outline-none focus:ring-2 focus:ring-navy/20 resize-none"
              placeholder="Write your post content here..."
            />
            <div className="text-right text-sm text-muted-foreground mt-1">
              {formData.content.length} characters
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Category */}
          <div className="bg-white ring-1 ring-border rounded-lg p-6">
            <label htmlFor="category" className="block text-sm font-medium text-ink mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-navy/20"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value} className="bg-white">
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Featured Image */}
          <div className="bg-white ring-1 ring-border rounded-lg p-6">
            <label className="block text-sm font-medium text-ink mb-2">
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
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm mb-2">{uploading ? 'Uploading...' : 'Upload an image'}</p>
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
                  disabled={uploading}
                  variant="outline"
                  size="sm"
                  className="bg-white ring-1 ring-border backdrop-blur border-0 text-ink hover:bg-canvas"
                >
                  Choose File
                </Button>
              </div>
            )}
          </div>

          {/* Publishing Options */}
          <div className="bg-white ring-1 ring-border rounded-lg p-6">
            <h3 className="text-sm font-medium text-ink mb-4">Publishing Options</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Status</span>
                <span className="text-emerald-700 text-sm">Ready to Publish</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Visibility</span>
                <span className="text-ink text-sm">Public</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Publish Date</span>
                <span className="text-ink text-sm">Immediately</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-navy-soft ring-1 ring-navy/20 rounded-lg p-6">
            <h3 className="text-sm font-medium text-navy mb-2">Writing Tips</h3>
            <ul className="text-navy text-sm space-y-1">
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