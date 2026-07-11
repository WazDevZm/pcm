import { notFound } from 'next/navigation'
import { MerchProductDetail } from '@/components/merch/MerchProductDetail'
import { getProductBySlug, MERCH_PRODUCTS } from '@/lib/merch-data'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return MERCH_PRODUCTS.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: Props) {
  const product = getProductBySlug(params.slug)
  if (!product) return { title: 'Product not found' }
  return {
    title: `${product.name} | PCM Merch Store`,
    description: product.description,
  }
}

export default function MerchProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug)
  if (!product) notFound()
  return <MerchProductDetail product={product} />
}
