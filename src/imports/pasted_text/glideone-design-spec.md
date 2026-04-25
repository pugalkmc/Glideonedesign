Design a modern, professional web application called "GlideOne" — a Telegram group 
management and automation platform for group admins. The interface should feel like 
a polished SaaS dashboard (think Linear, Vercel, or Notion) — minimal, functional, 
and trustworthy. Dark mode is the primary theme, with a clean light mode variant.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BRAND & DESIGN SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Brand Name: GlideOne
Tagline: "Automate. Moderate. Grow."
Logo: A minimalist sail/wing icon suggesting speed and direction.

Color Palette (Dark Mode Primary):
- Background:    #0A0A0F (near-black, slightly blue-tinted)
- Surface:       #111118 (card surfaces)
- Surface-2:     #1A1A24 (elevated surfaces)
- Border:        #2A2A38 (subtle borders)
- Primary:       #6366F1 (indigo — action buttons, highlights)
- Primary-Glow:  #818CF8 (hover states)
- Accent:        #06B6D4 (cyan — live/online indicators, badges)
- Success:       #10B981 (green — active modules, positive stats)
- Warning:       #F59E0B (amber — caution states, rate limits)
- Danger:        #EF4444 (red — bans, destructive actions)
- Text-Primary:  #F1F5F9
- Text-Secondary:#94A3B8
- Text-Muted:    #475569

Light Mode Palette:
- Background:    #F8FAFC
- Surface:       #FFFFFF
- Surface-2:     #F1F5F9
- Border:        #E2E8F0
- Primary:       #4F46E5
- Text-Primary:  #0F172A
- Text-Secondary:#475569
- Text-Muted:    #94A3B8

Typography:
- Font Family: Inter (sans-serif) for UI, JetBrains Mono for code/IDs
- Heading XL:  32px / 700 weight
- Heading LG:  24px / 600 weight
- Heading MD:  18px / 600 weight
- Body:        14px / 400 weight
- Small:       12px / 400 weight
- Micro:       11px / 500 weight / uppercase + letter-spacing for labels

Spacing Scale: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 48 / 64px

Border Radius:
- Small:  6px (inputs, badges)
- Medium: 10px (cards)
- Large:  16px (modals, panels)
- XL:     24px (hero cards)

Shadows:
- Card:   0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.24)
- Modal:  0 25px 50px rgba(0,0,0,0.6)
- Glow:   0 0 20px rgba(99,102,241,0.3) (for primary actions)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 1: LOGIN PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Layout: Centered card on a dark background with subtle animated gradient mesh.

