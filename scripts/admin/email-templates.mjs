#!/usr/bin/env node
/**
 * Branded Supabase auth emails for The Haven.
 *
 *   node scripts/admin/email-templates.mjs     writes supabase/email-templates/*.html (paste into
 *                                              Supabase → Authentication → Email Templates)
 * provision.mjs imports EMAILS and applies them through the Management API.
 *
 * Email-safe HTML: tables, inline styles, PNG images hosted on the website.
 */
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
export const SITE = process.env.SITE_URL || 'https://pcm-pi.vercel.app'
const NAVY = '#0f2d6e'
const GOLD = '#d9a441'
const MINISTRY = 'The Copperbelt University SDA Public Campus Ministries'

const layout = ({ eyebrow, title, body, button, after }) => `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f1f3f6;-webkit-font-smoothing:antialiased">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f3f6;padding:32px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0B0F12">
  <tr><td style="background:${NAVY};padding:36px 40px 30px" align="left">
    <img src="${SITE}/email/the-haven-white.png" width="200" height="34" alt="The Haven" style="display:block;border:0;width:200px;height:auto">
  </td></tr>
  <tr><td style="height:4px;background:${GOLD};line-height:4px;font-size:0">&nbsp;</td></tr>
  <tr><td style="padding:40px 40px 8px">
    <p style="margin:0 0 10px;font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:${NAVY}">${eyebrow}</p>
    <h1 style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.2;color:#0B0F12">${title}</h1>
    ${body}
  </td></tr>
  <tr><td style="padding:16px 40px 8px">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:999px;background:${GOLD}">
      <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:15px 30px;font-size:16px;font-weight:700;color:#0B0F12;text-decoration:none;border-radius:999px">${button}</a>
    </td></tr></table>
  </td></tr>
  <tr><td style="padding:16px 40px 36px">
    ${after ?? ''}
    <p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#5b6472">If the button doesn’t work, copy this link into your browser:<br>
    <a href="{{ .ConfirmationURL }}" style="color:${NAVY};word-break:break-all">{{ .ConfirmationURL }}</a></p>
  </td></tr>
  <tr><td style="background:#fafbfc;border-top:1px solid #e4e7ec;padding:24px 40px">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td style="padding-right:14px;vertical-align:middle"><img src="${SITE}/pcm-shield.png" width="34" height="42" alt="CBU SDA PCM" style="display:block;border:0"></td>
      <td style="vertical-align:middle;font-size:12px;line-height:1.5;color:#5b6472"><b style="color:${NAVY}">CBU SDA PCM</b><br>${MINISTRY}</td>
    </tr></table>
    <p style="margin:14px 0 0;font-size:12px;color:#8a93a3">You received this because someone used {{ .Email }} with The Haven. If it wasn’t you, you can ignore this email.</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>
`

const p = (text) => `<p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:#2b3340">${text}</p>`

/** key matches Supabase's mailer_* config names */
export const EMAILS = [
  {
    key: 'confirmation',
    file: 'confirm-signup.html',
    subject: 'Welcome to The Haven — confirm your email',
    html: layout({
      eyebrow: 'Welcome',
      title: 'You’re in. Welcome to The Haven.',
      body:
        p('We’re so glad you’re here. The Haven is home for worship, Bible study, real friendship and service at the Copperbelt University.') +
        p('Confirm your email to finish setting up your account. Then you can RSVP to events, join a band, send prayer requests and order merch — on the website and in the app.'),
      button: 'Confirm my email',
      after: p('See you at Sabbath worship!'),
    }),
  },
  {
    key: 'recovery',
    file: 'reset-password.html',
    subject: 'Reset your password for The Haven',
    html: layout({
      eyebrow: 'Password reset',
      title: 'Choose a new password',
      body: p('We received a request to reset the password for your account. The link below works once and expires soon.'),
      button: 'Reset my password',
    }),
  },
  {
    key: 'magic_link',
    file: 'magic-link.html',
    subject: 'Your sign-in link for The Haven',
    html: layout({
      eyebrow: 'Sign in',
      title: 'Here’s your sign-in link',
      body: p('Tap the button to sign in to The Haven. The link works once and expires soon.'),
      button: 'Sign me in',
    }),
  },
  {
    key: 'invite',
    file: 'invite.html',
    subject: 'You’re invited to The Haven',
    html: layout({
      eyebrow: 'Invitation',
      title: 'You’ve been invited to The Haven',
      body: p('A leader at CBU SDA PCM has invited you to join The Haven — the ministry’s website and app for events, bands, prayer and more.'),
      button: 'Accept the invitation',
    }),
  },
  {
    key: 'email_change',
    file: 'change-email.html',
    subject: 'Confirm your new email for The Haven',
    html: layout({
      eyebrow: 'Account',
      title: 'Confirm your new email address',
      body: p('Confirm this address to finish changing the email on your Haven account.'),
      button: 'Confirm new email',
    }),
  },
]

/** Fields for PATCH /v1/projects/{ref}/config/auth */
export function authEmailConfig() {
  return Object.fromEntries(
    EMAILS.flatMap((e) => [
      [`mailer_subjects_${e.key}`, e.subject],
      [`mailer_templates_${e.key}_content`, e.html],
    ])
  )
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dir = path.join(root, 'supabase/email-templates')
  fs.mkdirSync(dir, { recursive: true })
  for (const e of EMAILS) fs.writeFileSync(path.join(dir, e.file), e.html)
  fs.writeFileSync(
    path.join(dir, 'README.md'),
    `# Auth email templates

Branded emails for Supabase Auth. \`npm run provision\` applies them automatically. To set them by hand,
open **Supabase → Authentication → Email Templates** and paste each file with its subject:

| Template | Subject | File |
|---|---|---|
${EMAILS.map((e) => `| ${e.key.replace('_', ' ')} | ${e.subject} | \`${e.file}\` |`).join('\n')}

Generated by \`scripts/admin/email-templates.mjs\` — edit that, not these files.
`
  )
  console.log(`✓ Wrote ${EMAILS.length} templates to supabase/email-templates/`)
}
