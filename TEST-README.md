# Test Scripts for default_tab Navigation Fix

This directory contains test scripts to verify the default_tab navigation fix without running the full application.

## Issue Description

When an app is configured with `default_tab` but has an empty `tabs` array, accessing `/app/:appId` directly should redirect to the default tab's path.

**Example app configuration:**
```yaml
code: approve_workflow
default_tab: object_instance_tasks
```

**Expected behavior:** Accessing `/app/approve_workflow` should redirect to `/app/approve_workflow/instance_tasks`

## Test Scripts

### 1. Manual Test Script (Standalone)

**File:** `test-default-tab-navigation.js`

This is a standalone Node.js script that simulates the navigation logic without any dependencies.

**Run:**
```bash
node test-default-tab-navigation.js
```

**What it tests:**
- ✅ Navigates to `default_tab.path` when default_tab is an object with path property
- ✅ Constructs path `/app/:appId/:default_tab` when default_tab is a string
- ✅ Falls back to first child (sorted by index) when no default_tab
- ✅ Handles null default_tab gracefully
- ✅ Handles default_tab object without path property
- ✅ Handles empty children array

**Expected output:**
```
🧪 Running default_tab navigation tests...

✅ Test 1: default_tab as object with path (approve_workflow example)
✅ Test 2: default_tab as string
✅ Test 3: No default_tab, fallback to first child
✅ Test 4: No default_tab, children sorted by index
✅ Test 5: default_tab is null (should fallback)
✅ Test 6: default_tab object without path (should fallback)
✅ Test 7: No default_tab and no children

📊 Results: 7 passed, 0 failed out of 7 tests

🎉 All tests passed! The default_tab navigation fix is working correctly.
```

### 2. React Component Unit Test

**File:** `builder6/webapp/src/pages/app/id/index.test.tsx`

This is a comprehensive unit test for the React component using Jest and React Testing Library.

**Run:**
```bash
cd builder6/webapp
npm test -- index.test.tsx
```

**What it tests:**
- Component behavior with different API responses
- Proper navigation calls with mocked router
- Error handling
- Null/undefined edge cases

## Test Cases Covered

| Test Case | Input | Expected Output |
|-----------|-------|-----------------|
| default_tab as object with path | `{ default_tab: { path: '/app/x/y' } }` | Navigate to `/app/x/y` |
| default_tab as string | `{ default_tab: 'my_tab' }` | Navigate to `/app/:appId/my_tab` |
| No default_tab | `{ children: [{path: '/app/x/y'}] }` | Navigate to first child |
| default_tab is null | `{ default_tab: null, children: [...] }` | Navigate to first child |
| default_tab object without path | `{ default_tab: {id: 'x'}, children: [...] }` | Navigate to first child |
| Empty children | `{ children: [] }` | No navigation |

## Verify Fix in Real Application

To test in the actual application:

1. Configure an app with `default_tab`:
```yaml
name: Test App
code: test_app
default_tab: object_instance_tasks
```

2. Access the app directly: `http://localhost:5100/app/test_app`

3. Verify it redirects to: `http://localhost:5100/app/test_app/instance_tasks`

## Related Files

- **Fix implementation:** `builder6/webapp/src/pages/app/id/index.tsx`
- **Backend handler:** `services/service-metadata-apps/src/actionsHandler.ts`

## Notes

- The backend (`actionsHandler.ts`) transforms `default_tab` strings into objects with `path` properties
- The frontend fix properly handles both string and object formats for backward compatibility
- Null check is included for type safety (since `typeof null === 'object'` in JavaScript)
