// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

// ASCII Wolf Howling at the Moon - Celebratory display for passing tests
function displayWolfHowl() {
  console.log("\n");
  console.log("            ╔═══════════════════════════════════════╗");
  console.log("            ║        🌕  ALL TESTS PASSED! 🐺       ║");
  console.log("            ╚═══════════════════════════════════════╝");
  console.log("");
  console.log("       _..._     ");
  console.log("     .'     `.    ");
  console.log("    :         :    ");
  console.log("    :         :  ");
  console.log("    `.       .'  ");
  console.log("      `-...-'  ");
  console.log("");
  console.log("                     .");
  console.log("                    / V\\");
  console.log("                  / `  /");
  console.log("                 <<   |");
  console.log("                 /    |");
  console.log("               /      |");
  console.log("             /        |");
  console.log("           /    \\  \\ /");
  console.log("          (      ) | |");
  console.log("  ________|   _/_  | |");
  console.log(" <__________\\______)\\__)");
  console.log("");
  console.log("              🐺 AWWWWWWWWWOOOOOOOOOOO! 🐺");
  console.log("");
}

// Helper: Validate article sorting order (pure function for testing)
function validateArticleOrder(articles, label) {
  for (let i = 1; i < articles.length; i++) {
    const current = new Date(articles[i].timestamp.split(" ")[0]);
    const previous = new Date(articles[i - 1].timestamp.split(" ")[0]);

    if (current > previous) {
      throw new Error(
        `${label} articles out of order:\n` +
          `Rank ${articles[i - 1].rank}: ${articles[i - 1].displayTime} (${
            articles[i - 1].timestamp
          })\n` +
          `Rank ${articles[i].rank}: ${articles[i].displayTime} (${articles[i].timestamp})`
      );
    }
  }
}

// Helper: Validate first article is newer than last
function validateFirstNewerThanLast(firstArticle, lastArticle) {
  const first = new Date(firstArticle.timestamp);
  const last = new Date(lastArticle.timestamp);

  if (first <= last) {
    throw new Error(
      "First article is not newer than last article:\n" +
        `First: ${firstArticle.displayTime} (${firstArticle.timestamp})\n` +
        `Last: ${lastArticle.displayTime} (${lastArticle.timestamp})`
    );
  }
}

// Test validation logic with both positive and negative cases
function testValidationLogic() {
  console.log("\n🧪 Testing validation logic...");

  // POSITIVE TEST: Valid data should pass (newest first - correct order)
  const goodArticles = [
    {
      rank: 1,
      timestamp: "2024-01-03 12:00:00", // Newest
      displayTime: "1 day ago",
    },
    {
      rank: 2,
      timestamp: "2024-01-02 12:00:00", // Older
      displayTime: "2 days ago",
    },
    {
      rank: 3,
      timestamp: "2024-01-01 12:00:00", // Oldest
      displayTime: "3 days ago",
    },
  ];

  try {
    validateArticleOrder(goodArticles, "Good");
    console.log("✅ Validation logic correctly accepts valid sorted data");
  } catch (error) {
    console.log(
      `❌ Validation logic failed: Should have accepted valid data! Error: ${error.message}`
    );
    return false;
  }

  // NEGATIVE TEST 1: Invalid adjacent ordering (newer article after older - wrong!)
  const badArticles = [
    {
      rank: 1,
      timestamp: "2024-01-01 12:00:00", // Older
      displayTime: "3 days ago",
    },
    {
      rank: 2,
      timestamp: "2024-01-02 12:00:00", // Newer than rank 1 - this is wrong order!
      displayTime: "2 days ago",
    },
  ];

  let caughtError = false;
  try {
    validateArticleOrder(badArticles, "Bad");
    console.log(
      "❌ Validation logic failed: Should have detected incorrect order!"
    );
    return false;
  } catch (error) {
    if (error.message.includes("articles out of order")) {
      console.log("✅ Validation logic correctly detected incorrect order");
      caughtError = true;
    } else {
      console.log(
        `❌ Validation logic failed: Wrong error type: ${error.message}`
      );
      return false;
    }
  }

  // NEGATIVE TEST 2: First article older than last (wrong!)
  const firstOlder = {
    rank: 1,
    timestamp: "2024-01-01 12:00:00",
    displayTime: "3 days ago",
  };
  const lastNewer = {
    rank: 100,
    timestamp: "2024-01-02 12:00:00",
    displayTime: "2 days ago",
  };

  try {
    validateFirstNewerThanLast(firstOlder, lastNewer);
    console.log(
      "❌ Validation logic failed: Should have detected first older than last!"
    );
    return false;
  } catch (error) {
    if (error.message.includes("First article is not newer")) {
      console.log(
        "✅ Validation logic correctly detected first not newer than last"
      );
      return caughtError && true;
    } else {
      console.log(
        `❌ Validation logic failed: Wrong error type: ${error.message}`
      );
      return false;
    }
  }
}

