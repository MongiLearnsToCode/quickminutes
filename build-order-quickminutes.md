# 🔍 Build Order / Verification Checklist

## 1. Core Project Setup
- [ ] ✅ Next.js project initialized and running locally
- [ ] ✅ TypeScript + linting/prettier working
- [ ] ✅ Environment variables properly loaded (no hardcoding secrets)

---

## 2. Authentication (Better-Auth)
- [ ] ✅ Better-Auth installed and configured
- [ ] ✅ Google OAuth flow works (login/logout tested)
- [ ] ✅ Microsoft OAuth flow works (optional, but good for corporate users)
- [ ] ✅ User sessions persist across refresh
- [ ] ✅ Auth middleware protecting routes

---

## 3. Database (Neon Postgres)
- [ ] ✅ Connection string set and secure
- [ ] ✅ Migration system in place (Prisma, drizzle, etc.)
- [ ] ✅ `users` table created and linked to Better-Auth user IDs
- [ ] ✅ `meetings` table created (metadata: file path, duration, status)
- [ ] ✅ `transcripts` + `summaries` tables created
- [ ] ✅ Queries tested for read/write access

---

## 4. Payments (Polar.sh)
- [ ] ✅ Polar.sh account + API keys set
- [ ] ✅ Subscription tier created (free vs paid plan)
- [ ] ✅ Webhook configured to update payment status in Neon
- [ ] ✅ User paywall logic works (premium features blocked until subscription is active)
- [ ] ✅ Billing page shows correct plan + status

---

## 5. File Storage (Cloudflare R2)
- [ ] ✅ Bucket created + access keys working
- [ ] ✅ File upload tested (small and large audio)
- [ ] ✅ Signed URLs in place (no public file leaks)
- [ ] ✅ Metadata stored in Neon after upload
- [ ] ✅ Deletion tested (removes file + db entry)

---

## 6. AI Pipeline
- [ ] ✅ Whisper transcription endpoint working
- [ ] ✅ Transcript saved in Neon + viewable in UI
- [ ] ✅ GPT summarization tested (key points + action items extracted)
- [ ] ✅ Output stored + displayed correctly
- [ ] ✅ Failures handled gracefully (e.g., bad audio file)

---

## 7. UI/UX
- [ ] ✅ Upload page functional
- [ ] ✅ Progress bar/loader works during transcription
- [ ] ✅ Results page shows transcript + summary
- [ ] ✅ Export to TXT/PDF works
- [ ] ✅ Meeting history page shows past uploads

---

## 8. Security / Privacy
- [ ] ✅ Secrets not hardcoded in repo
- [ ] ✅ User data scoped correctly (no cross-user leaks)
- [ ] ✅ File access locked behind auth
- [ ] ✅ “Delete meeting” option works
- [ ] ✅ Privacy policy drafted

---

## 9. Deployment
- [ ] ✅ App deploys to Vercel (frontend + backend routes)
- [ ] ✅ Neon connection works in production
- [ ] ✅ R2 bucket accessible from production
- [ ] ✅ Better-Auth callbacks configured for prod domain
- [ ] ✅ Polar.sh webhooks working in prod