Components:
- GlideOne logo + wordmark centered top
- Tagline in Text-Secondary
- "Sign in with Telegram" — large button with Telegram blue (#0088CC) + plane icon
- Subtle text: "Your groups, fully under control"
- Footer: "Secure • Private • No password required"

Background: Very subtle dark gradient with faint grid pattern or noise texture.
The card should have a faint border glow on hover (Primary-Glow color).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 2: MAIN DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Layout: Full-width sidebar layout.
- Left sidebar: 240px fixed, collapsible to 64px icon rail
- Main content: flex-fill, max-width 1280px centered

LEFT SIDEBAR:
- Top: GlideOne logo + collapse toggle
- Group switcher dropdown (shows avatar + group name + member count)
- Navigation sections:
  • Overview
    - Dashboard
    - Statistics
  • Moderation
    - Members
    - Mod History
    - Warnings
  • Automation
    - Modules (with count badge of enabled modules)
    - Filters
    - Triggers
    - Auto-Replies
    - Scheduled Jobs
  • Engagement
    - Rank System
    - Referrals
    - Invite Links
    - Forms & Surveys
  • Settings
    - Group Settings
    - Permissions
    - Command Aliases
- Bottom: User avatar + name + logout

Active state: Primary color left border accent + subtle background highlight.
Inactive state: Icon + text in Text-Secondary.

MAIN CONTENT — DASHBOARD:

Top bar:
- Page title "Dashboard"
- Group name pill with Telegram icon
- "Bot Active" green status badge
- Theme toggle (moon/sun)
- Notification bell with count

Stats Row (4 cards, equal width):
1. Total Members (icon: users) — number + "↑ +12 today" in green
2. Messages Today (icon: message-square) — number + trend sparkline
3. Actions Taken (icon: shield) — bans/mutes/kicks count + today delta
4. Active Modules (icon: zap) — "18 / 32" with progress ring

Quick Actions Row (horizontal pill buttons):
- [Ban Member] [Mute Member] [Purge Messages] [Broadcast] — all outlined style

Recent Activity Feed (left 2/3):
- List of recent moderation actions
- Each row: Avatar + "User @handle was banned" + reason chip + time ago
- Color-coded left border: red=ban, orange=mute, gray=kick, yellow=warn
- "View All" link

Module Status Grid (right 1/3):
- Compact grid of all 32 modules
- Each as a small pill: module name + colored dot (green=active, gray=off)
- Clicking navigates to that module config
- Title: "Active Modules"

Bottom Row — Two charts side by side:
Left: "Message Activity" — area chart (7 days), primary color fill
Right: "Moderation Breakdown" — donut chart (ban/mute/kick/warn), colored segments

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 3: MODULES PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is the most critical page. Must make 32 modules scannable and manageable.

Layout: Same sidebar. Main content has a module grid.

Top:
- Page title "Modules"
- Search input "Search modules..."
- Category filter tabs: All | Security | Automation | Gamification | Engagement | Utilities
- Active count: "18 enabled"

Module Grid (3 columns on desktop, 2 on tablet, 1 on mobile):
Each module card:
┌─────────────────────────────┐
│ [Icon]  Module Name    [●─] │  ← toggle switch right-aligned
│ Short description (1 line)  │
│ ─────────────────────────── │
│ [Configure →]               │
└─────────────────────────────┘

- Enabled state: card border has subtle Primary glow, toggle is indigo
- Disabled state: card is muted, semi-transparent, toggle is gray
- Icon: each module has a distinct icon (shield, zap, star, filter, bell, etc.)
- "Configure →" appears only when module is enabled, navigates to its settings

Module categories with icons:
- Security: AttackMode (flame), AntiBot (robot), FaceControl (id-card), 
  RateLimit (gauge), Captcha (puzzle), Lockdown (lock)
- Content: AutoFilter (funnel), ManualMod (gavel), Whitelist (check-circle),
  ReadOnly (eye-off), WarningSystem (alert-triangle)
- Verification: ChannelSubCheck (broadcast), FormVerification (clipboard-check)
- Entry: Welcome (hand-wave), Farewell (wave), NSFW-Detection (eye-slash)
- Automation: Triggers (bolt), AutoReplies (message-bot), ScheduledJobs (clock)
- Gamification: XP (trending-up), Reputation (star), RankSystem (trophy),
  Achievements (badge), ActionPoints (coins)
- Engagement: Statistics (bar-chart), ActivityLog (list), ChatActivity (activity),
  ReferralSystem (share), InviteLinks (link), FormsSurveys (list-checks)
- Infrastructure: Network (globe)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 4: FILTERS PAGE (AutoFilter module)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

28+ filters need clear organization. Use accordion groups.

Top:
- Page title "Content Filters" with back arrow
- "AutoFilter Module" breadcrumb
- Bulk action: "Disable All" | "Enable All" (danger/safe confirmation)

Filter Groups (accordion sections, default first group expanded):

GROUP 1: Text Filters (8 filters)
  ▶ Stop Words | Links | Telegram Links | Emails | Regex Patterns | 
    Language Filter | Allowed Words Only | Message Length

GROUP 2: Media Filters (9 filters)  
  ▶ Images | GIFs | Videos | Audio | Voice Messages | Stickers | 
    Video Messages | Files/Documents | Contacts

GROUP 3: Behavioral Filters (7 filters)
  ▶ Flood/Spam | Message Rate | Edited Messages | Album Size | 
    Bot Addition | Forwarding | Repost Bot

GROUP 4: Special Filters (6 filters)
  ▶ RTL Text | Chinese Characters | Dice/Emoji Games | 
    Referral Links | Bot Links | Channel Posts

GROUP 5: AI Filters (1 filter)
  ▶ NSFW Detection (AI-powered badge)

Each filter row (expanded accordion item):
┌──────────────────────────────────────────────────────────────┐
│ [●─] Stop Words              Action: [Delete ▼]  [Edit Rules]│
│      Remove messages containing banned words                 │
└──────────────────────────────────────────────────────────────┘

Action dropdown options: Delete | Warn | Mute 1h | Mute 24h | Kick | Ban
"Edit Rules" opens a side drawer with the word list / config.

Side Drawer (for filter configuration):
- Slides in from right, 480px wide
- Title: "Stop Words Configuration"
- Tag input for adding words (chip/tag UI)
- Existing words as removable chips
- "Save Changes" button at bottom

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 5: MEMBERS PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Top:
- Page title "Members"
- Stats row: Total | Active (7d) | Muted | Banned
- Search input + filter dropdown (All / Muted / Banned / Warned)
- "Export Members" button (secondary outlined)

Member Table:
Columns: Avatar + Name | Username | Join Date | Messages | Warnings | Status | Actions

- Avatar: round, 32px, fallback initials
- Status chip: "Active" green | "Muted" orange | "Banned" red | "Restricted" yellow
- Actions column: [•••] overflow menu → Warn | Mute | Kick | Ban | View Profile

Row hover: subtle background highlight
Banned rows: slightly muted opacity

Member Detail Drawer (opens right panel on row click):
- Large avatar + name + username
- Stats: Messages sent, XP, Reputation, Join date
- Warning history timeline
- Quick actions: [Warn] [Mute] [Kick] [Ban] [Whitelist]
- Mute: shows duration picker (1h, 6h, 24h, 7d, forever)
- Reason input field for all actions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 6: TRIGGERS PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Top:
- Page title "Triggers"  
- Description: "Create custom rules to automate actions"
- "+ New Trigger" button (Primary)

Trigger List:
Each trigger card:
┌──────────────────────────────────────────────────┐
│ [●─] Trigger Name                    [Edit] [🗑] │
│      When: message contains "promo"               │
│      Then: Delete + Mute 1h                       │
│      Hits: 47 times • Last: 2h ago                │
└──────────────────────────────────────────────────┘

Create/Edit Trigger Modal (large modal, 640px):
- Name input
- Event type selector: Message | Join | Leave | Reaction | Boost
- Conditions builder (visual, drag-and-drop):
  + Add Condition button
  Each condition row: [Field ▼] [Operator ▼] [Value input] [✕]
  AND/OR toggle between conditions
- Actions section:
  + Add Action button  
  Action chips: Delete | Warn | Mute | Kick | Ban | Reply | Pin | Forward
  Each action can have a parameter (duration, message text)
- Save button

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 7: RANK SYSTEM PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Visual, gamification-focused layout.

Top:
- Page title "Rank System"
- Enable/Disable toggle for whole module

Rank Tiers (vertical stack, ordered):
Each rank tier card (wider, more visual):
┌─────────────────────────────────────────────────┐
│ 🥇 Rank 5 — Legend          [Edit] [Delete]     │
│    Points Required: 5000 | Reputation: 100       │
│    ┌─────────────────────────────────────────┐   │
│    │ Perks: Can post links | Skip slow mode  │   │
│    └─────────────────────────────────────────┘   │
│    Members at this rank: 12                      │
└─────────────────────────────────────────────────┘

Colors per tier (gradient from bronze → silver → gold → diamond → legend):
- Tier 1: #CD7F32 (bronze)
- Tier 2: #C0C0C0 (silver)  
- Tier 3: #FFD700 (gold)
- Tier 4: #B9F2FF (diamond)
- Tier 5: #6366F1 (legend/indigo)

"+ Add Rank Tier" button at bottom

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 8: STATISTICS PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Data-heavy page, needs clean information hierarchy.

Top:
- Page title "Statistics"
- Date range picker: Today | 7 Days | 30 Days | Custom
- Group selector (if multi-group portfolio view)

KPI Cards Row (5 cards):
- Total Messages | Active Members | New Joins | Actions Taken | Engagement Rate

Charts Section:
Row 1 (2 charts):
- Left: "Message Volume" — area chart (time series, last 30 days)
- Right: "Member Growth" — line chart (cumulative joins vs leaves)

Row 2 (3 charts):
- Left: "Media Type Breakdown" — horizontal bar chart
- Center: "Top Active Members" — leaderboard list with avatars + message counts
- Right: "Moderation Breakdown" — donut chart

Row 3:
- "Language Distribution" — world map heat or horizontal bar
- "Peak Activity Hours" — 24h heatmap grid (hour × day of week)

All charts use Primary color palette. Tooltips on hover with exact values.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREEN 9: MINI APP (Telegram WebApp)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Mobile-first design. Runs inside Telegram's in-app browser.
Max width: 390px. Uses Telegram's native color variables.

Form Verification Mini App:
- Full screen, centered layout
- Group name + avatar at top
- Progress indicator (Step 1 of 3)
- Question text (large, readable)
- Answer options as large tap-friendly buttons (full width, 52px height)
- Back/Next navigation at bottom
- Submit confirmation screen with checkmark animation

Member Dashboard Mini App:
- Tab bar at bottom: Stats | Rank | Referrals
- Stats tab: XP bar, reputation score, message count
- Rank tab: Current rank card + next rank progress bar
- Referrals tab: personal invite link + copy button + referral count

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMPONENT LIBRARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design these reusable components in variants:

BUTTONS:
- Primary (filled indigo) | Secondary (outlined) | Ghost | Danger (red filled)
- Sizes: SM (28px) | MD (36px) | LG (44px)
- States: Default | Hover | Active | Disabled | Loading (spinner)
- With/without left icon

INPUTS:
- Text input (default, focus, error, disabled)
- Search input (with magnifier icon prefix)
- Textarea
- Select/Dropdown
- Tag/chip input (for word lists)
- Toggle switch (SM and MD)
- Checkbox | Radio button
- Slider (for duration/threshold config)
- Date picker / Date range picker
- Duration picker (1h / 6h / 24h / 7d / forever)

CARDS:
- Stat card (icon + number + label + trend)
- Module card (icon + name + toggle + configure link)
- Member row (avatar + name + stats + actions)
- Trigger card (name + condition summary + action chips + stats)

BADGES & CHIPS:
- Status: Active (green) | Muted (orange) | Banned (red) | Restricted (yellow)
- Module: Enabled (indigo) | Disabled (gray)
- Action: Ban | Mute | Kick | Warn | Delete (each color-coded)
- Category: Security | Automation | Gamification | Engagement (color-coded)
- AI Badge (gradient: purple → cyan, with sparkle icon) for NSFW module

NAVIGATION:
- Sidebar nav item (icon + label, default/active/hover states)
- Breadcrumb
- Tab bar (horizontal tabs with active underline)
- Pagination

FEEDBACK:
- Toast notification (success/error/warning/info) — bottom-right, slide-up
- Empty state (icon + title + description + CTA button)
- Loading skeleton (animated shimmer for cards and tables)
- Confirmation dialog (for destructive actions — ban/delete)
- Progress bar (linear, for rank XP progress)

OVERLAYS:
- Modal (SM: 400px | MD: 560px | LG: 720px) with backdrop blur
- Side drawer (right, 480px, slide-in animation)
- Dropdown menu (with dividers and icon items)
- Tooltip (dark, max 200px)
- Popover (for complex hover content)

TABLES:
- Full data table (sortable headers, row hover, pagination)
- Compact list table (for moderation log, activity feed)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UX PATTERNS & INTERACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Progressive Disclosure:
   - Module cards show toggle + brief desc; full config opens in drawer/modal
   - Filter groups are collapsed by default; expand on click
   - Destructive actions always require confirmation dialog

2. Inline Editing:
   - Click trigger name to rename inline (no modal needed)
   - Toggle switches update immediately with optimistic UI

3. Keyboard Navigation:
   - Escape closes modals/drawers
   - Cmd+K opens command palette (search across groups, members, settings)
   - Tab navigation in forms

4. Empty States:
   - Each empty section has relevant icon + friendly message + CTA
   - "No triggers yet → Create your first trigger"
   - "No banned members → Keep it up!"

5. Loading States:
   - Skeleton screens for initial data load (not spinners)
   - Button loading state during save (spinner replaces icon)

6. Feedback:
   - Every toggle change: instant toast "Welcome module enabled"
   - Every save: "Saved" with checkmark
   - Errors: inline field error OR toast for network errors

7. Responsive Breakpoints:
   - Desktop (1280px+): Full sidebar + 3-col grids
   - Tablet (768-1280px): Collapsed sidebar + 2-col grids
   - Mobile (<768px): Bottom nav bar + 1-col, modals become bottom sheets

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANIMATION & MOTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Sidebar collapse: 200ms ease
- Modal open: 150ms scale from 0.95 + fade
- Side drawer: 250ms slide from right
- Toast: 300ms slide up + auto-dismiss 4s
- Toggle: 150ms thumb slide
- Page transitions: 200ms fade
- Number counters: animate on first load (0 → value, 600ms)
- Chart lines: draw animation (500ms ease-out)
- Skeleton shimmer: 1.5s infinite gradient sweep

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACCESSIBILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Minimum contrast: 4.5:1 for body text, 3:1 for large text
- All interactive elements: 44px minimum touch target
- Focus rings: visible 2px Primary-colored outline
- Form inputs: always visible labels (no placeholder-only labels)
- Status indicators: never color-only (always icon + color)
- ARIA labels on all icon-only buttons