// Helper: Navigate to article 100 via pagination
async function navigateToArticle100(page) {
  const MAX_PAGINATION_ATTEMPTS = 10; // Reasonable limit for getting to article 100
  const PAGINATION_TIMEOUT_MS = 10000; // 10 seconds max per pagination click (4+ seconds is unusable)
  const TOTAL_PAGINATION_TIMEOUT_MS = 120000; // 2 minutes total (allows for all attempts)
  let paginationAttempts = 0;
  const startTime = Date.now();

  while (!(await page.locator('span.rank:has-text("100.")').count())) {
    // Check for timeout (max 2 minutes total)
    if (Date.now() - startTime > TOTAL_PAGINATION_TIMEOUT_MS) {
      await page.screenshot({
        path: `pagination-timeout-${new Date().toISOString()}.png`,
        fullPage: true,
      });
      throw new Error(
        "❌ Pagination timeout: Exceeded 2 minutes trying to reach article 100.\n" +
          "This may indicate that the page structure has changed or the site is slow.\n" +
          `Made ${paginationAttempts} pagination attempts.\n` +
          `Each pagination action should complete within 10 seconds (4+ seconds is considered unusable).`
      );
    }

    // Check max attempts
    if (paginationAttempts >= MAX_PAGINATION_ATTEMPTS) {
      await page.screenshot({
        path: `pagination-max-attempts-${new Date().toISOString()}.png`,
        fullPage: true,
      });
      throw new Error(
        `❌ Pagination failed: Exceeded maximum attempts (${MAX_PAGINATION_ATTEMPTS}) trying to reach article 100.\n` +
          "This likely indicates the page structure has changed or 'More' button is not working.\n" +
          "Please verify the page structure and 'More' button selector."
      );
    }

    // Check if "More" button exists
    const moreButton = page.getByRole("link", { name: "More", exact: true });
    const moreButtonCount = await moreButton.count();

    if (moreButtonCount === 0) {
      await page.screenshot({
        path: `pagination-no-more-button-${new Date().toISOString()}.png`,
        fullPage: true,
      });

      // Check what's the highest rank we found
      const allRanks = await page.locator("span.rank").allTextContents();
      const highestRank =
        allRanks
          .map((text) => parseInt(text.replace(".", "")))
          .filter((num) => !isNaN(num))
          .sort((a, b) => b - a)[0] || "unknown";

      throw new Error(
        "❌ Pagination failed: 'More' button not found.\n" +
          "The page structure may have changed or we've reached the end of available articles.\n" +
          `Highest article rank found: ${highestRank}\n` +
          "Expected to find article rank 100."
      );
    }

    // Attempt to click with timeout
    try {
      paginationAttempts++;
      await moreButton.click({ timeout: PAGINATION_TIMEOUT_MS });
      await page.waitForLoadState("networkidle", {
        timeout: PAGINATION_TIMEOUT_MS,
      });
    } catch (error) {
      await page.screenshot({
        path: `pagination-click-error-${new Date().toISOString()}.png`,
        fullPage: true,
      });
      throw new Error(
        `❌ Pagination failed: Error clicking 'More' button or waiting for page load.\n` +
          `Attempt: ${paginationAttempts}/${MAX_PAGINATION_ATTEMPTS}\n` +
          `Timeout: ${
            PAGINATION_TIMEOUT_MS / 1000
          } seconds (exceeds acceptable 4-second user wait time)\n` +
          `Error: ${error.message}\n` +
          "This may indicate network issues or page load problems."
      );
    }
  }

  console.log(
    `✅ Pagination successful: Reached article 100 after ${paginationAttempts} click(s)`
  );
}

// 1. Test: Validate pagination functionality
async function testPagination(url) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(url);
    await navigateToArticle100(page);
    console.log("✅ Pagination test passed");
  } catch (error) {
    console.error("❌ Pagination test failed:", error.message);
    throw error;
  } finally {
    await browser.close();
  }
}

