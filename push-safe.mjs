#!/usr/bin/env node
/**
 * Safe GitHub push — merges local changes without wiping existing media.
 * Usage:  node push-safe.mjs <GITHUB_PAT>
 */
import { pushToGitHubSafe } from "./src/utils/github.js";

const token = process.argv[2] || process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
if (!token) {
  console.error("Usage: node push-safe.mjs <GITHUB_PERSONAL_ACCESS_TOKEN>");
  process.exit(1);
}

try {
  const result = await pushToGitHubSafe(
    "refactor: migrate socketon→Baileys, add safe media fallback",
    token
  );
  console.log("\n✅ Push successful!");
  console.log("  Commit:", result.url);
  console.log("  Local files pushed:", result.filesCount);
  console.log("  Existing repo files preserved:", result.preserved);
  console.log("\n📥 Download zip:");
  console.log(`  https://github.com/boyde1317-byte/Yuzuki/archive/refs/heads/main.zip`);
} catch (err) {
  console.error("\n❌ Push failed:", err.message);
  process.exit(1);
}
