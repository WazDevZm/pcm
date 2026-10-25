"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  BookOpen,
  Calendar,
  FileText,
  HandHeart,
  Heart,
  Home,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  ShoppingBag,
  Terminal,
  UserCheck,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { HavenMark, HavenWordmark } from '@/components/brand/HavenLogo'
import { OFFICE_LABEL } from '@/lib/brand'
import { FRONTEND_ONLY } from '@/lib/config'
import { cn } from '@/lib/utils'

/** Who may open a section: content = Publicity Committee too; leader = leaders/admins; developer = Developer office */
type Access = 'content' | 'leader' | 'developer'
type NavItem = { name: string; href: string; icon: LucideIcon; access: Access }

const NAV: { label: string; items: NavItem[] }[] = [
  {
    label: 'Overview',
    items: [{ name: 'Dashboard', href: '/admin', icon: LayoutDashboard, access: 'content' }],
  },
  {
    label: 'Website content',
    items: [
      { name: 'Posts & news', href: '/admin/content', icon: FileText, access: 'content' },
      { name: 'Events', href: '/admin/events', icon: Calendar, access: 'content' },
      { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon, access: 'content' },
      { name: 'Resources', href: '/admin/resources', icon: BookOpen, access: 'content' },
    ],
  },
  {
    label: 'Care',
    items: [
      { name: 'Prayer requests', href: '/admin/prayers', icon: Heart, access: 'leader' },
      { name: 'Counseling', href: '/admin/counseling', icon: MessageCircle, access: 'leader' },
      { name: 'Volunteers', href: '/admin/volunteers', icon: HandHeart, access: 'leader' },
      { name: 'Messages', href: '/admin/messages', icon: Mail, access: 'leader' },
    ],
  },
  {
    label: 'Ministry',
    items: [
      { name: 'Bands & committees', href: '/admin/bands', icon: Users, access: 'leader' },
      { name: 'Merch orders', href: '/admin/orders', icon: ShoppingBag, access: 'leader' },
      { name: 'Users & roles', href: '/admin/users', icon: UserCheck, access: 'leader' },
    ],
  },
  {
    label: 'System',
    items: [{ name: 'Developer', href: '/admin/developer', icon: Terminal, access: 'developer' }],
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, isLeader, isPublicity, isDeveloper, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const can = (access: Access) =>
    FRONTEND_ONLY || (access === 'content' ? isPublicity : access === 'leader' ? isLeader : isDeveloper)

  const current = NAV.flatMap((g) => g.items)
    .filter((i) => pathname === i.href || (i.href !== '/admin' && pathname.startsWith(i.href)))
    .sort((a, b) => b.href.length - a.href.length)[0]
  const allowed = current ? can(current.access) : can('leader')

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (FRONTEND_ONLY || loading) return
    if (!user) router.replace(`/login?next=${encodeURIComponent(pathname)}`)
    else if (profile && !isPublicity) router.replace('/member-dashboard')
    else if (profile && !allowed) router.replace('/admin')
  }, [user, profile, loading, isPublicity, allowed, pathname, router])

  if (!FRONTEND_ONLY && (loading || !user || !profile || !isPublicity || !allowed)) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <HavenMark className="h-10 w-10 animate-pulse" />
          <p className="text-sm">{loading || !profile ? 'Loading…' : 'Redirecting…'}</p>
        </div>
      </div>
    )
  }

  const office = profile?.office ? OFFICE_LABEL[profile.office] : null
  const roleLabel = office ?? (isLeader ? (profile?.role === 'admin' ? 'Admin' : 'Leader') : 'Publicity Committee')

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex items-center gap-2 px-5 pt-6 pb-2">
        <HavenMark className="h-8 w-8" />
        <HavenWordmark className="text-xl" />
      </Link>
      <p className="eyebrow px-5 text-muted-foreground">{isLeader ? 'Leadership' : 'Publicity dashboard'}</p>

      <nav className="mt-5 flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {NAV.map((group) => {
          const items = group.items.filter((i) => can(i.access))
          if (!items.length) return null
          return (
            <div key={group.label}>
              <p className="eyebrow !text-[10px] px-3 mb-1.5 text-[#8a93a3]">{group.label}</p>
              {items.map((item) => {
                const Icon = item.icon
                const active = current?.href === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                      active ? 'bg-navy text-white' : 'text-ink/80 hover:bg-canvas hover:text-ink'
                    )}
                  >
                    <Icon className={cn('h-[18px] w-[18px]', active ? 'text-gold' : 'text-navy')} strokeWidth={1.75} />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy font-serif text-white">
            {(profile?.name || 'A').slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">{profile?.name ?? 'Demo admin'}</p>
            <p className="truncate text-xs text-muted-foreground">{roleLabel}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link href="/" className="flex items-center justify-center gap-1.5 rounded-full border border-border py-2 text-sm font-semibold text-navy hover:bg-canvas">
            <Home className="h-4 w-4" /> Site
          </Link>
          <button
            onClick={async () => {
              await signOut()
              router.push('/')
            }}
            className="flex items-center justify-center gap-1.5 rounded-full bg-danger-soft py-2 text-sm font-semibold text-destructive hover:bg-destructive hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <div className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b border-border bg-white/90 px-4 py-3 backdrop-blur">
        <Link href="/admin" className="flex items-center gap-2">
          <HavenMark className="h-7 w-7" />
          <span className="font-serif text-lg text-ink">Admin</span>
        </Link>
        <button onClick={() => setOpen(!open)} className="rounded-full p-2 hover:bg-muted" aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && <div className="md:hidden fixed inset-0 z-20 bg-ink/40" onClick={() => setOpen(false)} />}

      <div className="flex">
        <aside className="hidden md:block sticky top-0 h-screen w-64 shrink-0 border-r border-border bg-white">{sidebar}</aside>
        <aside
          className={cn(
            'md:hidden fixed inset-y-0 left-0 z-30 w-72 border-r border-border bg-white transition-transform duration-300',
            open ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {sidebar}
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
