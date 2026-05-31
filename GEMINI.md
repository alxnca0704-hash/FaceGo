# GEMINI.md - FaceGo Project Context

## Project Overview
FaceGo is a React Native mobile application built with **Expo (SDK 54)**, designed for employee management and attendance tracking. It leverages modern mobile development patterns including file-based routing and utility-first styling.

### Core Tech Stack
- **Framework:** Expo (SDK 54) / React Native
- **Navigation:** Expo Router (File-based navigation)
- **Styling:** NativeWind v5 (Tailwind CSS for React Native), `clsx`, `tailwind-merge`
- **Responsive Layout:** `react-native-size-matters` for scaling UI across different screen sizes
- **Language:** TypeScript
- **Animations:** React Native Reanimated
- **Typography:** Plus Jakarta Sans (Regular, Bold, Medium, SemiBold, ExtraBold, Light)

## Project Structure
- `app/`: Contains application routes and layouts.
  - `(tabs)/`: Main tab-based navigation (Dashboard, Employee, Attendance).
  - `_layout.tsx`: Root layout, manages font loading and splash screen.
  - `index.tsx`: Entry point/Initial screen.
- `components/`: UI components.
  - `ui/`: Fundamental UI building blocks (e.g., Searchbar, Input).
- `constant/`: Static assets configuration and mock data.
  - `data.ts`: Centralized mock data (employees, stats, tabs).
  - `theme.ts`: Global theme variables (colors, spacing).
  - `icons.ts`: Icon mappings.
- `lib/`: Utility functions (e.g., `utils.ts` for Tailwind merging).
- `assets/`: Fonts, icons, and static images.
- `type.d.ts`: Global TypeScript interfaces.

## Building and Running
The project uses standard Expo CLI commands:

- **Install Dependencies:** `npm install`
- **Start Development Server:** `npm start`
- **Run on Android:** `npm run android`
- **Run on iOS:** `npm run ios`
- **Run on Web:** `npm run web`
- **Linting:** `npm run lint`

## Development Conventions

### Styling & UI
- **NativeWind:** Use `className` with Tailwind classes for almost all styling.
- **Dynamic Classes:** Use the `cn` utility (from `lib/utils.ts`) or `clsx` for conditional classes.
- **Responsive Scaling:** Use `vs` (vertical scale) or `s` (scale) from `react-native-size-matters` for font sizes and specific spacing where responsive scaling is critical.
  - *Example:* `<Text style={{ fontSize: vs(12) }}>`
- **Typography:** Always use the custom font families via Tailwind classes:
  - `font-sans-regular`
  - `font-sans-medium`
  - `font-sans-semibold`
  - `font-sans-bold`
  - `font-sans-extrabold`
  - `font-sans-light`

### Architecture & State
- **File-based Routing:** New screens should be added under the `app/` directory following Expo Router conventions.
- **Shared Constants:** Colors, spacing, and mock data should be sourced from the `constant/` directory to maintain consistency.
- **Components:** Prefer functional components with explicit TypeScript interfaces (defined in `type.d.ts` if global).

### Testing & Validation
- Ensure new components are responsive and tested on multiple screen sizes if possible.
- Maintain consistent use of the theme colors defined in `constant/theme.ts`.
