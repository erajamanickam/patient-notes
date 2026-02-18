# Product Requirement Document (PRD)

## Project Title
Patient Notes Dashboard

## 1. Overview

The Patient Notes Dashboard is a responsive web application that allows users to:
- View a list of patients
- Access detailed patient visit information
- Add visit notes
- Interact with AI-powered features for enhanced usability

This project prioritizes:
- Performance
- Clean state management
- Responsive UI
- AI-assisted behavior
- TypeScript-first development

---

## 2. Goals

### Primary Goals
- Display patient data from a mock API or local JSON
- Provide detailed patient information and visit notes
- Allow adding new notes with optimistic UI updates
- Ensure high performance and responsive layout
- Implement at least two AI-powered agentic capabilities

### Secondary Goals
- Maintain clean architecture and separation of concerns
- Demonstrate production-level frontend engineering practices

---

## 3. Target Users

- Healthcare administrators (mock scenario)
- Internal dashboard users
- Developers evaluating frontend architecture and AI integration

---

## 4. Functional Requirements

### 4.1 Patient List Page

- Fetch patient data from:
  - Mock API OR
  - Local JSON file
- Display:
  - Patient Name
  - Age
  - Last Visit Date
- Clicking a patient:
  - Navigates to Patient Details page
- Implement route-based lazy loading

---

### 4.2 Patient Details Page

- Display:
  - Patient demographic information
  - Visit notes (chronological order)
- Allow:
  - Adding a new note
- New note behavior:
  - Optimistic UI update
  - Rollback on API failure

---

## 5. AI / Agentic Capabilities (Minimum Two)

The application will implement:

### 5.1 Intent → UI Action
Example:
> "Add note: patient reports mild headache"

System behavior:
- Parse instruction
- Extract note content
- Update UI and application state

---

### 5.2 AI Summary Panel

- Generate AI-powered summary of visit notes
- Display summary in a dedicated panel
- Lazy-load AI component
- Graceful fallback on AI failure

---

## 6. Performance Requirements

- Route-based code splitting
- Skeleton loading UI
- Avoid unnecessary re-renders
- Fast initial load experience
- Efficient state updates

---

## 7. Responsive Requirements

- Fully responsive across:
  - Mobile (320px+)
  - Tablet (768px+)
  - Desktop (1024px+)
- Grid-based adaptive layout
- Accessible touch targets on mobile

---

## 8. Data Handling Requirements

- Clean separation between UI and API logic
- Centralized service layer
- Explicit loading states
- Explicit error states
- Clear state management strategy

---

## 9. Technical Requirements

- React or React-based framework
- TypeScript (mandatory)
- AI integration allowed (OpenAI / Gemini / local model)
- Proper folder structure
- Clean code standards

---

## 10. Non-Functional Requirements

- Maintainable architecture
- Type safety
- Scalable component design
- Clean commit history
- Clear README documentation

---

## 11. Limitations

- Mock API (no persistent database)
- AI may produce imperfect interpretations
- No authentication required

---

## 12. Success Criteria

The project is considered successful if:

- All functional requirements are implemented
- At least two AI capabilities are working
- Performance optimizations are demonstrated
- Responsive behavior works across devices
- Codebase reflects production-level quality
