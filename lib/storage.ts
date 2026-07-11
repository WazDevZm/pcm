import { FRONTEND_ONLY } from './config'
import { supabase } from './supabase'

const BUCKET = 'media'

/** Local preview URL in frontend-only mode */
export async function uploadImage(file: File, _folder: string): Promise<string> {
  if (FRONTEND_ONLY || !supabase) {
    return URL.createObjectURL(file)
  }

  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${_folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export function getStorageUrl(path: string): string {
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path
  }
  if (!supabase) return path
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
