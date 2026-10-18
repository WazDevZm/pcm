"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Upload, X, BookOpen, FileText, Video, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { createResource } from '@/lib/database'
import { useAuth } from '@/components/auth/AuthProvider'
import { toast } from 'sonner'
import { uploadMedia } from '@/lib/data/admin'

export default function NewResourcePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadedName, setUploadedName] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'bible_study' as 'bible_study' | 'sermon' | 'devotional' | 'manual',
    author: '',
    file_url: '',
    external_link: '',
    category: 'general',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced'
  })

  const resourceTypes = [
    { value: 'bible_study', label: 'Bible Study', icon: BookOpen },
    { value: 'sermon', label: 'Sermon', icon: FileText },
    { value: 'devotional', label: 'Devotional', icon: BookOpen },
    { value: 'manual', label: 'Ministry Manual', icon: Video }
  ]

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'spiritual_growth', label: 'Spiritual Growth' },
    { value: 'leadership', label: 'Leadership' },
    { value: 'outreach', label: 'Outreach' },
    { value: 'worship', label: 'Worship' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadMedia(file, 'resources')
      setFormData(prev => ({ ...prev, file_url: url }))
      setUploadedName(file.name)
      toast.success('File uploaded')
    } catch (err: unknown) {
      e.target.value = ''
      toast.error(err instanceof Error ? `Upload failed: ${err.message}` : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setUploadedName(null)
    setFormData(prev => ({ ...prev, file_url: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (!formData.file_url && !formData.external_link.trim()) {
      toast.error('Upload a file or add an external link')
      return
    }

    setLoading(true)
    try {
      await createResource({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        author: formData.author,
        file_url: formData.file_url || formData.external_link.trim(),
        category: formData.category,
        level: formData.level,
        updated_at: new Date().toISOString()
      })
      
      toast.success('Resource created successfully')
      router.push('/admin/resources')
    } catch (error) {
      console.error('Error creating resource:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create resource')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="bg-black/40 ring-1 ring-white/20 backdrop-blur border-0 text-white hover:bg-black/50 self-start"
          >
            <Link href="/admin/resources">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Add New Resource</h1>
            <p className="text-white/70 text-sm">Share Bible studies, sermons, and ministry materials</p>
          </div>
        </div>
        
        <Button
          form="resource-form"
          type="submit"
          disabled={loading || uploading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Resource'}
        </Button>
      </div>

      <form id="resource-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-6">
            <label htmlFor="title" className="block text-sm font-medium text-white/90 mb-2">
              Resource Title *
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="bg-white/10 border-white/20"
              placeholder="Enter resource title..."
            />
          </div>

          {/* Description */}
          <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-6">
            <label htmlFor="description" className="block text-sm font-medium text-white/90 mb-2">
              Description *
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="bg-white/10 border-white/20 resize-none"
              placeholder="Describe this resource..."
            />
          </div>

          {/* Author */}
          <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-6">
            <label htmlFor="author" className="block text-sm font-medium text-white/90 mb-2">
              Author/Source
            </label>
            <Input
              id="author"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className="bg-white/10 border-white/20"
              placeholder="Author name or source"
            />
          </div>

          {/* File Upload or External Link */}
          <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-6">
            <label className="block text-sm font-medium text-white/90 mb-4">
              Resource File or Link *
            </label>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-white/60 mb-2">Upload File</label>
                {uploadedName ? (
                  <div className="flex items-center justify-between gap-3 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-sm">
                    <span className="truncate">{uploadedName}</span>
                    <button type="button" onClick={removeFile} aria-label="Remove file" className="p-1 rounded-full bg-red-500 text-white hover:bg-red-600 shrink-0">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="bg-white/10 border-white/20"
                  />
                )}
                {uploading && <p className="text-xs text-white/60 mt-2">Uploading...</p>}
              </div>
              
              <div className="text-center text-white/40 text-sm">or</div>
              
              <div>
                <label className="block text-xs text-white/60 mb-2">External Link</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                  <Input
                    id="external_link"
                    name="external_link"
                    value={formData.external_link}
                    onChange={handleInputChange}
                    className="bg-white/10 border-white/20 pl-10"
                    placeholder="https://example.com/resource"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Resource Type */}
          <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-6">
            <label htmlFor="type" className="block text-sm font-medium text-white/90 mb-2">
              Resource Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {resourceTypes.map(type => (
                <option key={type.value} value={type.value} className="bg-gray-800">
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="bg-white/5 ring-1 ring-white/10 rounded-lg p-6">
            <label htmlFor="category" className="block text-sm font-medium text-white/90 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value} className="bg-gray-800">
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tips */}
          <div className="bg-blue-500/10 ring-1 ring-blue-500/20 rounded-lg p-6">
            <h3 className="text-sm font-medium text-blue-300 mb-2">Resource Guidelines</h3>
            <ul className="text-blue-200/80 text-sm space-y-1">
              <li>• Use clear, descriptive titles</li>
              <li>• Include author attribution</li>
              <li>• Provide helpful descriptions</li>
              <li>• Upload PDF or document files</li>
              <li>• Or provide external links</li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  )
}
