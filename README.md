# Frontier Kickstarter App

A **Sponsor Pass Manager** demo app for the Frontier App Store, demonstrating how to build apps that run inside the Frontier Wallet using the Frontier SDK. This app manages sponsor passes for network society partnerships.

![Frontier Kickstarter App](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Vite](https://img.shields.io/badge/Vite-Latest-purple)

## 🚀 How to Run the App

### Prerequisites

- Node.js 18+ and npm
- A test user account (request via the tech team - no automation yet)
- The app is preconfigured for testing on `sandbox.wallet.frontiertower.io`

### Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:5174`

3. **Run tests:**
   ```bash
   npm test              # Run tests in watch mode
   npm run test:ui       # Open Vitest UI
   npm run test:coverage # Generate coverage report
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm run preview  # Preview production build
   ```

## 🧪 Testing Your App in Frontier Wallet

### Installing the Frontier Wallet PWA

The Frontier Wallet is a Progressive Web App (PWA) that can be installed on your device:

**iOS:**
1. Open Safari and navigate to [sandbox.wallet.frontiertower.io](https://sandbox.wallet.frontiertower.io)
2. Tap the Share button (square with arrow pointing up)
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" to confirm

**Android:**
1. Open Chrome and navigate to [sandbox.wallet.frontiertower.io](https://sandbox.wallet.frontiertower.io)
2. Tap the three-dot menu in the top right
3. Tap "Add to Home Screen" or "Install App"
4. Tap "Add" or "Install" to confirm

**Desktop (Chrome/Edge):**
1. Navigate to [sandbox.wallet.frontiertower.io](https://sandbox.wallet.frontiertower.io)
2. Click the install icon in the address bar or use the menu
3. Click "Install" to confirm

### Loading Your Local Dev App

1. Ensure your dev server is running (`npm run dev` on port 5174)
2. Open the Frontier Wallet PWA
3. Navigate to **Apps** → **App Store**
4. Install the **Kickstarter App**
5. Click the app to load your local environment with all required permissions

The app will load in a sandboxed iframe with access to the Frontier SDK.

## 🏗️ Tech Stack

### Core Framework
- **React 18.3** - Modern React with hooks and concurrent features
- **TypeScript 5.0** - Type safety and improved developer experience
- **Vite** - Lightning-fast build tool with HMR for optimal DX

### Why React + TypeScript + Vite?
This stack was chosen for:
- **Fast iteration**: Vite's HMR provides instant feedback during development
- **Type safety**: TypeScript catches errors at compile time, crucial for SDK integration
- **Modern patterns**: React hooks enable clean, composable component logic
- **Minimal boilerplate**: Vite requires almost no configuration

### UI Components & Styling
- **Tailwind CSS 4.1** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Pre-built accessible components built on Radix UI primitives
- **Reui** - Pre-built accessible components built on top of shadcn/ui
- **Radix UI** - Unstyled, accessible component primitives
- **class-variance-authority (CVA)** - Type-safe component variants
- **lucide-react** - Consistent icon system

### Why shadcn/ui + Reui + Tailwind?
- **Copy-paste components**: Own the code, customize without fighting a framework
- **Accessibility built-in**: Radix UI handles ARIA, keyboard nav, focus management
- **Consistent design**: CVA ensures predictable component variants
- **Rapid prototyping**: Tailwind enables quick UI iterations

### Form Handling & Validation
- **react-hook-form** - Performant forms with minimal re-renders
- **zod** - Runtime type validation that integrates with TypeScript
- **@hookform/resolvers** - Connect Zod schemas to react-hook-form

### Testing
- **Vitest** - Fast, Vite-native unit testing framework
- **@testing-library/react** - Test components like users interact with them
- **happy-dom** - Lightweight DOM implementation for tests

### Frontier Integration
- **@frontiertower/frontier-sdk** - Official SDK for wallet communication via postMessage

## 📋 Development Workflow

### Building This App: A Step-by-Step Breakdown

```
┌─────────────────────────────────────────────────────────────┐
│ 1. PROJECT SETUP & ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────┤
│ • Initialize Vite + React + TypeScript project              │
│ • Install Frontier SDK and study postMessage protocol       │
│ • Configure Tailwind CSS + shadcn/ui components             │
│ • Set up CORS config for Frontier Wallet origins            │
│                                                              │
│ Key Decision: Message-based architecture (iframe ↔ wallet)  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. TYPE SYSTEM & SDK INTEGRATION                            │
├─────────────────────────────────────────────────────────────┤
│ • Define TypeScript interfaces (src/types/index.ts)         │
│   - Sponsor, SponsorPass, PaginatedResponse types           │
│ • Integrate SDK access classes:                             │
│   - sdk.getPartnerships() for sponsor pass operations       │
│   - sdk.getStorage() for app data persistence               │
│ • Build mock data system for offline testing                │
│                                                              │
│ Key Files: types/index.ts, lib/mockData.ts                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. COMPONENT ARCHITECTURE (BOTTOM-UP)                       │
├─────────────────────────────────────────────────────────────┤
│ A. UI Primitives (shadcn/ui)                                │
│    • Button, Card, Badge, Alert, Dialog, etc.               │
│    • Customize with CVA variants                            │
│                                                              │
│ B. Feature Components                                       │
│    • PassFilters: Status/search filtering with callbacks    │
│    • PassList: Table display with pagination                │
│    • CreatePassModal: Form with react-hook-form + Zod       │
│    • ConfirmDialog: Reusable confirmation modal             │
│    • SponsorSelector: Initial sponsor selection screen      │
│                                                              │
│ C. Container Component                                      │
│    • SponsorPassManager: Root state & orchestration         │
│      - Manages all API calls and loading states             │
│      - Handles sponsor/pass selection logic                 │
│      - Passes data down via props (no global state)         │
│                                                              │
│ Pattern: Data flows down, events flow up                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. STATE MANAGEMENT STRATEGY                                │
├─────────────────────────────────────────────────────────────┤
│ • Component-local state (React.useState)                    │
│ • Separate loading flags: isLoadingSponsors, isLoadingPasses│
│ • Three UI states:                                          │
│   1. Loading sponsors                                       │
│   2. Sponsor selection (no passes shown)                    │
│   3. Full interface (sponsor selected, show passes)         │
│ • Filters trigger fresh API calls                           │
│ • Pagination state: { page, perPage, total }                │
│                                                              │
│ Why no Redux/Context? App is simple, prop drilling is fine  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. TESTING & QUALITY ASSURANCE                              │
├─────────────────────────────────────────────────────────────┤
│ • Unit tests for all feature components (Vitest)            │
│ • Test user interactions (clicks, form fills, filters)      │
│ • Mock SDK responses for isolated testing                   │
│ • Test loading states, errors, edge cases                   │
│                                                              │
│ Testing Pattern: Render → Interact → Assert                 │
│ Files: src/components/__tests__/*.test.tsx                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. DEPLOYMENT & DOCUMENTATION                               │
├─────────────────────────────────────────────────────────────┤
│ • Build production bundle (npm run build)                   │
│ • Self-host on your domain                                  │
│ • Frontier publishes at your-app.appstore.frontiertower.io  │
│ • Document permissions in permissionDisclaimer              │
│                                                              │
│ See: docs/DEPLOYMENT.md for full guide                      │
└─────────────────────────────────────────────────────────────┘
```

### Development Principles Applied

1. **Progressive Enhancement**: Start with mock data, add real SDK calls
2. **Component Isolation**: Each component receives props, no hidden dependencies
3. **Type Safety First**: TypeScript catches integration errors before runtime
4. **Accessibility**: Use Radix primitives for keyboard nav, ARIA, focus management
5. **Mobile-First**: Tailwind responsive design from smallest screens up
6. **Testing as Documentation**: Tests show how components should be used

### Key Challenges Solved

- **CORS Configuration**: Whitelist specific Frontier Wallet origins in vite.config.ts
- **Message Protocol**: Wrap SDK calls in async/await, handle postMessage timing
- **Loading States**: Separate flags for different async operations (sponsors vs passes)
- **Iframe Context**: Check `isInFrontierApp()` to ensure app runs in wallet
- **Mock Data**: Simulate real API with delays for testing without backend access

## 📚 Additional Resources

### Agent Context 

Find comprehensive agent instructions and deployment guides:

- **[Agent Instructions](./docs/AGENT_INSTRUCTIONS.md)** - SDK reference and development patterns
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - CORS setup and publishing process
- **[Webhooks Guide](./docs/WEBHOOKS.md)** - React to network society events

### Project Structure

```
src/
├── components/          # React components
│   ├── SponsorPassManager.tsx   # Root container with all business logic
│   ├── SponsorSelector.tsx      # Initial sponsor selection UI
│   ├── PassList.tsx             # Table display with pagination
│   ├── PassFilters.tsx          # Status + search filters
│   ├── CreatePassModal.tsx      # Form for creating passes
│   ├── ConfirmDialog.tsx        # Reusable confirmation dialog
│   └── __tests__/               # Component unit tests
├── ui/                  # shadcn/ui components
├── types/               # TypeScript interfaces
├── lib/                 # Utilities and mock data
└── App.tsx              # Entry point (checks iframe context)
```



## 🔌 Frontier SDK

The `@frontiertower/frontier-sdk` package provides the communication layer between your app and the Frontier Wallet.

### Basic Usage

```typescript
import { FrontierSDK } from '@frontiertower/frontier-sdk';
import { isInFrontierApp } from '@frontiertower/frontier-sdk/ui-utils';

// Always check if running in Frontier Wallet
if (!isInFrontierApp()) {
  console.error('This app must run inside Frontier Wallet');
  return;
}

// Initialize SDK
const sdk = new FrontierSDK();

// Use access classes for different functionality
const partnerships = sdk.getPartnerships();
const storage = sdk.getStorage();
const wallet = sdk.getWallet();

// Example: Create a sponsor pass
const pass = await partnerships.createSponsorPass({
  sponsorId: 'sponsor-123',
  email: 'user@example.com',
  duration: 30
});

// Example: Store app data
await storage.set('lastSelectedSponsor', 'sponsor-123');
const lastSponsor = await storage.get('lastSelectedSponsor');
```

### Available Access Classes

- **`getPartnerships()`** - Manage sponsor passes
  - `listSponsors()`, `createSponsorPass()`, `revokeSponsorPass()`
- **`getStorage()`** - App data persistence
  - `get()`, `set()`, `remove()`, `clear()`
- **`getWallet()`** - Wallet operations
  - `getAddress()`, `getBalance()` (not used in this app)

## 🧑‍💻 Development Tips

- **Use Chrome** for primary development (best DevTools for iframe debugging)
- **Enable mock data** via `USE_MOCK_DATA` flag in SponsorPassManager.tsx
- **Check console** for SDK request/response logs
- **Test CORS** by loading app in actual Frontier Wallet iframe
- **Verify iframe context** with `isInFrontierApp()` check

## 📝 License

MIT
