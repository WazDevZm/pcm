'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, Download, ImagePlus, Loader2, RotateCcw, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cardClass, cardHoverClass, fieldClass, labelClass } from '@/components/ui/haven'
import { cn } from '@/lib/utils'
import {
  FORMATS,
  STUDIO_PHOTOS,
  TEMPLATES,
  initialState,
  type Field,
  type FormatId,
  type PosterState,
  type Template,
} from './posters'

/** Render a poster at full size, scaled down to fit its container */
function Scaled({ state, template, maxWidth, nodeRef }: { state: PosterState; template: Template; maxWidth: number; nodeRef?: React.Ref<HTMLDivElement> }) {
  const { w, h } = FORMATS[state.format]
  const scale = maxWidth / w
  const Render = template.render
  return (
    <div style={{ width: w * scale, height: h * scale }} className="relative overflow-hidden rounded-xl shadow-[0_20px_50px_rgba(10,31,77,0.25)]">
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: w, height: h }}>
        <div ref={nodeRef}>
          <Render state={state} />
        </div>
      </div>
    </div>
  )
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return [ref, width] as const
}

/** Shrink an uploaded photo in the browser so exports stay quick (max 1600 px) */
function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Please choose an image file'))
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read that file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('That image could not be opened'))
      img.onload = () => {
        const scale = Math.min(1, 1600 / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.9))
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

function UploadButton({ label, onImage }: { label: string; onImage: (src: string) => void }) {
  const input = useRef<HTMLInputElement>(null)
  return (
    <>
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (!file) return
          try {
            onImage(await readImage(file))
          } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Upload failed')
          }
        }}
      />
      <Button type="button" variant="outline" size="sm" onClick={() => input.current?.click()}>
        <Upload /> {label}
      </Button>
    </>
  )
}

function FocusSlider({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <label className="mt-3 block">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <input type="range" min={0} max={100} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 w-full accent-[#0f2d6e]" />
    </label>
  )
}

function FieldInput({ field, state, setState }: { field: Field; state: PosterState; setState: (fn: (s: PosterState) => PosterState) => void }) {
  const value = state.values[field.key] ?? ''
  const set = (key: string, v: string) => setState((s) => ({ ...s, values: { ...s.values, [key]: v } }))
  const over = field.max && value.length > field.max

  if (field.type === 'background') {
    const bg = state.background
    return (
      <div>
        <span className={labelClass}>{field.label}</span>
        {field.hint && <p className="-mt-1 mb-2 text-xs text-muted-foreground">{field.hint}</p>}
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => setState((s) => ({ ...s, background: { kind: 'brand' } }))}
            className={cn('aspect-square rounded-lg bg-gradient-to-b from-navy-deep to-navy text-[11px] font-bold text-white ring-offset-2', bg.kind === 'brand' && 'ring-2 ring-gold')}
          >
            Brand
          </button>
          {STUDIO_PHOTOS.map((p) => (
            <button
              key={p.id}
              type="button"
              title={p.label}
              onClick={() => setState((s) => ({ ...s, background: { kind: 'photo', src: p.src, focus: 40 } }))}
              className={cn('aspect-square overflow-hidden rounded-lg ring-offset-2', bg.kind === 'photo' && bg.src === p.src && 'ring-2 ring-gold')}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.label} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <UploadButton label="Upload a photo" onImage={(src) => setState((s) => ({ ...s, background: { kind: 'photo', src, focus: 40 } }))} />
        </div>
        {bg.kind === 'photo' && (
          <FocusSlider label="Move the photo up or down" value={bg.focus} onChange={(focus) => setState((s) => ({ ...s, background: { ...(s.background as { kind: 'photo'; src: string }), kind: 'photo', focus } }))} />
        )}
      </div>
    )
  }

  if (field.type === 'image') {
    return (
      <div>
        <span className={labelClass}>{field.label}</span>
        {field.hint && <p className="-mt-1 mb-2 text-xs text-muted-foreground">{field.hint}</p>}
        <div className="flex items-center gap-3">
          <span className="flex h-16 w-14 shrink-0 items-center justify-center overflow-hidden rounded-t-full rounded-b-lg border-2 border-gold bg-navy-soft">
            {value ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" className="h-full w-full object-cover" style={{ objectPosition: `50% ${state.values.presenterFocus || 30}%` }} />
            ) : (
              <ImagePlus className="h-5 w-5 text-navy" />
            )}
          </span>
          <UploadButton label={value ? 'Change photo' : 'Upload photo'} onImage={(src) => set(field.key, src)} />
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={() => set(field.key, '')} aria-label="Remove photo">
              <Trash2 />
            </Button>
          )}
        </div>
        {value && (
          <FocusSlider
            label="Move the face up or down"
            value={Number(state.values.presenterFocus || 30)}
            onChange={(v) => set('presenterFocus', String(v))}
          />
        )}
      </div>
    )
  }

  const common = {
    id: `f-${field.key}`,
    value,
    placeholder: field.placeholder,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(field.key, e.target.value),
  }
  return (
    <div>
      <label htmlFor={common.id} className={labelClass}>
        {field.label}
      </label>
      {field.type === 'textarea' ? (
        <textarea {...common} rows={3} className={cn(fieldClass, 'py-3 resize-none')} />
      ) : (
        <input {...common} className={fieldClass} />
      )}
      {(field.hint || field.max) && (
        <p className={cn('mt-1 text-xs', over ? 'text-destructive font-semibold' : 'text-muted-foreground')}>
          {over ? `A bit long for the design — try under ${field.max} characters` : field.hint}
          {!over && field.max ? `${field.hint ? ' · ' : ''}${value.length}/${field.max}` : ''}
        </p>
      )}
    </div>
  )
}

