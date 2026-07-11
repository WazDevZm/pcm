import { cn } from '@/lib/utils'
import { contentSectionClass } from '@/lib/site-theme'
import { HomeFooter } from '@/components/home/HomeFooter'

export function MinistryContent({
  children,
  className,
  showFooter = true,
}: {
  children: React.ReactNode
  className?: string
  showFooter?: boolean
}) {
  return (
    <>
      <section className={cn(contentSectionClass, className)}>{children}</section>
      {showFooter && <HomeFooter />}
    </>
  )
}
