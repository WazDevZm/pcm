"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/AuthProvider"
import {
  applyToVolunteer,
  friendlyError,
  submitPledge,
  type DonationType,
} from "@/lib/data/forms"

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-[#0f2d6e] focus:border-transparent"

function Status({ success, error }: { success?: string; error?: string }) {
  return (
    <>
      {success && (
        <p role="status" className="rounded-lg bg-green-50 ring-1 ring-green-200 px-4 py-3 text-green-800 text-sm">
          {success}
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 ring-1 ring-red-200 px-4 py-3 text-red-700 text-sm">
          {error}
        </p>
      )}
    </>
  )
}

/** Volunteer application — RLS requires a signed-in user (user_id = auth.uid()) */
export function VolunteerApplyForm({
  role,
  defaultHours,
  onCancel,
}: {
  role: string
  defaultHours: number
  onCancel: () => void
}) {
  const { user, loading } = useAuth()
  const [availability, setAvailability] = useState("")
  const [hours, setHours] = useState(String(defaultHours))
  const [skills, setSkills] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  if (loading) {
    return <p className="text-sm text-gray-500">Checking your account…</p>
  }

  if (!user) {
    return (
      <div className="rounded-xl bg-[#fafbfc] ring-1 ring-gray-200 p-5 text-sm text-gray-700 space-y-3">
        <p>Please sign in to apply — your application is linked to your member account so leaders can follow up.</p>
        <div className="flex gap-3">
          <Button asChild className="bg-[#0f2d6e] text-white hover:bg-[#0f2d6e]/90 rounded-full">
            <Link href="/login?next=/support">Sign in</Link>
          </Button>
          <Button type="button" variant="outline" className="rounded-full border-gray-300" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  if (success) return <Status success={success} />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      await applyToVolunteer({
        user_id: user.id,
        role,
        availability: availability.trim(),
        commitment_hours: Math.max(1, Math.round(Number(hours) || defaultHours)),
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      })
      setSuccess(`Thank you! Your application for ${role} has been sent. A leader will be in touch.`)
    } catch (err: unknown) {
      setError(friendlyError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-[#fafbfc] ring-1 ring-gray-200 p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700" htmlFor={`avail-${role}`}>
            Availability
          </label>
          <input
            id={`avail-${role}`}
            required
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className={inputClass}
            placeholder="e.g. Weekday evenings, Saturdays"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-gray-700" htmlFor={`hours-${role}`}>
            Hours per week
          </label>
          <input
            id={`hours-${role}`}
            type="number"
            min={1}
            max={40}
            required
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-700" htmlFor={`skills-${role}`}>
          Skills (Optional, comma separated)
        </label>
        <input
          id={`skills-${role}`}
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className={inputClass}
          placeholder="e.g. Guitar, sound mixing"
        />
      </div>
      <Status error={error} />
      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-[#0f2d6e] text-white hover:bg-[#0f2d6e]/90 rounded-full"
        >
          {submitting ? "Sending..." : "Submit Application"}
        </Button>
        <Button type="button" variant="outline" className="rounded-full border-gray-300" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

/** Pledge — RLS lets anyone insert into donations; no payment is taken online */
export function PledgeForm({
  type,
  purpose,
  onCancel,
}: {
  type: DonationType
  purpose: string
  onCancel: () => void
}) {
  const { user, profile } = useAuth()
  const [amount, setAmount] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [anonymous, setAnonymous] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!profile) return
    setName((n) => n || profile.name || "")
    setEmail((e) => e || profile.email || "")
  }, [profile])

  if (success) return <Status success={success} />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = Number(amount)
    if (!Number.isFinite(value) || value <= 0) {
      setError("Please enter an amount greater than zero.")
      return
    }
    setSubmitting(true)
    setError("")
    try {
      await submitPledge({
        amount: Math.round(value * 100) / 100,
        type,
        purpose,
        donor_name: name.trim() || null,
        donor_email: email.trim() || null,
        is_anonymous: anonymous,
        user_id: user?.id ?? null,
      })
      setSuccess(
        "Thank you for your pledge! Our treasury team will contact you with giving details (Mobile Money or bank transfer)."
      )
    } catch (err: unknown) {
      setError(friendlyError(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-[#fafbfc] ring-1 ring-gray-200 p-4 space-y-3 text-left">
      <div>
        <label className="block text-sm font-medium mb-1.5 text-gray-700" htmlFor={`amt-${purpose}`}>
          Pledge amount (ZMW)
        </label>
        <input
          id={`amt-${purpose}`}
          type="number"
          min={1}
          step="any"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={inputClass}
          placeholder="e.g. 200"
        />
      </div>
      <input
        aria-label="Your name"
        value={name}
        disabled={anonymous}
        onChange={(e) => setName(e.target.value)}
        className={`${inputClass} disabled:bg-gray-100`}
        placeholder="Your name (optional)"
      />
      <input
        aria-label="Your email"
        type="email"
        value={email}
        disabled={anonymous}
        onChange={(e) => setEmail(e.target.value)}
        className={`${inputClass} disabled:bg-gray-100`}
        placeholder="Email so we can follow up (optional)"
      />
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="w-4 h-4 border-gray-300 rounded"
        />
        Give anonymously
      </label>
      <p className="text-xs text-gray-500">This records a pledge — no payment is taken online.</p>
      <Status error={error} />
      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-[#0f2d6e] text-white hover:bg-[#0f2d6e]/90 rounded-full"
        >
          {submitting ? "Sending..." : "Submit Pledge"}
        </Button>
        <Button type="button" variant="outline" className="rounded-full border-gray-300" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
