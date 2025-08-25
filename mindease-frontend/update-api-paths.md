# API Path Updates Needed

The backend routes have been changed from `/*` to `/*` to fix the double `/api` issue.

## Files to Update:

### 1. App.tsx
- `/auth/me` → `/auth/me`

### 2. Login.tsx  
- `/auth/login` → `/auth/login`
- `/auth/google` → `/auth/google` (already updated)

### 3. SignUp.tsx
- `/auth/register` → `/auth/register`
- `/auth/google` → `/auth/google` (already updated)

### 4. OAuthSuccess.tsx
- `/auth/me` → `/auth/me`

### 5. Activities.tsx
- `/activities` → `/activities`
- `/activities/${id}/toggle` → `/activities/${id}/toggle`
- `/activities/${id}` → `/activities/${id}`

### 6. Settings.tsx
- `/settings` → `/settings`

### 7. Review.tsx
- `/ai/analysis` → `/ai/analysis`
- `/ai/quotes/positive` → `/ai/quotes/positive`

### 8. JournalEntry.tsx
- `/journal` → `/journal`

### 9. Progress.tsx
- `/progress` → `/progress`
- `/ai/assessment/history` → `/ai/assessment/history`
- `/ai/assessment/generate` → `/ai/assessment/generate`

### 10. SharedJournals.tsx
- `/journal/shared` → `/journal/shared`
- `/journal/${id}` → `/journal/${id}`

### 11. JournalList.tsx
- `/journal` → `/journal`
- `/journal/${id}` → `/journal/${id}`

### 12. Dashboard.tsx
- `/dashboard/stats` → `/dashboard/stats`
- `/journal` → `/journal`
- `/activities` → `/activities`
- `/mood` → `/mood`

### 13. JoyCorner.tsx
- `/progress` → `/progress`
- `/progress/update` → `/progress/update`

### 14. MoodTracker.tsx
- `/mood` → `/mood`
- `/mood/${id}` → `/mood/${id}`

## Quick Find & Replace:

Search for: `/
Replace with: `/

This will update all API paths at once.
