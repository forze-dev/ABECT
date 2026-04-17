# ABECT Frontend — Full Project Audit Report
**Date:** 2026-04-17  
**Scanned:** All source files in `/src`, config files, Docker/deploy files  
**Excluded:** `node_modules`, `.next`, `public`, `.git`

---

## 1. npm audit — Dependency Vulnerabilities

```
8 vulnerabilities (3 moderate, 2 high, 3 critical)
```

| Package | Severity | CVE / Advisory | Fix |
|---|---|---|---|
| `@payloadcms/graphql <3.79.1` | **CRITICAL** | Pre-Auth Account Takeover via password recovery parameter injection — [GHSA-hp5w-3hxx-vmwf](https://github.com/advisories/GHSA-hp5w-3hxx-vmwf) | Upgrade `@payloadcms/next` → `3.83.0` |
| `payload <=3.81.0` | **CRITICAL** | Depends on vulnerable `@payloadcms/graphql`, `file-type`, `undici` | Upgrade `payload` → `3.83.0` |
| `next 9.5.0–15.5.14` | **HIGH** | DoS via Image Optimizer, HTTP smuggling in rewrites, unbounded disk cache, DoS with Server Components — [GHSA-9g9p-9gw9-jx7f](https://github.com/advisories/GHSA-9g9p-9gw9-jx7f), [GHSA-ggv3-7p47-pfv8](https://github.com/advisories/GHSA-ggv3-7p47-pfv8), others | Upgrade `next` → `15.5.15` |
| `undici 7.0.0–7.23.0` | **HIGH** | WebSocket parser overflow, HTTP smuggling, memory unbounded, CRLF injection — [GHSA-f269-vfmq-vjvj](https://github.com/advisories/GHSA-f269-vfmq-vjvj), others | Upgrade `payload` → `3.83.0` |
| `next-intl <4.9.1` | **MODERATE** | Open redirect vulnerability — [GHSA-8f24-v5vv-gm5j](https://github.com/advisories/GHSA-8f24-v5vv-gm5j) | Upgrade `next-intl` → `4.9.1` |
| `ajv 7.0.0-alpha.0–8.17.1` | **MODERATE** | ReDoS via `$data` option — [GHSA-2g4f-4pwh-qvx6](https://github.com/advisories/GHSA-2g4f-4pwh-qvx6) | Upgrade `payload` → `3.83.0` |
| `file-type 13.0.0–21.3.0` | **MODERATE** | Infinite loop in ASF parser — [GHSA-5v7r-6r5c-r473](https://github.com/advisories/GHSA-5v7r-6r5c-r473) | Upgrade `payload` → `3.83.0` |

**Action:** Run `npm audit fix --force` or manually pin:
```
payload → 3.83.0
@payloadcms/next → 3.83.0
next → 15.5.15
next-intl → 4.9.1
```
> Note: `--force` installs outside stated semver ranges. Test build after upgrade.

---

## 2. Code Issues by Severity

### CRITICAL

| # | File | Category | Description |
|---|---|---|---|
| 1 | `src/payload.config.ts` | SECURITY | `PAYLOAD_SECRET` defaults to `''` — empty string allows CMS access without auth if env var not set |
| 2 | `src/payload.config.ts` | SECURITY | `DATABASE_URI` defaults to `''` — silent connection failure, no startup validation |
| 3 | `src/utils/telegram.ts` | SECURITY | `threadId` can be `undefined` but passed directly to Telegram API without guard |
| 4 | `src/app/api/leads/route.ts:143` | SECURITY | `as any` cast bypasses TypeScript — arbitrary fields could be inserted into DB |
| 5 | `src/client/lib/blog.ts:148` | BUG | `p.id !== currentPostId` — `p.id` could be undefined; comparison unreliable |
| 6 | `src/client/lib/portfolio.ts` | BUG | Same null ID comparison issue in `getRelatedProjects` |
| 7 | `src/client/lib/services.ts` | BUG | Same null ID comparison issue in `getRelatedServices` |

### HIGH

| # | File | Category | Description |
|---|---|---|---|
| 8 | `src/client/lib/blog.ts` | MISSING | All lib files fall back to `localhost:3000` silently if `NEXT_PUBLIC_SERVER_URL` not set — causes wrong API calls in production without any warning |
| 9 | `src/client/lib/portfolio.ts` | MISSING | Same as above |
| 10 | `src/client/lib/services.ts` | MISSING | Same as above |
| 11 | `src/client/lib/calculator.ts` | MISSING | Same as above |
| 12 | `src/app/(frontend)/[locale]/layout.tsx:40` | MISSING | Dynamic `import()` of i18n messages JSON — no try/catch; crashes page if locale file missing |
| 13 | `src/client/i18n/request.ts:14` | MISSING | Dynamic import of messages JSON with no error fallback |
| 14 | `src/utils/telegram.ts:117` | MISSING | Silent `return false` when credentials missing — no log of which env var is absent |
| 15 | `src/client/components/ServicesCard/ServicesCard.tsx:60,65` | BUG | `as EventListener` cast on handler expecting `MouseEvent` — runtime type mismatch |
| 16 | `src/client/components/PortfolioCard/PortfolioCard.tsx:19` | BUG | Type guard `typeof x === 'object'` accepts any object; should check `.url` property |
| 17 | `src/client/components/RichTextHeadings/RichTextHeadings.tsx:17` | TYPE | `any` type for nodes array — should define proper content structure type |

### MEDIUM

| # | File | Category | Description |
|---|---|---|---|
| 18 | `src/collections/Comments.ts:22` | SECURITY | `update/delete` checks only `!!user` — any logged-in user (even moderator) can delete all comments |
| 19 | `src/collections/Users.ts:29` | SECURITY | Default user role is `'moderator'` — new users get elevated permissions automatically |
| 20 | `src/app/api/leads/route.ts` | MISSING | No rate limiting — endpoint accepts unlimited submissions (spam / DDoS vector) |
| 21 | `src/app/api/leads/route.ts` | MISSING | No CSRF protection — cross-site form submissions accepted |
| 22 | `src/client/components/Calculator/CalculatorContext.tsx:339` | MISSING | `localStorage` access not wrapped — fails silently in private browsing / storage quota exceeded |
| 23 | `src/utils/telegram.ts:127` | MISSING | No fetch timeout — Telegram API call can hang indefinitely |
| 24 | `src/utils/generateSlug.ts` | BUG | Incomplete transliteration map — missing some Ukrainian chars, produces gaps in slugs |
| 25 | `src/client/lib/leads.ts:113` | TYPE | Email regex too permissive — accepts `a@b.c` and similar invalid formats |
| 26 | `src/client/components/ContactModal/ContactModal.tsx:229` | MISSING | `maxLength=500` with no visible counter or error message for user |
| 27 | `src/collections/Services.ts:111,172` | MISSING | Price fields accept negative numbers — no `min` constraint |
| 28 | `src/collections/Portfolio.ts:71` | MISSING | `projectUrl` field has no URL validation |
| 29 | `src/client/components/Calculator/Calculator.tsx:98` | BUG | Hardcoded Ukrainian string `'Орієнтовна вартість:'` — should use i18n translation |
| 30 | `src/client/components/Header/Header.tsx` | MISSING | Mobile menu has no focus trap — keyboard users can tab outside open modal |
| 31 | `src/client/components/Footer/Footer.tsx:16` | BUG | `setCurrentYear` called every render — should be inside `useEffect` with `[]` deps |

### LOW

| # | File | Category | Description |
|---|---|---|---|
| 32 | `src/collections/Posts.ts:4` | DEAD_CODE | `revalidateAll` inline arrow function repeated in every collection — could be a shared util |
| 33 | `src/client/lib/blog.ts` | PATTERN | `getAllPosts` and `getFeaturedPosts` have near-identical fetch code — should be abstracted |
| 34 | `src/client/lib/portfolio.ts` | PATTERN | Duplicate fetch pattern across multiple functions |
| 35 | `src/client/lib/services.ts` | PATTERN | Duplicate fetch pattern across multiple functions |
| 36 | `src/client/components/BlogCard/BlogCard.tsx:20` | PATTERN | Inconsistent Media type checking vs other components |
| 37 | `src/client/components/RichText/RichText.tsx` | MISSING | No error boundary around rich text renderer — malformed data from CMS crashes component |
| 38 | `src/client/providers/ModalProvider.tsx:32` | PATTERN | Global click listener on document instead of targeted event delegation |
| 39 | `.env.example` | MISSING | `TELEGRAM_THREAD_ID` is undocumented — no comment explaining what it is |
| 40 | `eslint.config.mjs` | PATTERN | `no-explicit-any` and `ban-ts-comment` set to `'warn'` instead of `'error'` |
| 41 | `src/client/components/Footer/Footer.tsx:40` | MISSING | Phone links lack `aria-label` for screen readers |
| 42 | `src/middleware.ts:6` | PATTERN | Comment in Russian `'Это ключевая опция'` — rest of codebase uses Ukrainian/English |

---

## 3. Previously Fixed Issues (this session)

| Issue | Status |
|---|---|
| ISR `revalidate=300` on all pages | ✅ Removed — now SSG + on-demand |
| `next: { revalidate: 300 }` + `cache: 'force-cache'` conflict in all lib files | ✅ Fixed — `next: { tags: ['all'] }` only |
| `portfolio/[slug]` `generateStaticParams` fetching during Docker build → `ECONNREFUSED` | ✅ Fixed — removed, `dynamicParams=true` |
| Payload collections with no revalidation hooks | ✅ Fixed — `afterChange`/`afterDelete` → `revalidateTag('all')` on all 6 collections + CalculatorConfig global |
| `/api/send-telegram` open endpoint (no auth, accepts any message → Telegram) | ✅ Deleted |
| `sendMessageTG.ts` orphaned dead client service | ✅ Deleted |
| `/api/revalidate` route (user requested removal) | ✅ Deleted |
| `my-route` template leftover publicly accessible | ✅ Deleted |
| `THREAD_ID` vs `TELEGRAM_THREAD_ID` env var inconsistency in `send-telegram` | ✅ N/A — file deleted |
| `pnpm` vs `npm` inconsistency in `package.json` | ✅ Fixed — fully migrated to npm |

---

## 4. Priority Action Plan

### Immediate (before next deploy)
1. **Upgrade dependencies** — `payload@3.83.0`, `next@15.5.15`, `next-intl@4.9.1` (critical CVEs)
2. **Fix `PAYLOAD_SECRET` fallback** — throw error on startup if not set
3. **Fix `DATABASE_URI` fallback** — same
4. **Fix `as any` in `api/leads/route.ts:143`** — use proper typed interface

### Soon
5. Add rate limiting to `/api/leads` (e.g. `upstash/ratelimit` or nginx `limit_req`)
6. Fix Comments collection access — restrict update/delete to admin role only
7. Add fetch timeout to `utils/telegram.ts`
8. Fix null ID comparisons in `lib/blog.ts`, `lib/portfolio.ts`, `lib/services.ts`

### Nice to have
9. Abstract duplicate fetch pattern across lib files into a helper
10. Add error boundary around `<RichText>` component
11. Fix `setCurrentYear` in Footer — move to `useEffect(()=>{...}, [])`
12. Improve email validation regex
13. Add `aria-label` to phone links in Footer
