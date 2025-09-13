# 📄 Product Requirements Document (PRD)  
**Product:** AI Meeting Notes MVP  
**Owner:** [Insert Startup Name Here]  
**Date:** [Today’s Date]  

---

## 1. Problem Statement  
People hate taking notes during meetings. They either zone out, forget details, or waste time writing things down instead of participating. Existing tools are bloated, expensive, or not integrated into daily workflows.  

---

## 2. Goal  
Build a minimal, working product that automatically transcribes a recorded meeting and produces a clean, summarized version with action items. Deliver it fast, test with real users, and charge money as soon as possible.  

---

## 3. Core Features (MVP)  
1. **Audio Input**  
   - Upload audio file (mp3, wav).  
   - (Stretch goal: live Zoom/Meet integration).  

2. **Transcription**  
   - Generate text transcript from meeting audio using AI.  
   - Label speakers (basic “Speaker 1, Speaker 2” is acceptable).  

3. **Summarization**  
   - AI-generated summary of key points.  
   - Extract action items (bulleted list).  

4. **Export/Share**  
   - Copy to clipboard.  
   - Export as TXT/PDF.  

---

## 4. Out of Scope (for MVP)  
- Fancy formatting (slides, highlights, themes).  
- Multi-language translation.  
- Task manager integrations.  
- Real-time “live notes.”  

---

## 5. User Flow  
1. User uploads meeting recording.  
2. App shows transcription progress bar.  
3. Transcript + summary + action items appear.  
4. User exports notes or copies them.  

---

## 6. Success Metrics  
- **Adoption:** At least 20 active users in the first month.  
- **Retention:** >50% of users come back for at least 3 meetings.  
- **Monetization:** 5 users willing to pay within 60 days.  

---

## 7. Tech Stack  
- **Frontend:** Next.js  
- **Backend:** Next.js API routes (expandable later)  
- **Database:** Neon Postgres (user accounts, transcripts, summaries, metadata)  
- **File Storage:** Cloudflare R2 (for audio files)  
- **Authentication:** Better-Auth (with Google/Microsoft login support)  
- **Payments:** Polar.sh (subscription/paywall)  
- **AI Services:**  
  - OpenAI Whisper → transcription  
  - GPT (4 or 4o-mini) → summarization + action items  

---

## 8. Risks  
- **Accuracy:** Transcription or summarization errors reduce trust.  
- **Audio Quality:** Background noise or accents may affect usability.  
- **Privacy/Security:** Users may be hesitant to upload sensitive recordings.  
- **Competition:** Existing tools (Otter.ai, Fireflies.ai, etc.) with established user bases.  

---

