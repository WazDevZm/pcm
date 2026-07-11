'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { forwardRef, useEffect, useState, type ButtonHTMLAttributes } from 'react'
import {
  Menu,
  ChevronDown,
  LogIn,
  Home,
  ShoppingBag,
  Users,
  Heart,
  Compass,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { OptimizedImage } from '@/components/ui/optimized-image'
import { MerchCartButton } from '@/components/merch/MerchCartSheet'
import { useAuth } from '@/components/auth/AuthProvider'
import { FRONTEND_ONLY } from '@/lib/config'
import { DEFAULT_BANDS } from '@/lib/bands-data'
import { cn } from '@/lib/utils'

const bandLinks = DEFAULT_BANDS.map((b) => ({
  name: b.name,
  href: `/bands/${b.slug}`,
}))

const navGroups = {
  bands: {
    label: 'Bands',
    icon: Users,
    description: 'Committees & ministry bands',
    featured: [
      { name: 'All bands', href: '/bands', description: 'Browse every band' },
      { name: 'Committees overview', href: '/committees', description: 'Leadership & structure' },
    ],
    items: bandLinks,
  },
  ministry: {
    label: 'Ministry',
    icon: Heart,
    description: 'Serve, grow & connect',
    featured: [] as { name: string; href: string; description?: string }[],
    items: [
      { name: 'Events', href: '/events' },
      { name: 'Programs', href: '/programs' },
      { name: 'Support & volunteer', href: '/support' },
      { name: 'Counseling', href: '/counseling' },
      { name: 'Prayer request', href: '/prayer-request' },
    ],
  },
  discover: {
    label: 'Discover',
    icon: Compass,
    description: 'Stories, media & resources',
    featured: [] as { name: string; href: string; description?: string }[],
    items: [
      { name: 'News', href: '/news' },
      { name: 'Gallery', href: '/gallery' },
      { name: 'Resources', href: '/resources' },
      { name: 'Magazines', href: '/magazines' },
    ],
  },
} as const

type NavGroupKey = keyof typeof navGroups

const navLinkClass = (active?: boolean) =>
  cn(
    'inline-flex h-9 shrink-0 items-center rounded-lg px-3 text-sm font-medium transition-colors',
    'text-white/80 hover:text-white hover:bg-white/10',
    active && 'bg-white/15 text-white shadow-sm ring-1 ring-white/10'
  )

const NavTrigger = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    label: string
    active?: boolean
    open?: boolean
  }
>(({ label, active, open, className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(navLinkClass(active), 'gap-1.5', className)}
    aria-expanded={open}
    {...props}
  >
    {label}
    <ChevronDown
      className={cn(
        'h-3.5 w-3.5 opacity-60 transition-transform duration-200',
        open && 'rotate-180 opacity-90'
      )}
    />
  </button>
))
NavTrigger.displayName = 'NavTrigger'

const flyoutPanelClass =
  'z-[300] w-[min(100vw-2rem,17rem)] rounded-xl border border-white/10 bg-[#121820]/95 p-0 shadow-2xl shadow-black/40 backdrop-blur-xl'

function NavFlyoutLink({
  href,
  name,
  description,
  active,
  onNavigate,
}: {
  href: string
  name: string
  description?: string
  active: boolean
  onNavigate?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        'group flex flex-col gap-0.5 rounded-lg px-3 py-2.5 transition-colors',
        active
          ? 'bg-white/12 text-white ring-1 ring-white/15'
          : 'text-white/85 hover:bg-white/10 hover:text-white'
      )}
    >
      <span className="text-sm font-medium leading-tight">{name}</span>
      {description && (
        <span className="text-[11px] leading-snug text-white/45 group-hover:text-white/55">
          {description}
        </span>
      )}
    </Link>
  )
}

