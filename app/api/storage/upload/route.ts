import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const path = formData.get('path') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!path) {
      return NextResponse.json({ error: 'No path provided' }, { status: 400 })
    }

    const url = await uploadImage(file, path)
    
    return NextResponse.json({ url, success: true })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to upload file' 
    }, { status: 500 })
  }
}
