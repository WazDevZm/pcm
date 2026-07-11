import { FRONTEND_ONLY } from './config'
import { BackendError } from './backend-utils'

/**
 * Middleware functions for API routes
 */

export function requireBackendEnabled() {
  if (FRONTEND_ONLY) {
    throw new BackendError(
      'Backend is disabled. This feature is not available in frontend-only mode.',
      503,
      'BACKEND_DISABLED'
    )
  }
}

export function requireAuthenticated(userId?: string) {
  if (!userId) {
    throw new BackendError(
      'Authentication required',
      401,
      'AUTH_REQUIRED'
    )
  }
}

export function requireRole(userId: string, allowedRoles: string[]) {
  requireAuthenticated(userId)
  // Role checking would be implemented here based on user profile
  // This is a placeholder for role-based access control
}

export function rateLimitCheck(identifier: string, limit: number = 100) {
  // Placeholder for rate limiting
  // In production, this would use Redis or similar
  return true
}
