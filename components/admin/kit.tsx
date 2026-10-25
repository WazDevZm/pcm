'use client'

import { useCallback, useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

/** Admin page header: eyebrow, serif title, description, optional actions (app: SectionHeader) */
export function AdminPage({
  eyebrow = 'The Haven leadership',
  title,
  description,
  actions,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="px-5 py-8 md:px-10 md:py-10 max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-navy mb-2">{eyebrow}</p>
          <h1 className="text-3xl md:text-4xl text-ink">{title}</h1>
          {description && <p className="mt-2 text-muted-foreground max-w-2xl">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
      </div>
      {children}
    </div>
  )
}

/** Pill tabs for status filters (app: Chips) */
export function StatusTabs<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-1" role="tablist">
      {options.map((o) => (
        <button
          key={o}
          role="tab"
          aria-selected={o === value}
          onClick={() => onChange(o)}
          className={cn(
            'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold capitalize transition-colors',
            o === value ? 'border-navy bg-navy text-white' : 'border-border bg-white text-ink hover:border-navy/30'
          )}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

/** Load a list, reload on demand, and run actions with a per-row busy flag and toasts */
export function useQueue<T>(load: () => Promise<T[]>, deps: unknown[]) {
  const [rows, setRows] = useState<T[] | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setError('')
    try {
      setRows(await load())
    } catch (err) {
      setRows([])
      setError(err instanceof Error ? err.message : 'Could not load')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    setRows(null)
    reload()
  }, [reload])

  const act = async (id: string, fn: () => Promise<unknown>, success: string) => {
    setBusy(id)
    try {
      await fn()
      toast.success(success)
      await reload()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setBusy(null)
    }
  }

  return { rows, error, busy, reload, act }
}

export function LoadingRows() {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" /> Loading…
    </div>
  )
}

export const when = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
