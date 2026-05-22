# Pixify Core UX Rebuild

Rebuild the app to exactly match the 7 screenshots you uploaded. Keep the existing visual language (serif headings, beige/cream accents, soft borders, pill badges), but replace the page contents and IA.

## Sidebar (final, locked)

Replace `AppSidebar` items with exactly these (in order), and remove MVP/show-all toggling:

1. Dashboard → `/dashboard`
2. Guidelines → `/guideline`
3. Asset Library → `/library`
4. Governance → `/governance` (badge `5`)
5. Brand Health → `/brand-health` (badge `2`)
6. Admin Portal → `/admin`
7. Settings → `/settings`

Header: **Pixify** wordmark (replace logo tile).
Brand switcher row: **PEP · Pepsi MENA · Switch brand**.
Footer: **Ask Pixify ⌘K** button + tiny avatars row "3 members online".

All other sidebar entries (Marketing, Competitors, Roadmaps, Generate, Template, Mindmap, Design System, Playbook, Requests, Brand Consistency) are hidden. Their routes are removed from `AnimatedRoutes`.

Top bar (inside main): centered search input "Search assets, guidelines, anything… ⌘F", bell icon + SA avatar on the right.

## Screen 1 — Dashboard (`/dashboard`)

Layout matches `image-14.png`:
- Eyebrow `PEPSI MENA` + H1 `Dashboard`, right side `Refresh score` button.
- **Ask Pixify card** (full width): sparkle icon, title `Ask Pixify`, subline `Pepsi MENA · Guidelines v3.2 · Brand guardian, not a content creator`. 4 suggestion chips. Input row with paperclip + black `Ask` button. `Open full chat ↗` top-right.
- 3-column row:
  - **Brand Health Score** card (left, narrow): `BRAND HEALTH SCORE` eyebrow, animated donut `78 / 100 ↓ 4 this week`, then 4 weighted bars (Visual Identity 40% 82, Messaging 30% 74, Strategic Alignment 20% 80, Governance 10% 65), `Full health report ›` link.
  - **Connected Touchpoints** card (middle, wide): `+ Add` button. List rows: `cokelight.com` (Website, 1 issue, 2 sub-rows), `@cocacolalight` (Instagram, Pass), `Coca-Cola Light` (LinkedIn, 1 issue). Each with `View details →`.
  - **Live Findings** card (right): `3 open · View all →`. 3 finding rows with severity dot + title + meta + `Fix →`.
- **Compliance Check** band (full width): eyebrow + `Upload an asset to check against brand guidelines`, `Upload & Check` button, 4 asset thumb cards with Pass/Issue pills.

## Screen 2 — Guidelines (`/guideline`)

Layout matches `image-15.png` and `image-16.png`:
- Top: `← Back` + search bar.
- Left rail: `SECTIONS` + PDF button, nav items (Introduction, Logo, Colors, Typography, Voice & Tone, Imagery, Spacing, Examples), version block `v3.2 Published Jan 12, 2026`.
- Right: per-section content. Implement all 8 sections with the exact Introduction and Logo content from the screenshots; Colors/Typography/etc. get plausible filler in the same card style. Section IDs scroll-anchored.

## Screen 3 — Asset Library (`/library`)

Layout matches `image-17.png`:
- Left rail: `LIBRARY` + `Upload` button, tree: Social Media (Instagram, Stories, TikTok), Campaigns (Summer '26, Ramadan '26, Q4 Promo), Brand Assets (Logos, Colors, Fonts), Email, Display Ads. Each with count.
- Top toolbar: search, Filter, grid/list toggle, `Upload` button.
- Counts row: `12 assets · 8 passed · 3 warnings · 1 failed`.
- Asset grid (12 cards) with Pass/Issue/Fail pills, thumbnail placeholder, title, meta `time · size`, tag chips.

## Screen 4 — Governance (`/governance`) — NEW

Layout matches `image-18.png`. Eyebrow `COCA-COLA LIGHT` + H1 `Brand Governance`, `Check asset` + `Re-scan touchpoints` buttons. 4 stat tiles (Open findings, Asset pass rate, Touchpoints monitored, Active rules). Upload dropzone band. Tabs `Open (4) | Resolved (1) | Rules (47)`. 4 finding rows with severity icon, title, source/channel/detected meta, rule pill, `Resolve` button.

## Screen 5 — Brand Health (`/brand-health`)

Replace existing with layout from `image-19.png`. Eyebrow + H1 `Brand Health Score`, `Refresh` + `Export PDF`. Red alert banner `Score dropped 4 points this week …` + `View issues`. Two-column: donut card (78/100) and category breakdown (4 weighted bars). Touchpoint Breakdown card with tabs (Website / Instagram / LinkedIn), 4 metric tiles, 3 category bars, issues list. Score History line chart `Last 30 days` with 7d/14d/30d toggle.

## Screen 6 — Admin Portal (`/admin`)

Replace existing tabbed admin with layout from `image-20.png`. Eyebrow + H1 `Admin Portal`, `+ Invite member`. Two columns: Team Members (4 rows: Sarah Al-Amin Admin, Karim Hassan Editor, Nina Petrov Editor, Lena Weber Viewer) + Audit Log (5 entries). Bottom: Role Permissions panel with 3 columns (Admin, Editor, Viewer) and bulleted abilities.

## Screen 7 — Settings (`/settings`) — NEW

Layout matches `image-21.png`. Eyebrow + H1 `Settings`. Left rail: Brand profile, Touchpoints, Notifications, Danger zone. Right: Brand profile form (name = `Coca-Cola Light`, industry = `Beverages`, `Save changes`). Brand Documents card with two file rows (Brand Strategy, Brand Guidelines) + Replace buttons, info banner, `+ Add brand document`.

## Routes

`AnimatedRoutes.tsx` keeps only:
- `/` (Index — landing, untouched)
- `/dashboard`, `/guideline`, `/library`, `/governance`, `/brand-health`, `/admin`, `/settings`
- `/auth` → redirect `/dashboard`
- Catch-all → NotFound

All other routes removed.

## Technical notes

- All new screens are pure presentational with hard-coded demo data (Pepsi MENA / Coca-Cola Light) — no Supabase wiring, matching the screenshots' demo nature. Existing pages stay on disk but are no longer routed.
- Use existing shadcn primitives (Card, Button, Badge, Tabs, Input, Progress, Avatar, Separator) and semantic tokens only (no raw hex). Donut + line chart via inline SVG.
- Create `src/pages/Governance.tsx` and `src/pages/Settings.tsx`; replace `Dashboard.tsx`, `Guideline.tsx`, `Library.tsx`, `BrandHealth.tsx`, `Admin.tsx`. Update `AppSidebar.tsx` and `AnimatedRoutes.tsx`.
- `FloatingAIAssistant` stays.

Confirm and I'll build it.