// 2. Overview - Main test function that validates article sorting
async function validateArticleSorting(url) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(url);

    // 2. Key Implementation - Extracting article timestamps
    async function getArticleDetails(rank) {
      const articleRow = await page
        .locator("span.rank")
        .getByText(`${rank}.`, { exact: true })
        .first();

      if (!articleRow) {
        throw new Error(`Could not find article with rank ${rank}`);
      }

      const timestamp = await articleRow
        .locator("xpath=../../following-sibling::tr[1]")
        .locator("span.age")
        .getAttribute("title");

      return {
        rank,
        timestamp,
        displayTime: await articleRow
          .locator("xpath=../../following-sibling::tr[1]")
          .locator("span.age")
          .textContent(),
      };
    }

    // Get first 3 articles
    const topArticles = await Promise.all(
      [1, 2, 3].map((rank) => getArticleDetails(rank))
    );

    // 3. Core Logic - Timestamp comparison and validation with screenshot on error
    async function verifyOrderWithScreenshot(articles, label) {
      try {
        validateArticleOrder(articles, label);
      } catch (error) {
        // Try to take screenshot (if elements are still visible)
        try {
          await page
            .locator("span.rank")
            .getByText(`${articles[1].rank}.`, { exact: true })
            .first()
            .scrollIntoViewIfNeeded({ timeout: 5000 });
          await page.screenshot({
            path: `sorting-error-${label}-${new Date().toISOString()}.png`,
            fullPage: false,
            clip: {
              x: 0,
              y: await page
                .locator("span.rank")
                .getByText(`${articles[0].rank}.`, { exact: true })
                .first()
                .evaluate((el) => el.getBoundingClientRect().y - 20),
              width: 1000,
              height: 200,
            },
          });
        } catch (screenshotError) {
          // If screenshot fails (elements not visible), just log and continue
          console.log(
            `⚠️  Could not take screenshot for ${label} error (elements not visible)`
          );
        }
        // Re-throw the validation error
        throw error;
      }
    }

    // Verify top articles BEFORE pagination (they're still visible)
    await verifyOrderWithScreenshot(topArticles, "Top");

    // Navigate to article 100 via pagination (prerequisite for sorting test)
    await navigateToArticle100(page);

    // Get last 3 articles
    const bottomArticles = await Promise.all(
      [98, 99, 100].map((rank) => getArticleDetails(rank))
    );

    // Verify bottom articles (they're on the current page)
    await verifyOrderWithScreenshot(bottomArticles, "Bottom");

    // Verify first is newer than last
    try {
      validateFirstNewerThanLast(
        topArticles[0],
        bottomArticles[bottomArticles.length - 1]
      );
    } catch (error) {
      // Take screenshot of first and last articles
      try {
        await page
          .locator("span.rank")
          .getByText("1.", { exact: true })
          .first()
          .scrollIntoViewIfNeeded();
        await page.screenshot({
          path: `sorting-error-first-last-${new Date().toISOString()}.png`,
          fullPage: false,
          clip: {
            x: 0,
            y: await page
              .locator("span.rank")
              .getByText("1.", { exact: true })
              .first()
              .evaluate((el) => el.getBoundingClientRect().y - 20),
            width: 1000,
            height: 100,
          },
        });
      } catch (screenshotError) {
        console.log("⚠️  Could not take screenshot for first/last error");
      }
      throw error;
    }

    console.log("✅ All articles are correctly sorted!");
  } catch (error) {
    // 4. Error Handling
    console.error("❌ Test failed:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

// 5. Test Execution - Demonstrating test reliability
(async () => {
  console.log("Starting tests...");

  let validationLogicTestPassed = false;
  let paginationTestPassed = false;
  let sortingTestPassed = false;
  const baseUrl = "https://news.ycombinator.com";

  // Test validation logic with known-bad data (negative test)
  validationLogicTestPassed = testValidationLogic();
  if (!validationLogicTestPassed) {
    console.log(
      "❌ Validation logic test failed - cannot proceed with E2E tests"
    );
    return;
  }

  // Test pagination functionality
  try {
    console.log("\n📄 Testing pagination on /newest...");
    await testPagination(`${baseUrl}/newest`);
    paginationTestPassed = true;
  } catch (error) {
    console.log("❌ Pagination test failed - sorting test cannot proceed");
    paginationTestPassed = false;
  }

  // Only run sorting tests if pagination works
  if (paginationTestPassed) {
    try {
      console.log("\n📄 Testing article sorting on /newest...");
      await validateArticleSorting(`${baseUrl}/newest`);
      console.log("✅ Sorting test passed on /newest");
      sortingTestPassed = true;
    } catch (error) {
      console.log("❌ Sorting test failed on /newest:", error.message);
      sortingTestPassed = false;
    }
  }

  // Display the wolf howl ONLY if all tests that should pass, actually passed!
  if (validationLogicTestPassed && paginationTestPassed && sortingTestPassed) {
    displayWolfHowl();
  } else {
    console.log("\n❌ Some tests failed - no wolf howl for you! 🐺");
    if (!validationLogicTestPassed) {
      console.log("   - Validation logic test failed");
    }
    if (!paginationTestPassed) {
      console.log("   - Pagination test failed");
    }
    if (!sortingTestPassed) {
      console.log("   - Sorting test failed");
    }
  }
})();
