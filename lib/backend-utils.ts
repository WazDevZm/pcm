import { FRONTEND_ONLY } from './config'

/**
 * Backend utility functions for consistent error handling and response formatting
 */

export class BackendError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'BackendError'
  }
}

export function isBackendEnabled(): boolean {
  return !FRONTEND_ONLY
}

export function handleDatabaseError(error: unknown): never {
  if (error instanceof BackendError) {
    throw error
  }
  
  if (error instanceof Error) {
    throw new BackendError(error.message, 500, 'DATABASE_ERROR')
  }
  
  throw new BackendError('An unknown error occurred', 500, 'UNKNOWN_ERROR')
}

export function formatApiResponse<T>(
  data: T,
  message?: string
) {
  return {
    success: true,
    data,
    ...(message && { message })
  }
}

export function formatApiError(
  error: BackendError | Error
) {
  if (error instanceof BackendError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      statusCode: error.statusCode
    }
  }
  
  return {
    success: false,
    error: error.message,
    statusCode: 500
  }
}

export function validateRequiredFields<T extends Record<string, any>>(
  data: T,
  requiredFields: (keyof T)[]
): void {
  const missingFields = requiredFields.filter(
    field => !data[field] || (typeof data[field] === 'string' && data[field].trim() === '')
  )
  
  if (missingFields.length > 0) {
    throw new BackendError(
      `Missing required fields: ${missingFields.join(', ')}`,
      400,
      'MISSING_FIELDS'
    )
  }
}

export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ')
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-()]+$/
  return phoneRegex.test(phone)
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString()
}

export function formatDisplayDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