function NavFlyout({
  groupKey,
  active,
}: {
  groupKey: NavGroupKey
  active: boolean
}) {
  const pathname = usePathname()
  const group = navGroups[groupKey]
  const Icon = group.icon
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const isLinkActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <NavTrigger label={group.label} active={active} open={open} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={10}
        collisionPadding={12}
        className={flyoutPanelClass}
      >
        <div className="border-b border-white/10 px-3.5 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/10">
              <Icon className="h-4 w-4 text-white/90" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">{group.label}</p>
              <p className="text-[11px] text-white/45 leading-tight">{group.description}</p>
            </div>
          </div>
        </div>

        <div className="p-1.5 max-h-[min(60vh,320px)] overflow-y-auto">
          {group.featured.length > 0 && (
            <div className="space-y-0.5 mb-1">
              {group.featured.map((item) => (
                <NavFlyoutLink
                  key={item.href}
                  href={item.href}
                  name={item.name}
                  description={item.description}
                  active={isLinkActive(item.href)}
                  onNavigate={() => setOpen(false)}
                />
              ))}
            </div>
          )}

          {group.featured.length > 0 && group.items.length > 0 && (
            <div className="my-1.5 border-t border-white/10" />
          )}

          {group.featured.length > 0 && group.items.length > 0 && (
            <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/35">
              {groupKey === 'bands' ? 'Bands' : 'More'}
            </p>
          )}

          <div className="space-y-0.5">
            {group.items.map((item) => (
              <NavFlyoutLink
                key={item.href}
                href={item.href}
                name={item.name}
                active={isLinkActive(item.href)}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function DesktopNav() {
  const pathname = usePathname()

  const isBandsActive = pathname.startsWith('/bands') || pathname.startsWith('/committees')
  const isMinistryActive = ['/events', '/programs', '/support', '/counseling', '/prayer-request'].some(
    (p) => pathname.startsWith(p)
  )
  const isDiscoverActive = ['/news', '/gallery', '/resources', '/magazines'].some((p) =>
    pathname.startsWith(p)
  )
  const isMerchActive = pathname.startsWith('/merch')

  return (
    <div className="flex items-center justify-center gap-0.5 rounded-xl bg-white/[0.04] p-1 ring-1 ring-white/[0.08]">
      <NavFlyout groupKey="bands" active={isBandsActive} />
      <NavFlyout groupKey="ministry" active={isMinistryActive} />
      <NavFlyout groupKey="discover" active={isDiscoverActive} />
      <Link href="/merch" className={navLinkClass(isMerchActive)}>
        Merch
      </Link>
    </div>
  )
}

function MobileNavAccordion({ onNavigate }: { onNavigate: () => void }) {
  const pathname = usePathname()

  const isLinkActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <Accordion type="multiple" className="w-full px-1">
      {(Object.keys(navGroups) as NavGroupKey[]).map((key) => {
        const group = navGroups[key]
        const Icon = group.icon
        const allItems = [...group.featured, ...group.items]

        return (
          <AccordionItem key={key} value={key} className="border-white/10">
            <AccordionTrigger className="rounded-lg px-3 py-3 text-[15px] font-medium text-white/90 hover:bg-white/5 hover:no-underline [&[data-state=open]]:bg-white/5">
              <span className="flex items-center gap-2.5">
                <Icon className="h-4 w-4 text-white/50" />
                {group.label}
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-2 pt-0">
              <div className="space-y-0.5 pl-2">
                {allItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      'block rounded-lg px-3 py-2.5 text-sm transition-colors',
                      isLinkActive(item.href)
                        ? 'bg-white/12 text-white font-medium'
                        : 'text-white/75 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

export function SiteNav({ variant = 'default' }: { variant?: 'default' | 'minimal' }) {
  const pathname = usePathname()
  const { user, profile } = useAuth()
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    setSheetOpen(false)
  }, [pathname])

  const closeSheet = () => setSheetOpen(false)
  const isMerchActive = pathname.startsWith('/merch')

  if (variant === 'minimal') {
    return (
      <header className="relative z-[100] w-full">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <OptimizedImage
              src="/logo.png"
              alt="CBU SDA PCM"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full"
              objectFit="contain"
              priority
            />
            <span className="hidden sm:inline text-sm font-semibold text-white">CBU SDA PCM</span>
          </Link>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full border-white/20 text-white bg-transparent hover:bg-white/10"
          >
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-[100] w-full bg-transparent">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 min-w-0 mr-1 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          <OptimizedImage
            src="/logo.png"
            alt="CBU SDA PCM"
            width={38}
            height={38}
            className="h-[38px] w-[38px] shrink-0 rounded-full"
            objectFit="contain"
            priority
          />
          <div className="hidden lg:block min-w-0">
            <span className="block text-sm font-semibold text-white leading-tight truncate">
              CBU SDA PCM
            </span>
            <span className="block text-[10px] text-white/45 leading-tight truncate tracking-wide">
              Campus Ministries
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex flex-1 items-center justify-center min-w-0" aria-label="Main">
          <div className="inline-flex items-center justify-center gap-0.5 rounded-2xl bg-white/[0.06] p-1.5 ring-1 ring-white/[0.12] backdrop-blur-xl shadow-lg">
            <DesktopNav />
          </div>
        </nav>

        <div className="flex items-center gap-1 sm:gap-1.5 ml-auto shrink-0">
          <MerchCartButton className="relative flex h-9 w-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors" />

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="hidden md:inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                <LogIn className="h-4 w-4 shrink-0" />
                <span className="hidden lg:inline max-w-[80px] truncate">Account</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-52 rounded-xl border-white/10 bg-[#121820]/95 text-white backdrop-blur-xl"
            >
              <DropdownMenuLabel className="text-white/45 font-normal text-xs px-2">
                Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              {FRONTEND_ONLY ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer rounded-md focus:bg-white/10">
                      Admin dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/band-admin" className="cursor-pointer rounded-md focus:bg-white/10">
                      Band admin
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : user ? (
                <>
                  {(profile?.role === 'admin' || profile?.role === 'leader') && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer rounded-md focus:bg-white/10">
                        Admin dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/band-admin" className="cursor-pointer rounded-md focus:bg-white/10">
                      My band
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/login" className="cursor-pointer rounded-md focus:bg-white/10">
                    Member login
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            asChild
            size="sm"
            className="hidden sm:inline-flex h-9 rounded-lg bg-white text-[#0B0F12] hover:bg-white/90 font-semibold px-4 shrink-0 shadow-sm"
          >
            <Link href="/support">Get involved</Link>
          </Button>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-full sm:max-w-[22rem] bg-[#0B0F12] border-white/10 text-white p-0 flex flex-col gap-0"
            >
              <SheetHeader className="border-b border-white/10 px-4 py-4 text-left space-y-3">
                <SheetTitle className="text-white flex items-center gap-2.5 text-base">
                  <OptimizedImage
                    src="/logo.png"
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full"
                    objectFit="contain"
                  />
                  CBU SDA PCM
                </SheetTitle>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/"
                    onClick={closeSheet}
                    className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
                  >
                    <Home className="h-4 w-4 opacity-70" />
                    Home
                  </Link>
                  <Link
                    href="/merch"
                    onClick={closeSheet}
                    className={cn(
                      'flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors',
                      isMerchActive
                        ? 'border-white/20 bg-white/15 text-white'
                        : 'border-white/10 bg-white/5 text-white/90 hover:bg-white/10'
                    )}
                  >
                    <ShoppingBag className="h-4 w-4 opacity-70" />
                    Merch
                  </Link>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto py-2">
                <MobileNavAccordion onNavigate={closeSheet} />
              </div>

              <div className="border-t border-white/10 p-4 space-y-2 bg-[#0B0F12]">
                <Button
                  asChild
                  className="w-full rounded-lg bg-white text-[#0B0F12] hover:bg-white/90 font-semibold h-11"
                >
                  <Link href="/support" onClick={closeSheet}>
                    Get involved
                  </Link>
                </Button>
                {FRONTEND_ONLY ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-lg border-white/15 bg-transparent text-white hover:bg-white/10 h-10"
                    >
                      <Link href="/admin" onClick={closeSheet}>
                        Admin
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-lg border-white/15 bg-transparent text-white hover:bg-white/10 h-10"
                    >
                      <Link href="/band-admin" onClick={closeSheet}>
                        Band admin
                      </Link>
                    </Button>
                  </div>
                ) : !user ? (
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-lg border-white/15 bg-transparent text-white hover:bg-white/10 h-10"
                  >
                    <Link href="/login" onClick={closeSheet}>
                      Member login
                    </Link>
                  </Button>
                ) : null}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
