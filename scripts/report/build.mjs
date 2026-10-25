#!/usr/bin/env node
/**
 * Status report PDF for The Haven, prepared by the Publicity Committee.
 *
 *   node scripts/report/build.mjs
 *
 * Writes two files to reports/ (git-ignored):
 *   The-Haven-Status-Report-CONFIDENTIAL.pdf   includes the dashboard logins
 *   The-Haven-Status-Report.pdf                the same report without passwords, safe to share
 *
 * Screenshots are read from reports/assets/*.png when present.
 */
import fs from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer-core'
import { root, withPasswords } from '../admin/accounts.mjs'

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const SITE = 'https://pcm-pi.vercel.app'
const NAVY = '#0f2d6e'
const GOLD = '#d9a441'
const r = (...p) => path.join(root, ...p)
const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

const mime = (f) => (f.endsWith('.png') ? 'image/png' : f.endsWith('.ttf') ? 'font/ttf' : 'image/jpeg')
const uri = (f) => (fs.existsSync(f) ? `data:${mime(f)};base64,${fs.readFileSync(f).toString('base64')}` : null)
const asset = (name) => uri(r('reports/assets', name))

const shot = (name, caption, cls = '') => {
  const src = asset(name)
  return src ? `<figure class="shot ${cls}"><img src="${src}"/><figcaption>${caption}</figcaption></figure>` : ''
}

const status = (tone, text) => `<span class="pill ${tone}">${text}</span>`

function html({ withLogins }) {
  const accounts = withPasswords()
  const groups = [...new Set(accounts.map((a) => a.group))]
  const posters = ['01-welcome', '02-sabbath-worship', '03-bible-study', '04-need-prayer', '05-get-the-app']
    .map((p) => uri(r('brand-kit/posters/png', `${p}.png`)))
    .filter(Boolean)
  const launch = ['launch-3', 'launch-2', 'launch-1'].map((p) => uri(r('brand-kit/posters/launch', `${p}.png`))).filter(Boolean)
  const studioPosters = ['studio-prayer.png', 'studio-vespers.png', 'studio-sabbath.png'].map(asset).filter(Boolean)

  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:FB;src:url(${uri(r('brand-kit/fonts/Fraunces_700Bold.ttf'))})}
