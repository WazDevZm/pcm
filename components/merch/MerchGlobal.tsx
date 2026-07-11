'use client'

import { MerchCartProvider } from './MerchCartProvider'
import { MerchCartSheet } from './MerchCartSheet'

export function MerchGlobal({ children }: { children: React.ReactNode }) {
  return (
    <MerchCartProvider>
      {children}
      <MerchCartSheet />
    </MerchCartProvider>
  )
}
