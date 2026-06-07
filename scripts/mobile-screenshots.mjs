/**
 * Mobile layout screenshots (logged-in mock state).
 * Usage: node scripts/mobile-screenshots.mjs [baseUrl]
 */
import { chromium, devices } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "screenshots", "mobile-layout");
const baseUrl = process.argv[2] || "http://127.0.0.1:8765";

const DEVICE_PRESETS = [
  { name: "iphone-se", device: devices["iPhone SE"] },
  { name: "iphone-14", device: devices["iPhone 14"] },
  { name: "galaxy-s20", device: devices["Galaxy S20"] },
];

const WIDTH_CHECKS = [320, 375, 390, 430];

async function mockLoggedIn(page) {
  await page.evaluate(() => {
    window.Auth.isLoggedIn = () => true;
    window.Auth.getUserName = () => "とても長いユーザー名テスト";
    window.Auth.getUserEmail = () => "very.long.email.address@example.com";
    window.Auth.isPaidMember = () => true;
    window.Auth.isAdmin = () => false;
    window.App.renderHeader();
    document.getElementById("mobile-nav")?.classList.add("open");
  });
}

async function hasHorizontalScroll(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth > doc.clientWidth + 1;
  });
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch();

  const results = [];

  for (const { name, device } of DEVICE_PRESETS) {
    const context = await browser.newContext({ ...device });
    const page = await context.newPage();
    const url = `${baseUrl}/index.html`;

    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForFunction(() => window.App?.renderHeader, undefined, { timeout: 30000 });
    await mockLoggedIn(page);
    await page.waitForTimeout(500);

    const overflow = await hasHorizontalScroll(page);
    const file = path.join(outDir, `${name}-logged-in.png`);
    await page.screenshot({ path: file, fullPage: true });
    results.push({ device: name, overflow, file });
    await context.close();
  }

  for (const width of WIDTH_CHECKS) {
    const context = await browser.newContext({
      viewport: { width, height: 800 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent: devices["iPhone 14"].userAgent,
    });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/index.html`, { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForFunction(() => window.App?.renderHeader, undefined, { timeout: 30000 });
    await mockLoggedIn(page);
    await page.waitForTimeout(300);
    const overflow = await hasHorizontalScroll(page);
    const file = path.join(outDir, `width-${width}-logged-in.png`);
    await page.screenshot({ path: file, fullPage: false });
    results.push({ device: `${width}px`, overflow, file });
    await context.close();
  }

  await browser.close();

  console.log("Screenshots saved to:", outDir);
  for (const r of results) {
    console.log(`- ${r.device}: horizontalScroll=${r.overflow} -> ${path.basename(r.file)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
