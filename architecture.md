# SPA Booking System Architecture

## Architecture Overview
The application is a Single Page Application (SPA) built with React 19. It uses a modern component-based architecture organized by feature and UI responsibility. The UI utilizes a customized Vanilla CSS design system to ensure flexibility and eliminate heavy CSS framework dependencies. Core layers include:
- **Components**: Separated into generic `ui` (Buttons, Inputs, Modals) and domain-specific `bookings`/`calendar` segments.
- **Pages**: Top-level views containing routing logical blocks.
- **Services**: `api.js` handles centralized HTTP requests using Axios and manages JWT Bearer token injection via interceptors.
- **Store**: Global application state handled by Zustand for minimal boilerplate and high performance.
- **Utils**: Contains custom structured logging mechanisms and mock data generators for performance testing.

## State Management Explanation
State management leverages **Zustand**. It was chosen over Context API (which has re-render cascading issues) and Redux (which has heavy boilerplate). 
- The single Zustand store `useStore.js` tracks raw data (`bookings`, `therapists`) and critical UI states (`isPanelOpen`, `selectedBooking`).
- Operations on bookings (add, update, delete) are implemented with an **Optimistic UI Update Strategy**. The local state mutates immediately for zero UI lag, and async API updates run in the background. If the API fails, the catch block logs the error (ready for a rollback mechanism).

## Performance Strategy
Our test scale mandated handling 2000 bookings and 200 therapists per day with no UI lag. 
- **Virtualized Rendering**: The `react-window` library's `FixedSizeList` was used to virtualize the horizontal X-axis (Therapists). Out of 200 therapists, only ~10 are rendered in the DOM simultaneously.
- **2D Optimization via Absolute Positioning**: Instead of a full 2D virtualized grid which has high overhead, we realized the Y-axis (Time: 9 AM to 8 PM) has a fixed, small number of bounds (44 time blocks of 15 mins = 1320px). The Y-axis acts as a standard scrolling container while the X-axis is virtualized.
- **Efficient Recalculations**: Drag and drop directly calculates exact layout boundaries `(clientY - targetTop) / 30px` to map drop coordinates directly to 15-minute time strings in `O(1)` time. 

## Assumptions Made
1. **API Endpoints**: Real API URLs were assumed to follow standard REST (`GET /bookings`, `PUT /bookings/:id`). Since Postman URLs were protected and required active credentials, I instituted a mock payload generator that injects perfectly scaled load (2000 items) into Zustand on load for demonstration.
2. **Security**: Hardcoded credentials in `login()` interceptor are only a bypass mechanism for the current test phase.
3. **Data Shape**: Assumed time starts at 09:00 and ends at 20:00 (11-hour day shift).

## Error Handling & Logging
A global `ErrorBoundary` catches frontend component crashes securely to present a fallback UI. 
A dedicated `logger.js` singleton is implemented to structure all `INFO`, `WARN`, `ERROR`, and user `ACTION` records centrally. Logging outputs gracefully fallback to console with categorized formats.
