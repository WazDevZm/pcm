'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { forwardRef, useEffect, useState, type ButtonHTMLAttributes } from 'react'
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronRight,
  GitBranch,
  HandHeart,
  Heart,
  Image as ImageIcon,
  LayoutDashboard,
  LibraryBig,
  LogIn,
  LogOut,
  Megaphone,
  Menu,
  MessagesSquare,
  Newspaper,
  Palette,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  User,
  Users,
  type LucideIcon,
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { HavenMonogram, HavenWordmark } from '@/components/brand/HavenLogo'
import { PcmShield } from '@/components/brand/PcmShield'
import { BRAND } from '@/lib/brand'
import { MerchCartButton } from '@/components/merch/MerchCartSheet'
import { useAuth } from '@/components/auth/AuthProvider'
import { FRONTEND_ONLY } from '@/lib/config'
import { DEFAULT_BANDS } from '@/lib/bands-data'
import { cn } from '@/lib/utils'

type NavItem = { name: string; href: string; description?: string; icon?: LucideIcon }

const navGroups: Record<'bands' | 'ministry' | 'discover', { label: string; items: NavItem[] }> = {
  bands: {
    label: 'Bands',
    items: [
      { name: 'All bands', href: '/bands', description: 'Find your place to serve', icon: Users },
      ...DEFAULT_BANDS.map((b) => ({ name: b.name, href: `/bands/${b.slug}` })),
      { name: 'Committees', href: '/committees', description: 'Leadership & structure', icon: GitBranch },
    ],
  },
  ministry: {
    label: 'Ministry',
    items: [
      { name: 'Events', href: '/events', description: 'What’s coming up', icon: Calendar },
      { name: 'Programs', href: '/programs', description: 'Worship, study & fellowship', icon: Sparkles },
      { name: 'Prayer request', href: '/prayer-request', description: 'Named or anonymous', icon: Heart },
      { name: 'Counseling', href: '/counseling', description: 'Confidential pastoral care', icon: MessagesSquare },
      { name: 'Get involved', href: '/support', description: 'Volunteer & give', icon: HandHeart },
    ],
  },
  discover: {
    label: 'Discover',
    items: [
      { name: 'News & testimonies', href: '/news', icon: Newspaper },
      { name: 'Gallery', href: '/gallery', icon: ImageIcon },
      { name: 'Resources', href: '/resources', icon: BookOpen },
      { name: 'Magazines', href: '/magazines', icon: LibraryBig },
      { name: 'Posters', href: '/posters', icon: Megaphone },
    ],
  },
}

type NavGroupKey = keyof typeof navGroups

const groupPaths: Record<NavGroupKey, string[]> = {
  bands: ['/bands', '/committees'],
  ministry: ['/events', '/programs', '/support', '/counseling', '/prayer-request'],
  discover: ['/news', '/gallery', '/resources', '/magazines', '/posters'],
}

const isPathActive = (pathname: string, href: string) =>
  pathname === href || (href !== '/' && pathname.startsWith(href + '/'))

const navLinkClass = (active?: boolean) =>
  cn(
    'relative inline-flex h-10 shrink-0 items-center gap-1 rounded-full px-3.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/40',
    active ? 'text-white' : 'text-white/75 hover:text-white hover:bg-white/10',
    active &&
      'after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-gold'
  )

const NavTrigger = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { label: string; active?: boolean; open?: boolean }
>(({ label, active, open, className, ...props }, ref) => (
  <button ref={ref} type="button" className={cn(navLinkClass(active), className)} aria-expanded={open} {...props}>
    {label}
    <ChevronDown className={cn('h-3.5 w-3.5 opacity-60 transition-transform duration-200', open && 'rotate-180')} />
  </button>
))
NavTrigger.displayName = 'NavTrigger'

const panelClass =
  'z-[300] rounded-2xl border border-border bg-white p-2 text-ink shadow-[0_20px_50px_rgba(10,31,77,0.18)]'

