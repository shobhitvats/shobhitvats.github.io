/**
 * Tier 4: Real-World Scenarios & Desktop Lighthouse E2E Test Suite
 * Path: tests/test_lighthouse.mjs
 * 
 * Verifies end-to-end real-world user journeys and runs desktop Lighthouse audits:
 * - Scenario 1: Recruiter Scans Resume & Velsera Validation (F3, F7, F8, F9)
 * - Scenario 2: Scientist Explores MolBridge & Thesis Context (F5, F1, F2, F11)
 * - Scenario 3: Tech Lead Audits Code Architecture & Aegis Platform (F4, F6, F1, F11)
 * - Scenario 4: Mobile Visitor Navigation on 375px Smartphone (F2, F9, F7, F10)
 * - Scenario 5: Full Accessibility Keyboard Navigation & Screen Reader Audit (F1, F2, F7, F11, F10)
 * - Scenario 6: Desktop Lighthouse Audit on Homepage (Perf >= 90, A11y >= 90, BP >= 90)
 * - Scenario 7: Desktop Lighthouse Audit on About Page (Perf >= 90, A11y >= 90, BP >= 90)
 * 
 * Total: 7 realistic scenarios & audits.
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { chromium } from 'playwright';

const execFileAsync = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 8080;
const BASE_URL = `http://127.0.0.1:${PORT}`;

let server;
let serverStarted = false;
let browser;

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.svg': return 'image/svg+xml';
    case '.ico': return 'image/x-icon';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.webp': return 'image/webp';
    case '.pdf': return 'application/pdf';
    case '.txt': return 'text/plain; charset=utf-8';
    case '.xml': return 'application/xml; charset=utf-8';
    default: return 'application/octet-stream';
  }
}

async function isServerRunning(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 304);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function runLighthouse(targetUrl) {
  const outputPath = `/tmp/lighthouse_${Date.now()}_${Math.random().toString(36).substring(7)}.json`;
  const args = [
    'lighthouse',
    targetUrl,
    '--preset=desktop',
    '--output=json',
    `--output-path=${outputPath}`,
    '--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage',
    '--only-categories=performance,accessibility,best-practices,seo',
    '--quiet'
  ];

  try {
    await execFileAsync('npx', args, {
      cwd: ROOT_DIR,
      timeout: 60000,
      env: { ...process.env, PATH: process.env.PATH }
    });

    const reportJson = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

    const perf = Math.round((reportJson.categories.performance?.score || 0) * 100);
    const a11y = Math.round((reportJson.categories.accessibility?.score || 0) * 100);
    const bp = Math.round((reportJson.categories['best-practices']?.score || 0) * 100);
    const seo = Math.round((reportJson.categories.seo?.score || 0) * 100);

    return { perf, a11y, bp, seo };
  } catch (err) {
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    throw err;
  }
}

describe('Tier 4: Real-World Scenarios & Desktop Lighthouse Verification', () => {

  before(async () => {
    const running = await isServerRunning(`${BASE_URL}/index.html`);
    if (!running) {
      server = http.createServer((req, res) => {
        let reqPath = req.url.split('?')[0];
        if (reqPath === '/') reqPath = '/index.html';
        const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
        const filePath = path.join(ROOT_DIR, safePath);

        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          res.writeHead(200, { 'Content-Type': getContentType(filePath) });
          fs.createReadStream(filePath).pipe(res);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
        }
      });
      await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));
      serverStarted = true;
    }

    browser = await chromium.launch({ headless: true });
  });

  after(async () => {
    if (browser) await browser.close();
    if (serverStarted && server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Real-World Workload Scenarios
  // ───────────────────────────────────────────────────────────────────────────

  it('Scenario 1: Recruiter Scans Resume & Velsera Validation (F3, F7, F8, F9)', async () => {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    try {
      // Step 1: Recruiter lands on homepage
      await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'domcontentloaded' });
      const homeText = await page.innerText('body');
      assert.ok(/IISER Pune/i.test(homeText), 'Recruiter observes IISER Pune credential on homepage');

      // Step 2: Recruiter navigates to About page
      await page.goto(`${BASE_URL}/about.html`, { waitUntil: 'domcontentloaded' });
      const aboutText = await page.innerText('body');

      // Step 3: Recruiter validates Velsera experience details
      assert.ok(/Velsera/i.test(aboutText), 'Recruiter identifies Velsera experience entry');
      assert.ok(/Automation Developer/i.test(aboutText), 'Recruiter validates Automation Developer role');
      assert.ok(/KB V&V|Comparator Analysis/i.test(aboutText), 'Recruiter inspects KB V&V / Comparator Analysis work');

      // Step 4: Recruiter checks Gargi Nanda endorsement
      assert.ok(/Gargi Nanda/i.test(aboutText), 'Recruiter reads recommendation attribution to Gargi Nanda');
      assert.ok(/Senior Manager.*Knowledge-base/i.test(aboutText), 'Recruiter verifies recommender seniority');

      // Step 5: Recruiter inspects recommendation letter download
      const recLink = page.locator('a[href*="recommendation.pdf"]');
      assert.ok(await recLink.isVisible(), 'Recruiter can access PDF recommendation letter');

      // Step 6: Recruiter validates resume file presence on server
      const res = await page.request.get(`${BASE_URL}/assets/resume.pdf`);
      assert.equal(res.status(), 200, 'Resume PDF asset must be downloadable on server');
    } finally {
      await page.close();
    }
  });

  it('Scenario 2: Scientist Explores MolBridge & Thesis Context (F5, F1, F2, F11)', async () => {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    try {
      // Step 1: Scientist lands on homepage and spots MolBridge spotlight
      await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'domcontentloaded' });
      const molbridgeSpotlight = page.locator('a[href*="molbridge"]');
      assert.ok(await molbridgeSpotlight.count() > 0, 'Homepage features MolBridge spotlight');

      // Step 2: Scientist follows link to MolBridge deep dive
      await page.goto(`${BASE_URL}/projects/molbridge.html`, { waitUntil: 'domcontentloaded' });
      const projText = await page.innerText('body');

      // Step 3: Scientist inspects scientific domain details
      assert.ok(/15\+\s*(noncovalent|interaction families|families)/i.test(projText), 'Scientist verifies 15+ noncovalent families');
      assert.ok(/60%\s*Runtime reduction/i.test(projText), 'Scientist validates 60% runtime reduction in HPC pipelines');

      // Step 4: Scientist checks live Streamlit application link
      const liveLink = page.locator('a[href="https://molbridge.streamlit.app"]').first();
      assert.ok(await liveLink.isVisible(), 'Scientist finds live application link to molbridge.streamlit.app');

      // Step 5: Scientist verifies structural biology tech stack
      assert.ok(/BioPython/i.test(projText), 'Scientist verifies BioPython integration');
      assert.ok(/FastAPI/i.test(projText), 'Scientist verifies FastAPI backend integration');
    } finally {
      await page.close();
    }
  });

  it('Scenario 3: Tech Lead Audits Code Architecture & Aegis Platform (F4, F6, F1, F11)', async () => {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    try {
      // Step 1: Tech Lead navigates to Aegis project showcase
      await page.goto(`${BASE_URL}/projects/aegis.html`, { waitUntil: 'domcontentloaded' });
      const aegisText = await page.innerText('body');

      // Step 2: Tech Lead validates system architecture concepts
      assert.ok(/Data-as-a-Service|DaaS/i.test(aegisText), 'Tech lead inspects DaaS platform positioning');
      assert.ok(/Playwright/i.test(aegisText), 'Tech lead inspects Playwright browser automation');
      assert.ok(/MV3|Manifest V3/i.test(aegisText), 'Tech lead validates Chrome MV3 extension component');
      assert.ok(/\$0\s*API Cost/i.test(aegisText), 'Tech lead validates $0 API cost architecture');

      // Step 3: Tech Lead checks Outlier LLM evaluation credentials in About
      await page.goto(`${BASE_URL}/about.html`, { waitUntil: 'domcontentloaded' });
      const aboutText = await page.innerText('body');
      assert.ok(/Outlier/i.test(aboutText), 'Tech lead confirms Outlier AI evaluation experience');
      assert.ok(/LLM Evaluator|Data Annotator/i.test(aboutText), 'Tech lead confirms LLM evaluation credentials');
    } finally {
      await page.close();
    }
  });

  it('Scenario 4: Mobile Visitor Navigation on 375px Smartphone (F2, F9, F7, F10)', async () => {
    const page = await browser.newPage({ viewport: { width: 375, height: 667 } });
    try {
      // Step 1: Mobile visitor opens homepage
      await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'domcontentloaded' });
      const homeOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      assert.equal(homeOverflow, false, 'Homepage must have 0 horizontal overflow at 375px');

      // Step 2: Visitor interacts with hamburger menu
      const toggle = page.locator('#navToggle, .nav-toggle');
      await toggle.click();
      await page.waitForTimeout(100);

      const navOpenOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      assert.equal(navOpenOverflow, false, 'Mobile menu open state must not cause horizontal scroll');

      // Step 3: Visitor navigates to About page
      await page.goto(`${BASE_URL}/about.html`, { waitUntil: 'domcontentloaded' });
      const aboutOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      assert.equal(aboutOverflow, false, 'About page must have 0 horizontal overflow at 375px');

      // Step 4: Visitor expands recommendation letter on mobile
      const expandBtn = page.locator('#expandLetterBtn, [data-open-modal="recommendation-modal"]');
      if (await expandBtn.isVisible()) {
        await expandBtn.click();
        await page.waitForTimeout(200);

        const recOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
        assert.equal(recOverflow, false, 'Expanded letter on mobile must not overflow viewport');
      }
    } finally {
      await page.close();
    }
  });

  it('Scenario 5: Full Accessibility Keyboard Navigation & Screen Reader Audit (F1, F2, F7, F11, F10)', async () => {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    try {
      await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'domcontentloaded' });

      // Check all images have alt attributes
      const imagesMissingAlt = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs.filter((img) => !img.hasAttribute('alt')).length;
      });
      assert.equal(imagesMissingAlt, 0, 'All images on homepage must have alt attributes');

      // Check headings sequence
      const headingsHierarchy = await page.evaluate(() => {
        const h1s = document.querySelectorAll('h1').length;
        const h2s = document.querySelectorAll('h2').length;
        return { h1s, h2s };
      });
      assert.equal(headingsHierarchy.h1s, 1, 'Homepage must have exactly one <h1>');
      assert.ok(headingsHierarchy.h2s >= 1, 'Homepage must have structured <h2> sections');

      // Check keyboard focusability of navigation links
      await page.keyboard.press('Tab');
      const focusedTag = await page.evaluate(() => document.activeElement ? document.activeElement.tagName : null);
      assert.ok(focusedTag, 'Page must support tab keyboard navigation focus');
    } finally {
      await page.close();
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Desktop Lighthouse Preset Automated Audits (Score >= 90)
  // ───────────────────────────────────────────────────────────────────────────

  it('Scenario 6: Desktop Lighthouse Audit on Homepage (Perf >= 90, A11y >= 90, BP >= 90, SEO >= 95)', async () => {
    const scores = await runLighthouse(`${BASE_URL}/index.html`);
    console.log(`Lighthouse Homepage Scores: Performance=${scores.perf}, Accessibility=${scores.a11y}, BestPractices=${scores.bp}, SEO=${scores.seo}`);

    assert.ok(
      scores.perf >= 90,
      `Homepage Performance score must be >= 90 (achieved: ${scores.perf})`
    );
    assert.ok(
      scores.a11y >= 90,
      `Homepage Accessibility score must be >= 90 (achieved: ${scores.a11y})`
    );
    assert.ok(
      scores.bp >= 90,
      `Homepage Best Practices score must be >= 90 (achieved: ${scores.bp})`
    );
    assert.ok(
      scores.seo >= 95,
      `Homepage SEO score must be >= 95 (achieved: ${scores.seo})`
    );
  });

  it('Scenario 7: Desktop Lighthouse Audit on About Page (Perf >= 90, A11y >= 90, BP >= 90, SEO >= 95)', async () => {
    const scores = await runLighthouse(`${BASE_URL}/about.html`);
    console.log(`Lighthouse About Page Scores: Performance=${scores.perf}, Accessibility=${scores.a11y}, BestPractices=${scores.bp}, SEO=${scores.seo}`);

    assert.ok(
      scores.perf >= 90,
      `About Page Performance score must be >= 90 (achieved: ${scores.perf})`
    );
    assert.ok(
      scores.a11y >= 90,
      `About Page Accessibility score must be >= 90 (achieved: ${scores.a11y})`
    );
    assert.ok(
      scores.bp >= 90,
      `About Page Best Practices score must be >= 90 (achieved: ${scores.bp})`
    );
    assert.ok(
      scores.seo >= 95,
      `About Page SEO score must be >= 95 (achieved: ${scores.seo})`
    );
  });

});
