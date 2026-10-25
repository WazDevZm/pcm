/**
 * The Haven's dashboard logins. One list drives provision.mjs (Management API) and
 * make-sql.mjs (paste-into-SQL-Editor), and the hand-over report.
 *
 * Passwords are generated once and kept in credentials.local.json (git-ignored), so every
 * output agrees. Pass --rotate to either script to issue new ones.
 */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

export const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const STORE = path.join(root, 'credentials.local.json')

/** office → admin with a named office; band → band_admins row; panel → where they work */
export const ACCOUNTS = [
  { email: 'developer@thehaven.test', name: 'Haven Developer', title: 'Developer', office: 'developer', panel: '/admin', group: 'Leadership' },
  { email: 'chairperson@thehaven.test', name: 'PCM Chairperson', title: 'PCM Chairperson', office: 'chairperson', panel: '/admin', group: 'Leadership' },
  { email: 'vice.chairperson@thehaven.test', name: 'PCM Vice Chairperson', title: 'PCM Vice Chairperson', office: 'vice_chairperson', panel: '/admin', group: 'Leadership' },
  { email: 'publicity@thehaven.test', name: 'Publicity Committee Head', title: 'Publicity Committee head', band: 'publicity-committee', panel: '/admin', group: 'Publicity Committee' },
  { email: 'studio@thehaven.test', name: 'Publicity Studio', title: 'Studio (poster design)', band: 'publicity-committee', panel: '/studio', group: 'Publicity Committee' },
  { email: 'welfare@thehaven.test', name: 'Welfare Band Head', title: 'Welfare Band head', band: 'welfare-band', panel: '/band-admin/welfare-band', group: 'Bands & committees' },
  { email: 'witnessing@thehaven.test', name: 'Witnessing Band Head', title: 'Witnessing Band head', band: 'witnessing-band', panel: '/band-admin/witnessing-band', group: 'Bands & committees' },
  { email: 'stumm@thehaven.test', name: 'Stu-MM Head', title: 'Stu-MM head', band: 'stu-mm', panel: '/band-admin/stu-mm', group: 'Bands & committees' },
  { email: 'creativity@thehaven.test', name: 'Creativity & Arts Band Head', title: 'Creativity & Arts Band head', band: 'creativity-arts-band', panel: '/band-admin/creativity-arts-band', group: 'Bands & committees' },
  { email: 'education@thehaven.test', name: 'Education Committee Head', title: 'Education Committee head', band: 'education-committee', panel: '/band-admin/education-committee', group: 'Bands & committees' },
  { email: 'catering@thehaven.test', name: 'Catering Committee Head', title: 'Catering Committee head', band: 'catering-committee', panel: '/band-admin/catering-committee', group: 'Bands & committees' },
]

/** Readable but strong: 4 groups of 4, no look-alike characters (~95 bits) */
export function newPassword() {
  const abc = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789'
  const chars = [...crypto.randomBytes(16)].map((b) => abc[b % abc.length]).join('')
  return `${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8, 12)}-${chars.slice(12, 16)}`
}

/** Accounts with passwords, creating or rotating them as needed */
export function withPasswords({ rotate = false } = {}) {
  const saved = !rotate && fs.existsSync(STORE) ? JSON.parse(fs.readFileSync(STORE, 'utf8')) : {}
  const out = ACCOUNTS.map((a) => ({ ...a, password: saved[a.email] || newPassword() }))
  fs.writeFileSync(STORE, JSON.stringify(Object.fromEntries(out.map((a) => [a.email, a.password])), null, 2) + '\n', { mode: 0o600 })
  return out
}

/** CREDENTIALS.local.md hand-over table */
export function writeHandover(accounts, site = 'https://pcm-pi.vercel.app') {
  const groups = [...new Set(accounts.map((a) => a.group))]
  const md = `# The Haven — dashboard logins (PRIVATE — do not commit or share publicly)

Website: ${site}/login · Generated ${new Date().toISOString().slice(0, 10)} · Same logins work in the app.
These use \`@thehaven.test\` addresses (not real inboxes), so "Forgot password?" emails won't arrive —
re-run the provisioning script with \`--rotate\` to issue new passwords, or swap in real emails.

${groups
  .map(
    (g) => `## ${g}

| Role | Email | Password | Dashboard |
|---|---|---|---|
${accounts
  .filter((a) => a.group === g)
  .map((a) => `| ${a.title} | \`${a.email}\` | \`${a.password}\` | ${site}${a.panel} |`)
  .join('\n')}
`
  )
  .join('\n')}`
  fs.writeFileSync(path.join(root, 'CREDENTIALS.local.md'), md, { mode: 0o600 })
}
