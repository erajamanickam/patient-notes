# Patient Management System

A modern, high-performance web application for managing patient records, visit notes, and AI-driven clinical assistance.

## 🏗️ Architecture Decisions

### 1. Functional Service Layer (Refactored)
We moved away from class-based services (`PatientService`) to **named functional exports**. This reduces boilerplate, improves tree-shaking support, and aligns with modern React's functional paradigm.

### 2. Centralized Fetch Utility (`api.ts`)
Instead of "traditional" repetitive `fetch` hits, we implemented a lean wrapper around the Fetch API. This utility automatically handles:
- Base URL injection.
- JSON serialization/deserialization.
- Centralized error handling and status code verification.

### 3. Server State Management (TanStack Query)
We use **TanStack Query (React Query) v5** to manage all asynchronous data. This allows us to separate "Server State" from "UI State" and provides:
- Automatic background refetching.
- Intelligent caching (5-minute default stale time).
- Reduced network traffic by preventing redundant API hits.

### 4. AI-Native Assistance
The core differentiator is the **AIChatWidget**, which uses GPT-4o-mini to:
- **Summarize Notes**: Condense long medical histories into concise bullet points.
- **Intent Parsing**: Turn natural language (e.g., "Add note: Patient has fever for user 3") into structured API calls.
- **Context Awareness**: The widget auto-clears on navigation and auto-closes when modals are open to avoid UI conflicts.

---

## ⚡ Performance Optimizations

- **Optimistic Updates**: When adding a note, the UI updates instantly before the server confirms the request. If the request fails, the state automatically rolls back.
- **Code Splitting**: The `PatientDetails` page is lazily loaded using `React.lazy` and `Suspense`, reducing the initial bundle size and improving "Time to Interactive" (TTI).
- **Client-side Pagination**: Implemented a 9-item-per-page limit on the dashboard to handle large datasets without degrading browser performance.
- **Skeleton Loading**: We use CSS-animated skeleton cards to provide immediate visual feedback during initial data fetching, improving perceived performance.
- **Stale-While-Revalidate (SWR)**: Data is served from cache instantly while being refreshed in the background, ensuring the UI always feels snappy.

---

## 📁 Folder Structure

```text
src/
├── assets/          # Static assets (images, icons)
├── components/      # Reusable UI components (Modals, Cards, AI Widget)
├── hooks/           # Custom React Query hooks for data fetching
├── pages/           # Main route components (Dashboard, Details, 404)
├── services/        # Service layer (API logic & AI integration)
│   ├── api.ts       # Centralized Fetch wrapper
│   ├── aiService.ts # OpenAI integration logic
│   └── patientService.ts # Patient-specific API endpoints
├── types/           # TypeScript interfaces and types
├── App.tsx          # Router and QueryClient configuration
└── main.tsx         # Application entry point
```

---

## 🔌 API Endpoints

All endpoints use the `VITE_API_BASE_URL` defined in the environment variables.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/patients` | Fetch all patients |
| `GET` | `/patients/:id` | Fetch detailed info for a single patient |
| `POST` | `/patients` | Register a new patient |
| `PUT` | `/patients/:id` | Update existing patient information |
| `DELETE` | `/patients/:id` | Remove a patient from the system |
| `POST` | `/patients/:id/notes` | Add a new visit note to a patient |

---

## 🚀 Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Configure your `.env` file with `VITE_API_BASE_URL` and `VITE_AI_API_KEY`.
4. Run locally: `npm run dev`.