@font-face{font-family:FI;src:url(${uri(r('brand-kit/fonts/Fraunces_400Regular_Italic.ttf'))})}
@page{size:A4;margin:0}
*{box-sizing:border-box}
body{margin:0;font-family:-apple-system,"Helvetica Neue",Arial,sans-serif;color:#0B0F12;font-size:10.5pt;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:210mm;min-height:297mm;padding:18mm 18mm 16mm;position:relative;page-break-after:always;background:#fff}
.page:last-child{page-break-after:auto}
h1,h2,h3{font-family:FB;letter-spacing:-.01em;margin:0}
h2{font-size:24pt;color:#0B0F12;margin:2mm 0 5mm}
h3{font-size:13pt;margin:6mm 0 2mm}
.eyebrow{font:800 8pt/1 -apple-system,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:${NAVY}}
p{margin:0 0 3mm}
.muted{color:#5b6472}
.foot{position:absolute;left:18mm;right:18mm;bottom:9mm;display:flex;justify-content:space-between;font-size:7.5pt;color:#8a93a3;border-top:1px solid #e4e7ec;padding-top:2.5mm}
.cover{background:${NAVY};color:#fff;padding:0;display:flex;flex-direction:column}
.cover .top{padding:20mm 18mm 0;display:flex;align-items:center;gap:5mm}
.cover .body{flex:1;display:flex;flex-direction:column;justify-content:center;padding:0 18mm}
.cover h1{font-size:44pt;line-height:1.02;margin-top:6mm}
.cover .gold{color:${GOLD};font-family:FI;font-weight:400}
.cover .meta{padding:0 18mm 18mm;display:grid;grid-template-columns:repeat(3,1fr);gap:6mm;border-top:1px solid rgba(255,255,255,.18);margin:0 18mm;padding:7mm 0 16mm}
.cover .meta b{display:block;font-size:7.5pt;letter-spacing:.18em;text-transform:uppercase;color:${GOLD};margin-bottom:1.5mm}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:5mm}
.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}
.card{border:1px solid #e4e7ec;border-radius:4mm;padding:4.5mm 5mm;background:#fff}
.card h4{margin:0 0 1.5mm;font-size:10.5pt}
.tile{border-radius:4mm;padding:5mm;background:#fafbfc;border:1px solid #e4e7ec}
.tile .n{font-family:FB;font-size:22pt;color:${NAVY};line-height:1}
.pill{display:inline-block;border-radius:99px;padding:.6mm 2.6mm;font-size:7.5pt;font-weight:800;white-space:nowrap}
.ok{background:#ecfdf3;color:#067647}.warn{background:#fbf3e2;color:#8a5d0b}.bad{background:#fef3f2;color:#b42318}.info{background:#e8edf7;color:${NAVY}}
table{width:100%;border-collapse:collapse;font-size:9pt}
th{text-align:left;font-size:7.5pt;letter-spacing:.12em;text-transform:uppercase;color:#5b6472;border-bottom:1.5px solid #e4e7ec;padding:2mm 2mm}
td{border-bottom:1px solid #eef0f3;padding:2.2mm 2mm;vertical-align:top}
code{font-family:Menlo,monospace;font-size:8.5pt;background:#f1f3f6;border-radius:1.2mm;padding:.3mm 1.2mm}
.shot{margin:0}.shot img{width:100%;border-radius:3mm;border:1px solid #e4e7ec;display:block}
.shot figcaption{font-size:8pt;color:#5b6472;margin-top:1.5mm}
.phone img{border-radius:5mm}
.list{margin:0;padding-left:5mm}.list li{margin-bottom:1.6mm}
.steps{counter-reset:s;list-style:none;padding:0;margin:0}
.steps li{counter-increment:s;position:relative;padding-left:10mm;margin-bottom:3mm}
.steps li:before{content:counter(s);position:absolute;left:0;top:0;width:6.5mm;height:6.5mm;border-radius:50%;background:${NAVY};color:#fff;font-weight:800;font-size:8.5pt;display:flex;align-items:center;justify-content:center}
.banner{border-radius:3mm;padding:3.5mm 4.5mm;margin-bottom:5mm;font-size:9pt}
.posters{display:grid;grid-template-columns:repeat(5,1fr);gap:3mm}.posters img{width:100%;border-radius:2mm;display:block}
.launch{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}.launch img{width:100%;border-radius:2.5mm;display:block}
</style></head><body>

<!-- Cover -->
<section class="page cover">
  <div class="top">
    <img src="${uri(r('public/pcm-shield.png'))}" style="height:20mm"/>
    <div style="font-weight:800;font-size:9pt;letter-spacing:.14em;text-transform:uppercase;line-height:1.4">The Copperbelt University<br/><span style="opacity:.75">SDA Public Campus Ministries</span></div>
  </div>
  <div class="body">
    <p class="eyebrow" style="color:${GOLD}">Status report${withLogins ? ' · Confidential' : ''}</p>
    <h1>The Haven website, app<br/>&amp; dashboards <span class="gold">— ready for testing</span></h1>
    <p style="margin-top:7mm;font-size:12pt;opacity:.85;max-width:150mm">What is live, how each dashboard and the Studio work, ${withLogins ? 'the logins for every dashboard, ' : ''}what is working, what is not yet, and the next steps.</p>
  </div>
  <div class="meta">
    <div><b>Prepared by</b>Publicity Committee<br/>Wazingwa Mugala</div>
    <div><b>Date</b>${today}</div>
    <div><b>Live website</b>${SITE.replace('https://', '')}</div>
  </div>
</section>

<!-- Summary -->
<section class="page">
  <p class="eyebrow">At a glance</p>
  <h2>Summary</h2>
  <p>The Haven's website has been redesigned to match the mobile app, rebuilt with working dashboards for every leadership role, and deployed to <b>${SITE}</b>. A new <b>Studio</b> lets the Publicity Committee make on-brand posters without design skills. The website and app share one Supabase database, so one account works in both.</p>
  <div class="grid3" style="margin:6mm 0">
    <div class="tile"><div class="n">11</div><p class="muted" style="margin:1mm 0 0">dashboard logins prepared</p></div>
    <div class="tile"><div class="n">6</div><p class="muted" style="margin:1mm 0 0">Studio poster templates</p></div>
    <div class="tile"><div class="n">9</div><p class="muted" style="margin:1mm 0 0">bands &amp; committees with dashboards</p></div>
  </div>
  <h3>Status</h3>
  <table>
    <tr><th style="width:42%">Area</th><th style="width:18%">Status</th><th>Notes</th></tr>
    <tr><td>Website redesign (all public pages)</td><td>${status('ok', 'Live')}</td><td>New text-only logo, CBU SDA PCM naming, faster photos</td></tr>
    <tr><td>Live data from Supabase (events, news, bands)</td><td>${status('ok', 'Working')}</td><td>Checked on the live site</td></tr>
    <tr><td>Studio (poster templates)</td><td>${status('ok', 'Live')}</td><td>PNG export checked in portrait, square and story sizes</td></tr>
    <tr><td>Admin, leadership, Publicity and band dashboards</td><td>${status('warn', 'Built')}</td><td>Active once the logins are switched on (one step)</td></tr>
    <tr><td>Dashboard logins and the four new bands</td><td>${status('warn', 'One step')}</td><td>Paste one SQL file in Supabase (page 7)</td></tr>
    <tr><td>Google sign-in for members</td><td>${status('warn', 'One setting')}</td><td>Works at Google; Supabase must allow the live site's address</td></tr>
    <tr><td>Branded welcome and password emails</td><td>${status('warn', 'Ready')}</td><td>Paste into Supabase email templates</td></tr>
    <tr><td>Mobile app</td><td>${status('info', 'Updated')}</td><td>Code ready; needs a new test build for the new icon and sign-in</td></tr>
    <tr><td>Supabase on the ministry Wi-Fi</td><td>${status('bad', 'Blocked')}</td><td>Router DNS fails for supabase.co (page 9)</td></tr>
  </table>
  <div class="foot"><span>The Haven · Status report</span><span>Publicity Committee · Wazingwa Mugala</span></div>
</section>

<!-- Website -->
<section class="page">
  <p class="eyebrow">What's live</p>
  <h2>The website</h2>
  <p>Every page now uses the app's design: Haven Navy, Lamp Gold, Fraunces headlines and the new text-only logo, with <b>CBU SDA PCM</b> and the ministry's full name throughout. Photos were reduced from 86 MB to 8 MB so pages load quickly.</p>
  ${shot('home-desktop.png', 'Landing page — hero, quick links and the new navigation')}
  <div class="grid2" style="margin-top:5mm">
    ${shot('home-sections.png', 'Live events and latest news (managed by the Publicity Committee)')}
    ${shot('bands.png', 'Bands — each band has its own page and dashboard')}
  </div>
  <div class="foot"><span>The Haven · Status report</span><span>2</span></div>
</section>

<section class="page">
  <p class="eyebrow">What's live</p>
  <h2>Sign-in, events and phones</h2>
  <div class="grid2">
    ${shot('signin.png', 'Sign in — members use Google; leaders use their issued credentials')}
    ${shot('events.png', 'Events with RSVP (shared with the app)')}
  </div>
  <div class="grid3" style="margin-top:5mm;grid-template-columns:1fr 1fr 1.2fr;align-items:start">
    ${shot('home-mobile.png', 'Phone — landing page', 'phone')}
    ${shot('menu-mobile.png', 'Phone — menu, laid out like the app', 'phone')}
    <div class="card">
      <h4>How people sign in</h4>
      <p><b>Members</b> tap <i>Continue with Google</i>. Their account is created automatically the first time, on the website or in the app.</p>
      <p><b>Leaders, the PCM executive and committee heads</b> open <i>Leadership sign-in</i> and use the email and password issued to them.</p>
      <p class="muted" style="margin:0">New accounts always start as members. Only an admin can give leadership access.</p>
    </div>
  </div>
  <div class="foot"><span>The Haven · Status report</span><span>3</span></div>
</section>

<!-- Dashboards -->
<section class="page">
  <p class="eyebrow">Who uses what</p>
  <h2>Dashboards</h2>
  <table>
    <tr><th style="width:24%">Dashboard</th><th style="width:22%">Who</th><th>What they can do</th></tr>
    <tr><td><b>Developer</b><br/><span class="muted">/admin → Developer</span></td><td>Developer</td><td>Everything in Admin, plus system checks: Supabase connection, sign-in providers, database update, storage and table counts.</td></tr>
    <tr><td><b>Leadership (Admin)</b><br/><span class="muted">/admin</span></td><td>PCM Chairperson, Vice Chairperson</td><td>Live counts with gold tiles for anything waiting; prayer requests, counseling scheduling, volunteer approvals, merch orders, messages; all bands with their heads and members; assign heads; users, roles and offices.</td></tr>
    <tr><td><b>Website content</b><br/><span class="muted">/admin (Publicity)</span></td><td>Publicity Committee</td><td>Posts and news, events, gallery and resources — exactly what the landing page, website and app show. No access to prayer or counseling.</td></tr>
    <tr><td><b>The Studio</b><br/><span class="muted">/studio</span></td><td>Publicity Committee and leaders</td><td>Make posters from ready-made templates (next page).</td></tr>
    <tr><td><b>Band dashboard</b><br/><span class="muted">/band-admin/&lt;band&gt;</span></td><td>Each band or committee head</td><td>Announcements, band events, band details and photo, real member list (email everyone, remove a member).</td></tr>
    <tr><td><b>My dashboard</b><br/><span class="muted">/member-dashboard</span></td><td>Every member</td><td>RSVPs, bands joined, prayer and counseling requests, orders, profile — with shortcuts to any dashboard the person runs.</td></tr>
  </table>
  <h3>Bands and committees</h3>
  <p>Welfare Band, Witnessing Band, Stu-MM, Creativity &amp; Arts Band, Education Committee and Catering Committee each have a head login and a dashboard. Bible Study Band, Health Band and the Publicity Committee are kept. The four new bands appear on the site once the database update runs.</p>
  <h3>Privacy (checked)</h3>
  <p>Using a copy of the database, we confirmed each role sees only what it should: prayer requests are visible to the PCM executive and leaders only; band heads manage only their own band; the Publicity Committee can publish but cannot read care requests.</p>
  <div class="foot"><span>The Haven · Status report</span><span>4</span></div>
</section>

<!-- Studio -->
<section class="page">
  <p class="eyebrow">For the Publicity Committee</p>
  <h2>The Studio</h2>
  <p>Anyone on the Publicity Committee can make a finished poster in a minute: pick a template, type the details, add a photo and download. The layout, colours and the <b>CBU SDA PCM logo with the ministry's full name</b> are built in, so posters always look right. The Haven logo is not used on posters.</p>
  ${shot('studio-gallery.png', 'The Studio — choose a template')}
  <h3>Templates</h3>
  <table>
    <tr><th style="width:28%">Template</th><th>What you can change</th></tr>
    <tr><td><b>Happy New Week</b></td><td>Greeting, headline, message, verse, hymn number, special song, background (ours or upload), headline font</td></tr>
    <tr><td><b>Happy Sabbath</b></td><td>Greeting, headline, line under it, verse, hymn number, special song, service times, background (ours or upload), headline font</td></tr>
    <tr><td><b>19:30 Prayer Meetings</b></td><td>Prayer Band, time, days (Sunday–Tuesday), venue (Mechanical Engineering Workshop), topic, presenter, moderator, verse</td></tr>
    <tr><td><b>Wednesday / Friday Vespers</b></td><td>Topic, presenter's name, title and <b>photo</b>, date, time, venue, <b>background photo of people</b></td></tr>
    <tr><td><b>Launch countdown</b></td><td>3, 2 or 1 days to go (colours change each day), headline, tagline, features, launch date, phone screen</td></tr>
  </table>
  <p class="muted" style="margin-top:3mm">Every template: Portrait (feeds), Square (WhatsApp) or Story (status) size · ministry name beside or under the logo · six headline fonts · text saved on the device while you work · PNG or HD download.</p>
  <div class="foot"><span>The Haven · Status report</span><span>5</span></div>
</section>

<section class="page">
  <p class="eyebrow">Studio</p>
  <h2>Making a poster</h2>
  <ol class="steps">
    <li>Sign in, then open <b>Studio (posters)</b> from your dashboard or the account menu (${SITE}/studio).</li>
    <li>Pick a template. Type over the example text — the counter warns you if a line is too long for the design.</li>
    <li>For Vespers, tap <b>Upload photo</b> for the presenter, and choose or upload a background photo. Use the sliders to keep faces in frame.</li>
    <li>Choose the size (Portrait, Square or Story) and a headline font if you like.</li>
    <li>Tap <b>Download PNG</b> and share it on WhatsApp, Facebook or Instagram.</li>
  </ol>
  ${studioPosters.length ? `<div class="grid3" style="margin-top:4mm">${studioPosters.map((s) => `<img src="${s}" style="width:100%;border-radius:2.5mm"/>`).join('')}</div><p class="muted" style="font-size:8pt;margin-top:1.5mm">Posters exported from the Studio</p>` : ''}
  ${launch.length ? `<h3>Launch countdown posters</h3><div class="launch">${launch.map((s) => `<img src="${s}"/>`).join('')}</div><p class="muted" style="font-size:8pt;margin-top:1.5mm">Ready to post three days, two days and one day before launch. Add the launch date in the Studio if you want it on them.</p>` : ''}
  <div class="foot"><span>The Haven · Status report</span><span>6</span></div>
</section>

<!-- Logins -->
<section class="page">
  <p class="eyebrow">Access</p>
  <h2>Dashboard logins</h2>
  ${
    withLogins
      ? `<div class="banner bad"><b>Confidential.</b> These passwords open the ministry's dashboards. Share each login only with its owner, privately, and ask them not to forward it.</div>`
      : `<div class="banner info">Passwords are left out of this copy. The developer holds the confidential copy and gives each person their login privately.</div>`
  }
  ${groups
    .map(
      (g) => `<h3>${g}</h3><table><tr><th style="width:27%">Role</th><th style="width:33%">Email</th>${withLogins ? '<th style="width:20%">Password</th>' : ''}<th>Dashboard</th></tr>${accounts
        .filter((a) => a.group === g)
        .map(
          (a) =>
            `<tr><td>${a.title}</td><td><code>${a.email}</code></td>${withLogins ? `<td><code>${a.password}</code></td>` : ''}<td class="muted">${a.panel}</td></tr>`
        )
        .join('')}</table>`
    )
    .join('')}
  <p class="muted" style="margin-top:4mm;font-size:8.5pt">Sign in at ${SITE}/login → <b>Leadership sign-in</b>. The same logins work in the app. They use <code>@thehaven.test</code> addresses, which are not real inboxes, so “Forgot password?” emails cannot arrive; the developer re-issues passwords instead. Switch to real ministry emails when ready.</p>
  <div class="banner warn" style="margin-top:4mm"><b>To switch these logins on:</b> in Supabase open <b>SQL Editor → New query</b>, paste the file <code>supabase/provision.local.sql</code> (kept privately by the developer) and press <b>Run</b>. The table at the end shows every login with its role.</div>
  <div class="foot"><span>The Haven · Status report${withLogins ? ' · CONFIDENTIAL' : ''}</span><span>7</span></div>
</section>

<!-- Working / not working -->
<section class="page">
  <p class="eyebrow">Honest status</p>
  <h2>What's working, what's not</h2>
  <div class="grid2">
    <div class="card">
      <h4 style="color:#067647">Working and checked</h4>
      <ul class="list">
        <li>Website live at ${SITE.replace('https://', '')}; every public page loads</li>
        <li>Events, news and bands read live from Supabase</li>
        <li>RSVP, join a band, prayer, counseling, volunteer, pledge and merch forms write to the same database as the app</li>
        <li>Studio: all templates; photo upload; PNG export in three sizes</li>
        <li>Google sign-in is switched on and completes at Google</li>
        <li>Logins file tested on a copy of the database: all 11 passwords, roles, offices and bands correct; safe to run twice</li>
        <li>Permissions tested per role (privacy of prayer requests, band-only access, Publicity publishing)</li>
        <li>Mobile app code: type checks and lint pass</li>
      </ul>
    </div>
    <div class="card">
      <h4 style="color:#b42318">Not working yet</h4>
      <ul class="list">
        <li><b>Dashboard logins and the four new bands</b> — not in the live database until the SQL file is run</li>
        <li><b>Google sign-in and email links return to “localhost”</b> — Supabase's Site URL still points at a developer laptop</li>
        <li><b>Branded emails</b> — written, not yet pasted into Supabase</li>
        <li><b>Ministry Wi-Fi</b> — the router cannot look up supabase.co, so the site and app fail on that network</li>
        <li>Dashboards not yet tested with real signed-in accounts in production (needs the logins first)</li>
        <li>Counseling page lists sample counsellor profiles</li>
        <li>The app needs a new test build to show the new icon, splash and sign-in</li>
      </ul>
    </div>
  </div>
  <h3>Also note</h3>
  <ul class="list">
    <li>Supabase's built-in email service sends only a few emails an hour; connect a mail service (for example Resend) before relying on emails. Members use Google, so this mainly affects password resets.</li>
    <li>The team intro deck in <code>presentation/</code> still shows the old logo.</li>
  </ul>
  <div class="foot"><span>The Haven · Status report</span><span>8</span></div>
</section>

<!-- Next steps -->
<section class="page">
  <p class="eyebrow">Next steps</p>
  <h2>To finish testing</h2>
  <ol class="steps">
    <li><b>Point Supabase at the live site (2 minutes).</b> Supabase → Authentication → URL Configuration: set <b>Site URL</b> to <code>${SITE}</code>. Under <b>Redirect URLs</b> add <code>${SITE}/**</code>, <code>http://localhost:3000/**</code>, <code>thehaven://**</code> and <code>exp://**</code>. This fixes Google sign-in and email links landing on localhost.</li>
    <li><b>Switch on the logins.</b> Run <code>supabase/provision.local.sql</code> in the SQL Editor (page 7). This also adds Stu-MM, Creativity &amp; Arts, Education and Catering.</li>
    <li><b>Branded emails.</b> Supabase → Authentication → Email Templates: paste the files in <code>supabase/email-templates/</code> with their subjects.</li>
    <li><b>Test each dashboard</b> with its login: post news as Publicity, make a poster in the Studio, post an announcement as a band head, approve a volunteer as the Chairperson, run the Developer checks.</li>
    <li><b>Fix the Wi-Fi.</b> Set the router's DNS to 1.1.1.1 and 8.8.8.8 (or set it on each phone and laptop).</li>
    <li><b>Members:</b> ask a few students to sign in with Google on the website and the app, RSVP, join a band and send a test prayer request.</li>
    <li><b>App test build:</b> add the Supabase settings to Expo (EAS) and build a test APK so testers can install it.</li>
    <li><b>Before launch:</b> real emails for the leadership logins, real counsellor profiles, a mail service for emails, and the launch date on the countdown posters.</li>
  </ol>
  <div class="card" style="margin-top:6mm">
    <h4>Faster option for steps 1–3</h4>
    <p style="margin:0">If the developer adds a Supabase access token to the private file <code>.env.admin.local</code>, one command (<code>npm run provision</code>) does steps 1–3 automatically and switches on Google sign-in settings.</p>
  </div>
  <div class="foot"><span>The Haven · Status report</span><span>9</span></div>
</section>

<!-- Brand -->
<section class="page">
  <p class="eyebrow">Brand</p>
  <h2>Logo, posters and email</h2>
  <p>The Haven's logo is now text only: a gold italic <i>the</i>, <b>Haven</b> in Fraunces, and a gold full stop for the light. Posters and official material carry the <b>CBU SDA PCM</b> shield with the full name, <b>The Copperbelt University SDA Public Campus Ministries</b>.</p>
  ${uri(r('brand-kit/brand-sheet.png')) ? `<img src="${uri(r('brand-kit/brand-sheet.png'))}" style="width:100%;border-radius:3mm;border:1px solid #e4e7ec"/>` : ''}
  ${posters.length ? `<h3>Ready-made posters</h3><div class="posters">${posters.map((p) => `<img src="${p}"/>`).join('')}</div>` : ''}
  ${shot('email-welcome.png', 'Welcome email for new members (to paste into Supabase)', '')}
  <div class="foot"><span>The Haven · Status report</span><span>10</span></div>
</section>

</body></html>`
}

async function main() {
  fs.mkdirSync(r('reports'), { recursive: true })
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' })
  const page = await browser.newPage()
  for (const [withLogins, name] of [
    [true, 'The-Haven-Status-Report-CONFIDENTIAL.pdf'],
    [false, 'The-Haven-Status-Report.pdf'],
  ]) {
    await page.setContent(html({ withLogins }), { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    await page.pdf({ path: r('reports', name), format: 'A4', printBackground: true, preferCSSPageSize: true })
    console.log('✓', path.join('reports', name))
  }
  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
