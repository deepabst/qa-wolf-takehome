# 🐺 QA Wolf Take Home Assignment - My Solution

This repository contains my solution to the QA Wolf take home assignment for the [QA Engineer](https://www.task-wolf.com/apply-qae) role.

## Assignment Overview

Create a Playwright script that validates the **first 100 articles** on [Hacker News/newest](https://news.ycombinator.com/newest) are sorted from newest to oldest.

## My Approach: Boundary Testing

I used a **boundary testing strategy** focusing on the critical boundaries:

- **Top boundary**: First 3 articles (ranks 1-3)
- **Bottom boundary**: Last 3 articles (ranks 98-100)
- **Cross-boundary validation**: First article vs. last article

Since the 100 articles span **3 pages**, pagination is a prerequisite that must be validated first.

## Solution Architecture

### Test Execution Flow

1. **Validation Logic Test** - Proves our detection works with synthetic known-bad data
2. **Pagination Test** - Validates we can navigate to article 100 (prerequisite)
3. **Sorting Test** - Validates articles 1-3, paginates, then validates articles 98-100

### Key Design Decisions

**Separation of Concerns**

- Pure validation functions (testable in isolation)
- Reusable pagination logic
- E2E orchestration layer

**Pagination-First Strategy**

- Articles 1-3 validated **before** pagination (still in DOM)
- Articles 98-100 validated **after** pagination (now visible)
- Prevents DOM visibility timeouts

**Deterministic Negative Testing**

- Synthetic known-bad data (not dependent on external state)
- Tests both adjacent ordering and first vs. last validation
- Zero flakes, 100% reliable

**Robust Error Handling**

- 10-second timeouts per action (UX-based: 4+ seconds = unusable)
- Maximum 10 pagination attempts
- Screenshots on failure for debugging
- Clear, actionable error messages

**Precise Locators**

- Exact text matching to avoid substring issues (e.g., "2." matching "92.", "102.")
- Handles multiple pages loaded in DOM

## Running the Solution

```bash
npm install
node index.js
```

**Success output**: ✅ All tests pass → 🐺 ASCII wolf howling at the moon!

**Failure output**: Clear error messages + screenshots for debugging

## Technical Highlights

- **Boundary testing** strategy for efficient validation
- **Pagination-first** approach due to 3-page article spread
- **Fail-fast** execution (prerequisites must pass)
- **Screenshot capture** on failures
- **User-experience based timeouts** (10s max per action)
- **Pure functions** for testable validation logic

## File Structure

- `index.js` - Complete test suite (validation logic + E2E tests)
- `package.json` - Dependencies
- `*.png` - Failure screenshots (generated on errors)
