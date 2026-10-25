import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PCM Merch Store | The Copperbelt University SDA Public Campus Ministries',
  description:
    'Order official PCM branded t-shirts, bottles, pens, and more. Prices in Zambian Kwacha (ZMW).',
}

export default function MerchLayout({ children }: { children: React.ReactNode }) {
  return children
}
