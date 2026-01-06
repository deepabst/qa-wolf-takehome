# 🐺 QA Wolf Take Home Assignment - My Solution

This repository contains my solution to the QA Wolf take home assignment for the [QA Engineer](https://www.task-wolf.com/apply-qae) role.

## Assignment Overview

The task was to create a script using JavaScript and Microsoft's [Playwright](https://playwright.dev/) framework that:

1. Navigates to [Hacker News/newest](https://news.ycombinator.com/newest)
2. Validates that **EXACTLY the first 100 articles** are sorted from newest to oldest

## My Solution

### Overview

I approached this assignment with a focus on **test reliability, maintainability, and proper separation of concerns**. The solution validates that the first 100 articles on Hacker News `/newest` are sorted chronologically from newest to oldest, with comprehensive error handling and a layered testing approach.

### Architecture & Design Decisions

#### 1. **Separation of Concerns**

I structured the code into distinct, testable components:

- **Pure validation functions** (`validateArticleOrder`, `validateFirstNewerThanLast`): Business logic separated from E2E concerns, making it easy to unit test
- **Pagination logic** (`navigateToArticle100`): Extracted into a reusable function that can be tested independently
- **E2E test functions** (`testPagination`, `validateArticleSorting`): Handle browser interactions and orchestration

This separation allows each component to be tested in isolation and makes the codebase more maintainable.

#### 2. **Test Strategy: Positive + Negative Testing**

Rather than relying on external state (like testing `/news` which might randomly be sorted correctly), I implemented:

- **Positive test**: Validates that correctly sorted data passes validation
- **Negative tests**: Uses synthetic known-bad data to prove our validation logic can detect errors
  - Tests adjacent article ordering violations
  - Tests first vs. last article validation

This approach is **deterministic and flake-free** - it doesn't depend on external API state that might change.

#### 3. **Pagination Handling**

The solution handles pagination by:

- **Clicking the "More" button** (not hard-coding URLs) to simulate real user behavior
- **Comprehensive error handling**:
  - Maximum attempt limits (10 clicks) to prevent infinite loops
  - Timeout protection (10 seconds per click, 2 minutes total) based on user experience standards (4+ seconds is considered unusable)
  - Detection of missing "More" button with helpful error messages
  - Screenshots on failure for debugging
- **Separate pagination test**: Tests pagination functionality independently before running sorting validation

#### 4. **Test Execution Flow**

The tests run in a logical sequence with fail-fast behavior:

1. **Validation Logic Test** (synthetic data) - Proves our detection logic works
2. **Pagination Test** - Ensures we can navigate to article 100
3. **Sorting Test** - Validates the actual articles on `/newest`

If any prerequisite test fails, subsequent tests are skipped to avoid cascading failures.

#### 5. **Error Handling & Debugging**

- **Screenshots on failure**: Captures page state when sorting errors are detected
- **Graceful screenshot handling**: If elements aren't visible (e.g., after pagination), screenshots fail gracefully without breaking the test
- **Clear error messages**: Each error type provides specific context about what went wrong
- **Timestamp extraction**: Uses the `title` attribute from `span.age` elements to get precise timestamps for accurate comparison

#### 6. **Article Validation Strategy**

- **Top articles (1-3)**: Validated BEFORE pagination while they're still visible in the DOM
- **Bottom articles (98-100)**: Validated AFTER pagination when they're on the current page
- **First vs. Last check**: Ensures the first article is newer than the last article across the entire range

This approach avoids DOM visibility issues that would cause timeouts.

#### 7. **Locator Strategy**

To avoid strict mode violations when multiple pages are loaded:

- Uses `.locator("span.rank").getByText("2.", { exact: true }).first()` to ensure exact matches
- Prevents substring matching (e.g., "2." matching "92.", "102.", "112.")

#### 8. **Celebratory Feature 🐺**

When all tests pass, the script displays an ASCII wolf howling at the moon - because who doesn't love a good celebration after successful tests?

### Key Features

✅ **Deterministic negative testing** with synthetic data  
✅ **Comprehensive pagination error handling** with timeouts and retry limits  
✅ **Separation of concerns** for maintainability  
✅ **Fail-fast test execution** to quickly identify issues  
✅ **Screenshot capture** for debugging failures  
✅ **Clear, actionable error messages**  
✅ **User-experience based timeouts** (10 seconds max per action)

## Running the Solution

### Prerequisites

- Node.js installed
- npm package manager

### Installation

```bash
npm install
```

### Execution

```bash
node index.js
```

The script will:

1. Test validation logic with known-good and known-bad data
2. Test pagination functionality
3. Validate article sorting on `/newest`
4. Display a celebratory wolf howl if all tests pass! 🐺🌕

### Expected Output

On success, you'll see:

- ✅ Validation logic tests passing
- ✅ Pagination test passing
- ✅ Sorting validation passing
- 🐺 A celebratory ASCII wolf howling at the moon!

On failure, you'll get:

- Clear error messages indicating which test failed
- Screenshots saved for debugging (if applicable)
- Specific details about what went wrong

## File Structure

- `index.js` - Main test script containing all validation logic and E2E tests
- `package.json` - Project dependencies
- `playwright.config.js` - Playwright configuration (for reference)
- `*.png` - Screenshot files generated on test failures (if any)

## Technical Decisions

### Why Synthetic Negative Tests?

I chose to use synthetic known-bad data for negative testing rather than relying on external state (like testing `/news` which might randomly be sorted correctly). This ensures:

- **Deterministic results**: Same inputs every time
- **No flakes**: Not dependent on external API state
- **Proves our logic**: Tests our validation code, not external behavior

### Why Separate Pagination Test?

Pagination is a prerequisite for the sorting test. By testing it separately:

- **Fail fast**: If pagination doesn't work, we know immediately
- **Clear error messages**: We know exactly what failed
- **Reusable logic**: Pagination function can be used elsewhere

### Why 10-Second Timeouts?

Based on user experience research, 4+ seconds of wait time is considered unusable. I set timeouts to 10 seconds per action to:

- Catch real performance issues
- Fail fast on problems
- Provide good user experience feedback

## Notes

- The script runs in non-headless mode by default (browser visible) for easier debugging
- Screenshots are automatically captured on failures for debugging
- All error messages are designed to be actionable and specific
