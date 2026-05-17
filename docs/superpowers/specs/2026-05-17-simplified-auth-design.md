# Simplified Auth Flow Design

## Goal

Reduce registration friction by merging login/register into one page with three auth methods: Google OAuth, Magic Link, and traditional email/password. First-time users are auto-registered on any login method.

## User Flow

1. User clicks "Buy Now" on homepage
2. If not logged in → redirected to `/auth/login`
3. User picks one of three methods:
   - **Google OAuth**: Click button → Google consent → auto-create account → logged in
   - **Magic Link**: Enter email → receive email → click link → auto-create account → logged in
   - **Email/Password**: Enter credentials → login (or register if first time)
4. Redirected back to homepage to complete purchase

## Auth Methods

### Google OAuth

- Library: `next-auth` with Google provider
- Flow: Standard OAuth 2.0 authorization code flow
- On callback: check if user exists by email → if not, create with `name` from Google profile, `role: "CUSTOMER"`, no password
- Session strategy: JWT (matching existing auth pattern)
- Config: `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` env vars

### Magic Link

- Token: random 32-byte hex string, stored in `MagicLinkToken` table
- Expiry: 15 minutes
- Email: sent via Resend API (`resend` npm package)
- Link format: `https://{NEXT_PUBLIC_APP_URL}/auth/verify?token={token}`
- On verify: validate token → find/create user by email → create session cookie → delete token
- Config: `RESEND_API_KEY` and `RESEND_FROM` env vars

### Email/Password (existing)

- No changes to the existing register flow
- The register page is removed; the login page handles both login and auto-registration
- If email exists → login with password
- If email doesn't exist → create account with provided password

## Unified Login Page

Single page at `/auth/login` with three sections:

1. **Google button** (top, prominent)
2. **Magic Link form** (middle) — email input + "Send Magic Link" button
3. **Password form** (bottom) — email + password + "Login" button
4. **Footer text**: "Don't have an account? It's created automatically."

The `/auth/register` page is removed (redirect to `/auth/login`).

## Database Changes

New model `MagicLinkToken`:

```prisma
model MagicLinkToken {
  id        String   @id @default(cuid())
  email     String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `app/api/auth/[...nextauth]/route.ts` | Create | NextAuth Google provider |
| `app/api/auth/magic-link/route.ts` | Create | Generate token, send email |
| `app/api/auth/verify/route.ts` | Create | Verify token, login user |
| `app/auth/login/page.tsx` | Modify | Merge login + register, add Google & Magic Link UI |
| `app/auth/register/page.tsx` | Delete | Redirect to /auth/login |
| `prisma/schema.prisma` | Modify | Add MagicLinkToken model |
| `.env` | Modify | Add GOOGLE_*, RESEND_* vars |
| `package.json` | Modify | Add next-auth, resend dependencies |
| `messages/en.json` | Modify | Add new auth i18n keys |
| `messages/zh.json` | Modify | Add new auth i18n keys |

## Environment Variables

```
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
NEXTAUTH_URL="https://www.ziiy.fun"
NEXTAUTH_SECRET="<generated>"
RESEND_API_KEY=""
RESEND_FROM="noreply@ziiy.fun"
```

## Error Handling

- Google OAuth failure → show error on login page
- Magic Link email not delivered → show "Email may be in spam folder"
- Expired token → show "Link expired, request a new one"
- Invalid token → show "Invalid link"

## Security

- Magic link tokens are single-use and deleted after verification
- Tokens expire after 15 minutes
- Rate limit: max 3 magic link requests per email per hour
- Google OAuth uses state parameter (built into next-auth)
- All auth routes use HTTPS only
