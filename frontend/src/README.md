# Frontend Structure

## Goal
Keep UI pages focused on rendering and state, while API calls and static data live in dedicated modules.

## Folders
- `pages/`: route-level screens (`Auth`, `Welcome`, `Profile`, etc.).
- `components/`: shared UI/route wrappers and feature UI blocks.
- `components/profile/`: Profile page presentation-only sections (`ProfileHeader`, `ProfileSidebar`, `ProfileForm`, `ProfileLoading`).
- `hooks/`: feature state/action orchestration hooks.
- `hooks/useProfileController.js`: Profile data loading, submit actions, and local form state.
- `services/`: API clients and request helpers.
- `constants/`: static reusable data (dropdown values, default suggestions).
- `utils/`: app utilities (token storage).

## API Layer
- `services/http.js`: base URL, shared headers, safe JSON parsing, common request wrappers.
- `services/authService.js`: all auth/profile endpoints.
- `services/aiService.js`: AI/video/chat endpoints.

## Team Rule
- New endpoint calls should be added in `services/` first, then consumed from pages/components.
- Keep hardcoded option lists in `constants/` instead of page files.