function NavFlyout({ groupKey }: { groupKey: NavGroupKey }) {
  const pathname = usePathname()
  const group = navGroups[groupKey]
  const [open, setOpen] = useState(false)
  const active = groupPaths[groupKey].some((p) => pathname.startsWith(p))

  useEffect(() => setOpen(false), [pathname])

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <NavTrigger label={group.label} active={active} open={open} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={12} collisionPadding={12} className={cn(panelClass, 'w-72 max-h-[70vh] overflow-y-auto')}>
        {group.items.map((item) => {
          const Icon = item.icon
          const current = isPathActive(pathname, item.href)
          return (
            <DropdownMenuItem key={item.href} asChild className="p-0 focus:bg-transparent">
              <Link
                href={item.href}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-2.5 py-2 transition-colors cursor-pointer',
                  current ? 'bg-navy-soft' : 'hover:bg-canvas focus:bg-canvas'
                )}
              >
                <span
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                    Icon ? 'bg-navy-soft text-navy' : 'bg-transparent'
                  )}
                >
                  {Icon ? <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} /> : <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold leading-tight text-ink">{item.name}</span>
                  {item.description && (
                    <span className="block text-xs text-muted-foreground leading-snug mt-0.5">{item.description}</span>
                  )}
                </span>
              </Link>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function initials(name?: string | null, email?: string) {
  const src = (name || email || '?').trim()
  const parts = src.split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?'
}

function AccountMenu() {
  const { user, profile, isLeader, isPublicity, managedBands, signOut } = useAuth()

  if (!FRONTEND_ONLY && !user) {
    return (
      <Link
        href="/login"
        className="hidden md:inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
      >
        <LogIn className="h-4 w-4" />
        Sign in
      </Link>
    )
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Your account"
          className="hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-[13px] font-bold text-white hover:bg-white/20 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          {user ? initials(profile?.name, user.email) : <User className="h-4 w-4" />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className={cn(panelClass, 'w-60')}>
        {user && (
          <>
            <DropdownMenuLabel className="px-2.5 py-2">
              <span className="block text-sm font-semibold text-ink truncate">{profile?.name || 'Signed in'}</span>
              <span className="block text-xs font-normal text-muted-foreground truncate">{user.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild className="rounded-lg px-2.5 py-2 cursor-pointer">
          <Link href="/member-dashboard">
            <LayoutDashboard className="text-navy" /> My dashboard
          </Link>
        </DropdownMenuItem>
        {(FRONTEND_ONLY || isPublicity) && (
          <DropdownMenuItem asChild className="rounded-lg px-2.5 py-2 cursor-pointer">
            <Link href="/admin">
              <ShieldCheck className="text-navy" /> {isLeader || FRONTEND_ONLY ? 'Admin dashboard' : 'Website content'}
            </Link>
          </DropdownMenuItem>
        )}
        {(FRONTEND_ONLY || isPublicity) && (
          <DropdownMenuItem asChild className="rounded-lg px-2.5 py-2 cursor-pointer">
            <Link href="/studio">
              <Palette className="text-navy" /> Studio (posters)
            </Link>
          </DropdownMenuItem>
        )}
        {(FRONTEND_ONLY || isLeader || managedBands.length > 0) && (
          <DropdownMenuItem asChild className="rounded-lg px-2.5 py-2 cursor-pointer">
            <Link href={managedBands.length === 1 && !isLeader ? `/band-admin/${managedBands[0]}` : '/band-admin'}>
              <Users className="text-navy" /> {managedBands.length === 1 && !isLeader ? 'My band dashboard' : 'Band dashboards'}
            </Link>
          </DropdownMenuItem>
        )}
        {user && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => signOut()}
              className="rounded-lg px-2.5 py-2 cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="text-destructive" /> Sign out
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** App-style grouped list row (mobile: ListRow) */
function SheetRow({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const pathname = usePathname()
  const Icon = item.icon ?? Users
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-3 px-4 py-3 transition-colors',
        isPathActive(pathname, item.href) ? 'bg-navy-soft/60' : 'hover:bg-canvas'
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-soft text-navy">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-ink">{item.name}</span>
        {item.description && <span className="block text-[13px] text-muted-foreground">{item.description}</span>}
      </span>
      <ChevronRight className="h-4 w-4 text-[#8a93a3]" />
    </Link>
  )
}

function MobileSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { user, profile, isLeader, isPublicity, managedBands, signOut } = useAuth()
  const close = () => onOpenChange(false)

  const sections: { label: string; items: NavItem[] }[] = [
    { label: 'Care', items: navGroups.ministry.items.filter((i) => ['/prayer-request', '/counseling', '/support'].includes(i.href)) },
    {
      label: 'Ministry',
      items: [
        navGroups.bands.items[0],
        ...navGroups.ministry.items.filter((i) => ['/events', '/programs'].includes(i.href)),
        { name: 'Merch store', href: '/merch', description: 'Wear the message', icon: ShoppingBag },
        navGroups.bands.items[navGroups.bands.items.length - 1],
      ],
    },
    { label: 'Discover', items: navGroups.discover.items },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-sm bg-canvas border-border p-0 flex flex-col gap-0">
        <SheetHeader className="px-5 pt-5 pb-4 text-left">
          <SheetTitle className="font-serif text-2xl text-ink">Menu</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-5">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4">
            <HavenMonogram className="h-12 w-12 text-2xl" />
            <div className="min-w-0">
              <p className="font-bold text-ink truncate">
                {user ? `Hi, ${(profile?.name || 'friend').split(' ')[0]}` : `Welcome to ${BRAND.name}`}
              </p>
              <p className="text-[13px] text-muted-foreground leading-snug">
                {user ? user.email : 'Sign in to RSVP, join bands and track your requests.'}
              </p>
            </div>
          </div>

          {user ? (
            <div className="overflow-hidden rounded-2xl border border-border bg-white divide-y divide-border">
              <SheetRow item={{ name: 'My dashboard', href: '/member-dashboard', icon: LayoutDashboard }} onNavigate={close} />
              {(FRONTEND_ONLY || isPublicity) && (
                <SheetRow item={{ name: isLeader ? 'Admin dashboard' : 'Website content', href: '/admin', icon: ShieldCheck }} onNavigate={close} />
              )}
              {(FRONTEND_ONLY || isPublicity) && (
                <SheetRow item={{ name: 'Studio (posters)', href: '/studio', icon: Palette }} onNavigate={close} />
              )}
              {(FRONTEND_ONLY || isLeader || managedBands.length > 0) && (
                <SheetRow
                  item={{
                    name: managedBands.length === 1 && !isLeader ? 'My band dashboard' : 'Band dashboards',
                    href: managedBands.length === 1 && !isLeader ? `/band-admin/${managedBands[0]}` : '/band-admin',
                    icon: Users,
                  }}
                  onNavigate={close}
                />
              )}
            </div>
          ) : (
            <Button asChild size="lg" className="w-full">
              <Link href="/login" onClick={close}>
                <LogIn /> Sign in
              </Link>
            </Button>
          )}

          {sections.map((section) => (
            <div key={section.label}>
              <p className="eyebrow text-muted-foreground px-1 mb-2">{section.label}</p>
              <div className="overflow-hidden rounded-2xl border border-border bg-white divide-y divide-border">
                {section.items.map((item) => (
                  <SheetRow key={item.href} item={item} onNavigate={close} />
                ))}
              </div>
            </div>
          ))}

          {user && (
            <Button
              variant="destructive"
              size="lg"
              className="w-full"
              onClick={() => {
                close()
                signOut()
              }}
            >
              <LogOut /> Sign out
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function Brand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 shrink-0 min-w-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      aria-label={`${BRAND.name} home`}
    >
      <HavenWordmark tone="onDark" className="text-[28px]" />
      <span className="h-7 w-px bg-white/25" aria-hidden />
      <PcmShield className="h-9" priority />
    </Link>
  )
}

/**
 * Fixed top bar: transparent over the photo header, solid navy once the page scrolls.
 * Renders a spacer so it keeps its place in the header's layout.
 */
export function SiteNav({ variant = 'default' }: { variant?: 'default' | 'minimal' }) {
  const pathname = usePathname()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => setSheetOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (variant === 'minimal') {
    return (
      <header className="relative z-[100] w-full">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-6">
          <Brand />
          <Button asChild variant="light" size="sm">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </header>
    )
  }

  return (
    <>
      <div className="h-[4.5rem]" aria-hidden />
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[100] transition-[background-color,box-shadow,backdrop-filter] duration-300',
          scrolled || sheetOpen
            ? 'bg-navy-deep/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(10,31,77,0.25)]'
            : 'bg-gradient-to-b from-navy-deep/40 to-transparent'
        )}
      >
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-3 px-5 sm:px-6">
          <Brand />

          <nav className="hidden lg:flex flex-1 items-center justify-center gap-0.5" aria-label="Main">
            <NavFlyout groupKey="bands" />
            <NavFlyout groupKey="ministry" />
            <NavFlyout groupKey="discover" />
            <Link href="/merch" className={navLinkClass(pathname.startsWith('/merch'))}>
              Merch
            </Link>
          </nav>

          <div className="flex items-center gap-1 sm:gap-1.5 ml-auto shrink-0">
            <MerchCartButton className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors" />
            <AccountMenu />
            <Button asChild variant="gold" className="hidden sm:inline-flex">
              <Link href="/support">Get involved</Link>
            </Button>
            <MobileSheet open={sheetOpen} onOpenChange={setSheetOpen} />
          </div>
        </div>
      </header>
    </>
  )
}
