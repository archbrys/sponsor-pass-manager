# Component Tests

This directory contains unit tests for all React components in the Frontier Kickstarter app, using **React Testing Library** and **Vitest**.

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm test -- --run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

Each component has a corresponding test file in the `__tests__` directory:

- `ConfirmDialog.test.tsx` - Tests for confirmation dialog component
- `CreatePassModal.test.tsx` - Tests for pass creation modal
- `PassFilters.test.tsx` - Tests for pass filtering component
- `PassList.test.tsx` - Tests for pass list and pagination
- `SponsorSelector.test.tsx` - Tests for sponsor selection dropdown

## Testing Conventions

### Component Testing Patterns

1. **Props Testing**: Verify components render correctly with different prop combinations
2. **User Interaction**: Test user events (clicks, typing, form submissions)
3. **State Updates**: Verify callback functions are called with correct arguments
4. **Conditional Rendering**: Test different UI states (loading, error, empty, populated)
5. **Accessibility**: Verify ARIA labels and accessible patterns

### Common Patterns

```tsx
// Setup user event
const user = userEvent.setup();

// Find elements
const button = screen.getByText('Click Me');
const input = screen.getByLabelText('Email');

// Interact with elements
await user.click(button);
await user.type(input, 'test@example.com');

// Assert callbacks
expect(mockCallback).toHaveBeenCalledWith(expectedValue);

// Wait for async operations
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

## Test Configuration

- **Vitest Config**: `vitest.config.ts`
- **Test Setup**: `src/test/setup.ts`
- **Environment**: jsdom (simulates browser)
- **Globals**: Enabled (`describe`, `it`, `expect` available globally)

## Mocking

### Mocking Modules

```tsx
vi.mock('@frontiertower/frontier-sdk', () => ({
  FrontierSDK: vi.fn(),
}));
```

### Mocking Functions

```tsx
const mockCallback = vi.fn();
mockCallback.mockResolvedValue(data); // For async functions
mockCallback.mockReturnValue(value);   // For sync functions
```

## Coverage

Test coverage includes:
- ✅ All interactive elements (buttons, inputs, checkboxes)
- ✅ Form validation and submission
- ✅ Error handling and display
- ✅ Loading states
- ✅ Pagination controls
- ✅ Conditional rendering logic

## Best Practices

1. **Test user behavior, not implementation**: Focus on what users see and do
2. **Use accessible queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Test one thing at a time**: Each test should verify a single behavior
4. **Clean up after tests**: Use `afterEach(() => cleanup())` in setup
5. **Mock external dependencies**: Mock SDK calls and API responses

## Troubleshooting

### Tests failing with "Not wrapped in act(...)"
- Use `async/await` with user events
- Wrap state updates in `waitFor()`

### Element not found
- Check if element is rendered conditionally
- Use `queryBy` instead of `getBy` for elements that may not exist
- Wait for async operations with `waitFor()` or `findBy`

### Mock not working
- Ensure mock is defined before import
- Use `vi.clearAllMocks()` in `beforeEach()`
- Check module path matches exactly

## Additional Resources

- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Docs](https://vitest.dev/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
