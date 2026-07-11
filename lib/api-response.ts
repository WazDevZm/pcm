import { NextResponse } from 'next/server'
import { BackendError, formatApiError, formatApiResponse, handleDatabaseError } from './backend-utils'

/**
 * Standardized API response handlers
 */

export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
) {
  return NextResponse.json(
    formatApiResponse(data, message),
    { status }
  )
}

export function errorResponse(
  error: BackendError | Error,
  status?: number
) {
  if (error instanceof BackendError) {
    return NextResponse.json(
      formatApiError(error),
      { status: error.statusCode }
    )
  }
  
  return NextResponse.json(
    formatApiError(error),
    { status: status || 500 }
  )
}

export function notFoundResponse(message: string = 'Resource not found') {
  return NextResponse.json(
    {
      success: false,
      error: message,
      code: 'NOT_FOUND',
      statusCode: 404
    },
    { status: 404 }
  )
}

export function unauthorizedResponse(message: string = 'Unauthorized') {
  return NextResponse.json(
    {
      success: false,
      error: message,
      code: 'UNAUTHORIZED',
      statusCode: 401
    },
    { status: 401 }
  )
}

export function badRequestResponse(message: string = 'Bad request') {
  return NextResponse.json(
    {
      success: false,
      error: message,
      code: 'BAD_REQUEST',
      statusCode: 400
    },
    { status: 400 }
  )
}

export async function handleApiCall<T>(
  handler: () => Promise<T>
): Promise<NextResponse> {
  try {
    const result = await handler()
    return successResponse(result)
  } catch (error) {
    handleDatabaseError(error)
    return errorResponse(error as Error)
  }
}