const DRAFT_KEY = (id: string) => `haven-studio:${id}`

function loadDraft(t: Template): PosterState {
  try {
    const raw = localStorage.getItem(DRAFT_KEY(t.id))
    if (raw) {
      const saved = JSON.parse(raw) as PosterState
      return { ...initialState(t), ...saved, values: { ...t.defaults, ...saved.values } }
    }
  } catch {
    // Drafts are a convenience; ignore storage errors
  }
  return initialState(t)
}

function saveDraft(t: Template, s: PosterState) {
  try {
    // Uploaded photos are too large for browser storage; keep text and choices only
    const values = Object.fromEntries(Object.entries(s.values).filter(([, v]) => !v.startsWith('data:')))
    const background = s.background.kind === 'photo' && s.background.src.startsWith('data:') ? t.background : s.background
    localStorage.setItem(DRAFT_KEY(t.id), JSON.stringify({ ...s, values, background }))
  } catch {
    // ignore
  }
}

function Editor({ template, onBack }: { template: Template; onBack: () => void }) {
  const [state, setStateRaw] = useState<PosterState>(() => loadDraft(template))
  const [busy, setBusy] = useState(false)
  const [box, width] = useWidth<HTMLDivElement>()
  const node = useRef<HTMLDivElement>(null)

  const setState = useCallback(
    (fn: (s: PosterState) => PosterState) =>
      setStateRaw((prev) => {
        const next = fn(prev)
        saveDraft(template, next)
        return next
      }),
    [template]
  )

  const download = async (pixelRatio: number) => {
    if (!node.current) return
    setBusy(true)
    try {
      const { toPng } = await import('html-to-image')
      await document.fonts.ready
      const { w, h } = FORMATS[state.format]
      const opts = { width: w, height: h, pixelRatio, cacheBust: true }
      // First pass warms up fonts and images; the second is the clean render
      await toPng(node.current, opts)
      const url = await toPng(node.current, opts)
      const a = document.createElement('a')
      const date = new Date().toISOString().slice(0, 10)
      a.download = `${template.id}-${state.format}-${date}.png`
      a.href = url
      a.click()
      toast.success('Poster downloaded')
    } catch (err) {
      console.error(err)
      toast.error('Could not export the poster. Try a different photo.')
    } finally {
      setBusy(false)
    }
  }

  const fmt = FORMATS[state.format]
  const previewWidth = Math.min(width, fmt.h > fmt.w ? width * (state.format === 'story' ? 0.62 : 0.86) : width)

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(320px,420px)_1fr]">
      <div className="space-y-5">
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:underline">
          <ArrowLeft className="h-4 w-4" /> All templates
        </button>
        <div>
          <h2 className="font-serif text-3xl text-ink">{template.name}</h2>
          <p className="text-muted-foreground">{template.blurb}</p>
        </div>

        <div className={cn(cardClass, 'p-5 space-y-5')}>
          {template.fields.map((f) => (
            <FieldInput key={f.key} field={f} state={state} setState={setState} />
          ))}
        </div>

        <div className={cn(cardClass, 'p-5 space-y-4')}>
          <div>
            <span className={labelClass}>Size</span>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(FORMATS) as FormatId[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setState((s) => ({ ...s, format: f }))}
                  className={cn('rounded-xl border px-2 py-2.5 text-left transition-colors', state.format === f ? 'border-navy bg-navy text-white' : 'border-border hover:border-navy/30')}
                >
                  <span className="block text-sm font-bold">{FORMATS[f].label}</span>
                  <span className={cn('block text-[11px]', state.format === f ? 'text-white/70' : 'text-muted-foreground')}>{FORMATS[f].hint}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className={labelClass}>Ministry name</span>
            <div className="grid grid-cols-2 gap-2">
              {(['side', 'below'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setState((s) => ({ ...s, brandLayout: l }))}
                  className={cn('rounded-xl border px-3 py-2.5 text-sm font-bold transition-colors', state.brandLayout === l ? 'border-navy bg-navy text-white' : 'border-border hover:border-navy/30')}
                >
                  {l === 'side' ? 'Beside the logo' : 'Under the logo'}
                </button>
              ))}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (!confirm('Start this template again from the default text?')) return
              try {
                localStorage.removeItem(DRAFT_KEY(template.id))
              } catch {}
              setStateRaw(initialState(template))
            }}
          >
            <RotateCcw /> Reset template
          </Button>
        </div>
      </div>

      <div className="lg:sticky lg:top-6 self-start">
        <div ref={box} className="flex w-full flex-col items-center rounded-3xl bg-muted/70 p-4 sm:p-8">
          {width > 0 && <Scaled state={state} template={template} maxWidth={previewWidth - 0} nodeRef={node} />}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button size="lg" variant="gold" disabled={busy} onClick={() => download(1)}>
              {busy ? <Loader2 className="animate-spin" /> : <Download />} Download PNG
            </Button>
            <Button size="lg" variant="outline" disabled={busy} onClick={() => download(2)}>
              HD (2×)
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {fmt.w}×{fmt.h} px · your text is saved on this device as you type
          </p>
        </div>
      </div>
    </div>
  )
}

