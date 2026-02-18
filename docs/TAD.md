# Technical Approach Document (TAD)

## 1. Architecture Overview

The application follows a layered architecture:

UI Layer
↓
Hooks Layer
↓
Service/API Layer
↓
Mock Data / API

This ensures:
- Separation of concerns
- Maintainability
- Testability
- Scalability

---

## 2. Tech Stack

### Core
- React + TypeScript
- React Router

### State & Data
- TanStack Query for async state
- Local state via useState

### Styling
- TailwindCSS (responsive utility-first styling)

### AI
- OpenAI API (or equivalent)
- AI logic isolated in `/ai` directory

---

## 3. Folder Structure
    src/
    ├── pages/
    │ ├── PatientList.tsx
    │ └── PatientDetails.tsx
    ├── components/
    │ ├── PatientCard.tsx
    │ ├── NotesList.tsx
    │ ├── AddNoteForm.tsx
    │ └── AISummaryPanel.tsx
    ├── services/
    │ └── patientService.ts
    ├── hooks/
    │ ├── usePatients.ts
    │ └── usePatientDetails.ts
    ├── ai/
    │ ├── summarizeNotes.ts
    │ └── parseIntent.ts
    ├── types/
    │ ├── patient.ts
    │ └── note.ts
    └── utils/

---

## 4. Data Flow Strategy

### Patient List Flow

Component
→ usePatients()
→ patientService.getPatients()
→ API/JSON

---

### Add Note (Optimistic Update Flow)

1. User submits note
2. Mutation triggered
3. Cache updated immediately
4. API request sent
5. Rollback on error

---

## 5. Performance Strategy

### 5.1 Code Splitting

- React.lazy for:
  - PatientDetails page
  - AI Summary Panel

Wrapped with Suspense fallback.

---

### 5.2 Skeleton Loading

- Custom skeleton components
- Used during:
  - Patient list loading
  - Patient details loading

---

### 5.3 Prevent Unnecessary Re-renders

- React.memo for pure components
- useCallback for handlers
- useMemo for computed data
- Proper dependency arrays

---

## 6. Responsive Design Strategy

- CSS Grid / Flexbox
- Breakpoints:
  - mobile: default
  - md: tablet
  - lg: desktop
- Cards stack vertically on mobile
- Multi-column layout on desktop

---

## 7. State Management Strategy

### Server State
Managed by TanStack Query:
- Automatic caching
- Background refetching
- Mutation handling
- Optimistic updates

### Local UI State
- Form input
- Modal visibility
- AI panel visibility

---

## 8. AI Integration Strategy

### 8.1 Intent → UI Action

Flow:
1. User enters natural language
2. parseIntent() function processes input
3. If action detected:
   - Dispatch state update
   - Trigger mutation

Fallback:
- If parsing fails → show error message

---

### 8.2 AI Summary Panel

Flow:
1. Collect notes
2. Send structured prompt to AI API
3. Receive summary
4. Display in panel
5. Cache summary result

Error Handling:
- Timeout handling
- Graceful fallback message

---

## 9. Error Handling Strategy

- Try/catch in service layer
- React Query error states
- User-friendly error messages
- Fallback UI for AI failures

---

## 10. Type Safety Strategy

- Strict TypeScript configuration
- Interfaces for:
  - Patient
  - Note
- No `any` usage
- Strongly typed API responses

---

## 11. Testing Strategy (Optional Extension)

- Unit test service layer
- Test optimistic update behavior
- Mock AI responses

---

## 12. Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| AI output inconsistency | Validate structured output |
| Slow AI response | Lazy-load AI features |
| Re-render performance | Memoization |
| State inconsistency | Centralized data layer |

---

## 13. Deployment Considerations

- Build optimization enabled
- Code splitting verified
- Environment variable handling for AI keys
- Production build tested

---

## 14. Conclusion

This technical approach ensures:

- Clean architecture
- Performance optimization
- AI integration
- Scalable design
- Production-level code quality
