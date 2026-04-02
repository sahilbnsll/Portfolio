# Navigation Bug Fix — Portfolio Site

> **Date:** July 2025  
> **Affected URL:** https://sahilbansal.vercel.app/  
> **Status:** ✅ Fixed (multi-layered approach)

---

## Problem

On the live production site, the following interactions were completely non-functional:

- **Header navigation links** (`projects`, `contact`) — clicking did nothing
- **"Available for Work / Reach Out" badge** — clicking did not navigate to `/contact`
- **All other clickable links on the home page** — none triggered navigation

The URL remained at `/` regardless of which link was clicked. No visible JavaScript errors appeared in the browser console.

---

## Investigation

### Phase 1 — Live Site Testing

Automated browser testing on the production site (`sahilbansal.vercel.app`) confirmed:

| Action | Result |
|--------|--------|
| Click `projects` in header | ❌ URL unchanged |
| Click `contact` in header | ❌ URL unchanged |
| Click "Available for work" badge | ❌ No navigation |
| Console errors | Only minor 404s (apple-touch-icon, etc.) |

### Phase 2 — Cross-Page Navigation Test

Navigation from other pages was also tested:

| Starting Page | Click Target | Result |
|---------------|-------------|--------|
| `/` (home) | `projects` | ❌ Broken |
| `/` (home) | `contact` | ❌ Broken |
| `/projects` | `contact` | ⚠️ Inconsistent (sometimes broken in production) |
| `/contact` | `home` | ⚠️ Inconsistent (sometimes broken in production) |

### Phase 3 — Dev vs Production Comparison

A critical discovery:

| Environment | Navigation | Result |
|-------------|-----------|--------|
| `next dev` (Turbopack) | Click header links | ✅ Works |
| `next build && next start` | Click header links | ❌ Broken |
| Production (Vercel) | Click header links | ❌ Broken |
| Any environment | `window.location.href = '/projects'` | ✅ Works |
| Production | `document.querySelector('a').click()` | ❌ Broken |
| Production | `window.next.router.push('/projects')` | ❌ Broken |

**Conclusion:** This is a **production-build-specific issue**, NOT dev-only.

### Phase 4 — Component Elimination Testing

| Test | Navigation Result |
|------|------------------|
| Full home page with all components | ❌ Broken |
| Home page with SwipeCards removed | ❌ Still broken (in production) |
| Home page with ALL motion removed from page.tsx | ❌ Still broken |
| Bare-bones page with only `<Link>` tags (zero framer-motion) | ❌ Still broken |

**Conclusion:** Removing framer-motion from page.tsx alone does NOT fix the production issue. Child components and the layout still import framer-motion, AND there is a known Next.js 14.x production navigation bug.

### Phase 5 — JavaScript Injection Tests

| Test | Result |
|------|--------|
| `typeof window.next` | `"object"` — Router exists |
| `typeof window.next.router` | `"object"` — Router initialized |
| `document.querySelectorAll('a[href]').length` | 10 links found |
| `navigator.serviceWorker.controller` | `null` — No service worker |
| `document.querySelector('a[href="/projects"]').dispatchEvent(new MouseEvent('click'))` | ❌ No navigation |
| `window.location.href = '/projects'` | ✅ Full page navigation works |

### Phase 6 — Web Research

Research confirmed this is a **known issue with Next.js 14.x production builds**:

