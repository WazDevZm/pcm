'use server'

import { uploadImage } from '@/lib/storage'

export async function uploadFileAction(file: File, path: string) {
  return await uploadImage(file, path)
}
