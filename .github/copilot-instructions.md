# Copilot Instructions - Frontier Kickstarter App

## Project Overview

Frontier Kickstarter is a **Sponsor Pass Manager** app for the Frontier Tower platform. It runs in a sandboxed iframe within the Frontier Wallet PWA and demonstrates how to build apps using the Frontier SDK.

**Architecture**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui components

## Critical Development Knowledge

### SDK Communication Pattern

Apps communicate with Frontier Wallet via `postMessage`. The SDK (`@frontiertower/frontier-sdk`) wraps this:

```ts
// Always check if running in Frontier Wallet
import { isInFrontierApp } from '@frontiertower/frontier-sdk/ui-utils';
if (!isInFrontierApp()) {
  // Show error - app must run inside Frontier Wallet
}

const sdk = new FrontierSDK();
// Access specific APIs via access classes
sdk.getPartnerships().listSponsors();
sdk.getStorage().set('key', value);
```

### Component Architecture

**State Management Flow**:
1. `SponsorPassManager.tsx` - Root component managing all state
2. Separate loading states: `isLoadingSponsors` vs `isLoadingPasses`
3. Three distinct UI states: Loading → Sponsor Selection → Full Interface

**Key Pattern**: Components receive data and callbacks as props (no global state). See `SponsorPassManager` → `PassList` → `PassFilters` hierarchy.

### Mock Data System

Toggle between real SDK and mock data via `USE_MOCK_DATA` flag in `SponsorPassManager.tsx`:

```ts
const USE_MOCK_DATA = true; // Toggle for testing
```

Mock data includes simulated network delays (300-800ms) and lives in `src/lib/mockData.ts`. Use this for testing without API access.

### UI Component System

**shadcn/ui with CVA (Class Variance Authority)**:
- Base components in `src/components/ui/` (imported from shadcn)
- Use `appearance` and `variant` props for styling consistency
- Example: `<Badge variant="success" appearance="light" size="sm" />`

**Design Patterns**:
- Always use Alert components for errors/messages (not plain divs)
- Loading states: Centered spinner with animated border
- Cards: Proper CardHeader/CardContent structure
- Labels: Include `text-sm font-medium` for consistency
- Background is violet - use white text with appropriate opacity for readability

### Critical File Locations

- **Types**: `src/types/index.ts` - All TypeScript interfaces
- **Mock Data**: `src/lib/mockData.ts` - Test data for development
- **Main App**: `src/App.tsx` - Checks if in Frontier Wallet
- **Root Component**: `src/components/SponsorPassManager.tsx` - All business logic
- **Agent Instructions**: `docs/AGENT_INSTRUCTIONS.md` - SDK reference
- **Deployment**: `docs/DEPLOYMENT.md` - CORS and hosting setup

## Development Workflow

```bash
npm install          # Install dependencies
npm run dev         # Start dev server on port 5174
npm run build       # TypeScript compile + Vite build
```

**Testing in Frontier Wallet**:
1. Run dev server locally (port 5174)
2. Install Frontier Wallet PWA at `sandbox.wallet.frontiertower.io`
3. Navigate to Apps → App Store → Install Kickstarter App
4. App loads your local dev environment with permissions

**CORS Configuration**: `vite.config.ts` allows specific Frontier Wallet origins (localhost, sandbox, alpha, beta, production).

## Project-Specific Conventions

### Component Patterns

1. **Loading States**: Use separate boolean flags for different loading phases (sponsors vs passes)
2. **Error Handling**: Use Alert component with `variant="destructive"` and `appearance="light"`
3. **Empty States**: Centered with descriptive text and optional icons
4. **Pagination**: Display "X to Y of Z" format with icon-only prev/next buttons

### Styling Conventions

- **Spacing**: Use Tailwind spacing scale (`space-y-6`, `gap-4`, etc.)
- **Text Colors**: `text-muted-foreground` for secondary text, `text-foreground` for primary
- **Responsive**: Mobile-first with `sm:` breakpoint for tablet/desktop
- **Card Layouts**: Always include proper header/content separation

### Type Safety

- Import types from `@/types`
- Use `PaginatedResponse<T>` for API responses with pagination
- SDK responses match TypeScript interfaces exactly
- Status types: `'active' | 'revoked'` (literal unions, not strings)

### SDK Permissions

This app uses:
- `partnerships:*` - Manage sponsor passes
- `storage:*` - Store app data

Request minimal permissions needed. Document in `permissionDisclaimer` when deploying.

## Integration Points

### Frontier SDK Access Classes

```ts
sdk.getPartnerships() // listSponsors, createSponsorPass, revokeSponsorPass
sdk.getStorage()      // get, set, remove, clear
sdk.getWallet()       // getAddress, getBalance (not used in this app)
```

### External Dependencies

- **@frontiertower/frontier-sdk**: Core SDK (request/response protocol)
- **shadcn/ui + Radix UI**: Component primitives with accessible patterns
- **class-variance-authority**: Type-safe component variants
- **lucide-react**: Icon library (use sparingly, prefer text)

## Debugging Tips

- Check browser console for SDK request/response logs
- Verify `isInFrontierApp()` returns true (iframe context check)
- Mock data simulates real API delays and errors
- Use browser devtools to inspect postMessage events between iframe and parent

## Key Differences from Standard React Apps

1. **No routing** - Single page apps only (no React Router needed)
2. **CORS critical** - Must whitelist Frontier Wallet origins
3. **Iframe sandboxing** - Limited browser APIs, no direct DOM access to parent
4. **Permission-based** - Request upfront, enforced by host wallet
5. **Message-based async** - All SDK calls use postMessage protocol