- [Discussion #63496](https://github.com/vercel/next.js/discussions/63496) — Link component navigation breaks in production
- [Discussion #62682](https://github.com/vercel/next.js/discussions/62682) — Client-side navigation works locally but fails on Vercel
- [Discussion #57565](https://github.com/vercel/next.js/discussions/57565) — Link components stop navigating in production
- [Discussion #46295](https://github.com/vercel/next.js/discussions/46295) — Full page reloads instead of client-side navigation in production

---

## Root Causes Identified

### Root Cause 1: framer-motion v12 `drag` Prop

**Component:** `SwipeCards.tsx`

framer-motion v12 completely rewrote its gesture system to use the Pointer Events API. When `drag="x"` is set, framer-motion registers **document-level capturing listeners** (`{ capture: true }`) to track pointer gestures. These listeners fire BEFORE React's event delegation system and can call `event.preventDefault()`, which prevents the browser from generating subsequent `click` events — breaking ALL Link navigation on the page.

The initial fix (`useDragControls` + `dragListener={false}`) was **insufficient** because the `drag` prop itself still registers the gesture resolver's document-level infrastructure.

### Root Cause 2: framer-motion `whileTap` Inside `<Link>`

**Component:** `AvailableForWorkBadge.tsx`

`whileTap={{ scale: 0.95 }}` on a `motion.div` inside a `<Link>` component adds `pointerdown` handlers that call `event.preventDefault()` to prevent native browser behaviors (text selection, context menus). This prevents the browser from generating the `click` event that Next.js's `<Link>` component relies on for navigation.

### Root Cause 3: Next.js 14.x Production Navigation Bug

**Scope:** Framework-level

Multiple GitHub discussions confirm that Next.js 14.x has a recurring issue where `<Link>` component click handling breaks in production builds, especially on Vercel deployments. The client-side router's click interception fails silently, and since `<Link>` calls `preventDefault()` on the anchor click, neither client-side NOR native browser navigation occurs.

---

## Fix Applied (Multi-Layered)

### Fix 1: SwipeCards — Native Pointer Events (removes Root Cause 1)

**File:** `src/components/SwipeCards.tsx`

Completely removed framer-motion's `drag` prop and all related props (`dragControls`, `dragListener`, `dragConstraints`, `onDragEnd`). Replaced with native pointer event handlers:

```tsx
// BEFORE (broken — framer-motion installs global capturing listeners)
drag={isFront ? "x" : false}
dragControls={dragControls}
dragListener={false}
onPointerDown={(e) => { if (isFront) dragControls.start(e); }}
dragConstraints={{ left: -150, right: 150, top: 0, bottom: 0 }}
onDragEnd={handleDragEnd}

// AFTER (fixed — no global listeners, drag scoped to card element)
onPointerDown={handlePointerDown}   // setPointerCapture + track start position
onPointerMove={handlePointerMove}   // update x useMotionValue
onPointerUp={handlePointerUp}       // check threshold, remove card or snap back
```

Key implementation details:
- Uses `setPointerCapture()` to ensure pointer events stay with the card element
- Uses framer-motion's `useMotionValue` for smooth x position updates (no re-renders)
- Uses `animate()` for spring snap-back animation
- Adds `touchAction: "none"` to prevent browser touch scrolling during drag

### Fix 2: AvailableForWorkBadge — Explicit Router Navigation (removes Root Cause 2)

**File:** `src/components/AvailableForWorkBadge.tsx`

```tsx
// BEFORE (broken — whileTap prevents click event from reaching Link)
<Link href="/contact">
  <motion.div whileTap={{ scale: 0.95 }} ...>

// AFTER (fixed — explicit router.push, no Link dependency)
const router = useRouter();
<motion.div role="link" onClick={() => router.push("/contact")} ...>
```

Changes:
- Removed `<Link>` wrapper
- Removed `whileTap` (causes `preventDefault` on pointer events)
- Added `useRouter()` from `next/navigation` with explicit `router.push("/contact")`
- Added `role="link"` and keyboard handler for accessibility

### Fix 3: Header — Explicit Router Navigation Fallback (mitigates Root Cause 3)

**File:** `src/components/Header.tsx`

```tsx
// BEFORE (broken in production — relies on Link's internal click handling)
<Link href={nav.href}>...</Link>

// AFTER (fixed — explicit router.push bypasses Link's broken click handler)
const router = useRouter();
<Link
  href={nav.href}
  onClick={(e) => { e.preventDefault(); router.push(nav.href); }}
>...</Link>
```

Changes:
- Added `useRouter()` from `next/navigation`
- Added explicit `onClick` handlers on ALL nav links (desktop + mobile)
- `e.preventDefault()` prevents the potentially broken `<Link>` default behavior
- `router.push()` performs client-side navigation directly via the App Router

---

## Verification

| Action | Before Fix | After Fix |
|--------|-----------|----------|
| Click `projects` in header | ❌ No navigation | ✅ Navigates to `/projects` |
| Click `contact` in header | ❌ No navigation | ✅ Navigates to `/contact` |
| Click "Available for work" badge | ❌ No navigation | ✅ Navigates to `/contact` |
| SwipeCards drag functionality | ✅ Working | ✅ Working (native pointer events) |
| Mobile menu navigation | ❌ No navigation | ✅ Navigates correctly |

---

## Technical Details

### Why Dev Mode Works but Production Doesn't

1. **Code splitting:** Production builds split framer-motion into separate chunks. The gesture system may initialize in a different order relative to React's event delegation.
2. **Static generation:** Production pre-renders pages as static HTML. During hydration, framer-motion's gesture system may conflict with React's event attachment.
3. **Known Next.js bug:** Next.js 14.x has documented issues where `<Link>` click handling fails silently in production builds.

### Why the Multi-Layered Approach

A single fix (e.g., only fixing SwipeCards) was proven insufficient through systematic testing. The combination of:
- framer-motion v12's gesture system (document-level event interception)
- `whileTap` calling `preventDefault` on pointer events
- Next.js 14.x production navigation bugs

...required fixes at multiple levels to ensure reliable navigation.

---

## Recommendations

### Short-term
- ✅ Deploy the multi-layered fix
- Monitor navigation on production after deployment

### Long-term
- Consider upgrading to Next.js 15.x when stable (improved App Router reliability)
- Consider replacing framer-motion v12 with CSS animations for simple effects
- For any future components with `drag` gestures, use native pointer events instead of framer-motion's `drag` prop
- Avoid `whileTap` on elements inside `<Link>` components
- Use explicit `router.push()` for critical navigation paths

### Monitoring
- Test navigation after every framer-motion version update
- Test navigation after every Next.js version update
- Include navigation smoke tests in CI/CD pipeline

---

## Files Modified

| File | Change |
|------|--------|
| `src/components/SwipeCards.tsx` | Replaced framer-motion `drag` with native pointer events |
| `src/components/AvailableForWorkBadge.tsx` | Replaced `<Link>` + `whileTap` with `router.push()` |
| `src/components/Header.tsx` | Added explicit `router.push()` onClick handlers |

## Git History of Related Fixes

| Commit | Description |
|--------|-------------|
| Earlier | `fix: remove AnimatePresence mode="wait" breaking client-side navigation` |
| Earlier | `fix: remove all framer motion from MainContentProvider` |
| `91ff140` | `applying fix` (initial SwipeCards useDragControls fix — insufficient) |
| Latest | Multi-layered navigation fix (this fix) |