function Gallery({ onPick }: { onPick: (t: Template) => void }) {
  const [ref, width] = useWidth<HTMLDivElement>()
  const thumb = Math.max(140, Math.min(260, (width - 48) / (width > 900 ? 5 : width > 600 ? 3 : 2)))
  return (
    <div ref={ref}>
      <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${thumb}px, 1fr))` }}>
        {TEMPLATES.map((t) => (
          <button key={t.id} onClick={() => onPick(t)} className={cn(cardClass, cardHoverClass, 'group flex flex-col items-stretch overflow-hidden p-3 text-left')}>
            <div className="flex justify-center rounded-xl bg-muted/70 p-3">
              {width > 0 && <Scaled state={initialState(t)} template={t} maxWidth={thumb - 30} />}
            </div>
            <div className="px-1 pt-3 pb-1">
              <p className="font-bold text-ink">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.blurb}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export function Studio() {
  const [template, setTemplate] = useState<Template | null>(null)

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('t')
    const t = TEMPLATES.find((x) => x.id === id)
    if (t) setTemplate(t)
  }, [])

  const pick = (t: Template | null) => {
    setTemplate(t)
    const url = new URL(window.location.href)
    if (t) url.searchParams.set('t', t.id)
    else url.searchParams.delete('t')
    window.history.replaceState(null, '', url)
    window.scrollTo({ top: 0 })
  }

  return template ? <Editor key={template.id} template={template} onBack={() => pick(null)} /> : <Gallery onPick={pick} />
}
