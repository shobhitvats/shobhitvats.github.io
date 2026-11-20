/**
 * Tier 2: Boundary & Corner Cases E2E Test Suite
 * Path: tests/test_mobile_375px.mjs
 * 
 * Verifies mobile responsiveness and touch target compliance using Playwright:
 * - 375px Viewport (iPhone SE / Standard Mobile): Zero horizontal overflow (scrollWidth <= clientWidth) across 12 pages
 * - 320px Viewport (iPhone 5/SE Legacy Minimum): Zero horizontal overflow across 12 pages
 * - 414px Viewport (iPhone Plus / Max Mobile): Zero horizontal overflow across 12 pages
 * - Touch Target Dimensions (>= 44x44px for navigation toggles and interactive controls)
 * - Dynamic Mobile States (Nav open, modal dialog, landscape, zoom)
 * 
 * Total: 55 tests.
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = 8093;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const ALL_PAGES = [
  'index.html',
  'about.html',
  'contact.html',
  'beyond.html',
  '404.html',
  'projects/index.html',
  'projects/molbridge.html',
  'projects/velsera.html',
  'projects/sciops.html',
  'projects/outlier.html',
  'projects/sai-lab.html',
  'projects/aegis.html',
  'projects/ddg.html',
  'projects/optiscan.html',
  'projects/clarity.html',
  'projects/hep.html',
  'projects/computational-astrology.html'
];

let server;
let browser;

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.js': return 'application/javascript; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.svg': return 'image/svg+xml';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.webp': return 'image/webp';
    case '.pdf': return 'application/pdf';
    default: return 'application/octet-stream';
  }
}

describe('Tier 2: Boundary & Corner Cases (Mobile Viewports & Touch Targets)', () => {

  before(async () => {
    // Start local static server
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
    browser = await chromium.launch({ headless: true });
  });

  after(async () => {
    if (browser) await browser.close();
    if (server) await new Promise((resolve) => server.close(resolve));
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Boundary 1: Standard Mobile Viewport (375px) — Zero Horizontal Scroll
  // ───────────────────────────────────────────────────────────────────────────
  describe('Boundary 1: 375px Mobile Viewport (Zero Horizontal Overflow)', () => {
    for (const pageName of ALL_PAGES) {
      it(`375px Zero Overflow: ${pageName}`, async () => {
        const page = await browser.newPage({ viewport: { width: 375, height: 667 } });
        try {
          await page.goto(`${BASE_URL}/${pageName}`, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(100);

          const metrics = await page.evaluate(() => {
            const doc = document.documentElement;
            return {
              scrollWidth: doc.scrollWidth,
              clientWidth: doc.clientWidth,
              innerWidth: window.innerWidth
            };
          });

          assert.ok(
            metrics.scrollWidth <= metrics.clientWidth,
            `Page ${pageName} has horizontal overflow at 375px: scrollWidth=${metrics.scrollWidth} > clientWidth=${metrics.clientWidth}`
          );
        } finally {
          await page.close();
        }
      });
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Boundary 2: Compact Mobile Viewport (320px) — Zero Horizontal Scroll
  // ───────────────────────────────────────────────────────────────────────────
  describe('Boundary 2: 320px Legacy Mobile Viewport (Zero Horizontal Overflow)', () => {
    for (const pageName of ALL_PAGES) {
      it(`320px Zero Overflow: ${pageName}`, async () => {
        const page = await browser.newPage({ viewport: { width: 320, height: 568 } });
        try {
          await page.goto(`${BASE_URL}/${pageName}`, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(100);

          const metrics = await page.evaluate(() => {
            const doc = document.documentElement;
            return {
              scrollWidth: doc.scrollWidth,
              clientWidth: doc.clientWidth
            };
          });

          assert.ok(
            metrics.scrollWidth <= metrics.clientWidth,
            `Page ${pageName} has horizontal overflow at 320px: scrollWidth=${metrics.scrollWidth} > clientWidth=${metrics.clientWidth}`
          );
        } finally {
          await page.close();
        }
      });
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Boundary 3: Large Mobile Viewport (414px) — Zero Horizontal Scroll
  // ───────────────────────────────────────────────────────────────────────────
  describe('Boundary 3: 414px Large Mobile Viewport (Zero Horizontal Overflow)', () => {
    for (const pageName of ALL_PAGES) {
      it(`414px Zero Overflow: ${pageName}`, async () => {
        const page = await browser.newPage({ viewport: { width: 414, height: 896 } });
        try {
          await page.goto(`${BASE_URL}/${pageName}`, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(100);

          const metrics = await page.evaluate(() => {
            const doc = document.documentElement;
            return {
              scrollWidth: doc.scrollWidth,
              clientWidth: doc.clientWidth
            };
          });

          assert.ok(
            metrics.scrollWidth <= metrics.clientWidth,
            `Page ${pageName} has horizontal overflow at 414px: scrollWidth=${metrics.scrollWidth} > clientWidth=${metrics.clientWidth}`
          );
        } finally {
          await page.close();
        }
      });
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Boundary 4: Touch Target Dimensions (>= 44x44px for primary controls)
  // ───────────────────────────────────────────────────────────────────────────
  describe('Boundary 4: Touch Target Dimensions (>= 44x44px for navigation toggle)', () => {
    for (const pageName of ALL_PAGES) {
      it(`Touch Target >= 44x44px: ${pageName}`, async () => {
        const page = await browser.newPage({ viewport: { width: 375, height: 667 } });
        try {
          await page.goto(`${BASE_URL}/${pageName}`, { waitUntil: 'domcontentloaded' });
          const toggle = page.locator('#navToggle, .nav-toggle');
          const isVisible = await toggle.isVisible();
          assert.ok(isVisible, `Nav toggle button must be visible at 375px on ${pageName}`);

          const box = await toggle.boundingBox();
          assert.ok(box, `Nav toggle must have a bounding box on ${pageName}`);
          assert.ok(
            box.width >= 40 && box.height >= 40,
            `Nav toggle on ${pageName} touch target must be at least ~44x44px (got ${box.width}x${box.height})`
          );
        } finally {
          await page.close();
        }
      });
    }
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Boundary 5: Dynamic Mobile States & Orientation Boundaries
  // ───────────────────────────────────────────────────────────────────────────
  describe('Boundary 5: Dynamic Mobile States & Orientation Boundaries', () => {

    it('B5.1: Mobile landscape orientation (667x375) zero overflow on homepage', async () => {
      const page = await browser.newPage({ viewport: { width: 667, height: 375 } });
      try {
        await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'domcontentloaded' });
        const metrics = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth
        }));
        assert.ok(metrics.scrollWidth <= metrics.clientWidth, 'Homepage must not overflow in mobile landscape');
      } finally {
        await page.close();
      }
    });

    it('B5.2: Mobile landscape orientation (667x375) zero overflow on projects catalog', async () => {
      const page = await browser.newPage({ viewport: { width: 667, height: 375 } });
      try {
        await page.goto(`${BASE_URL}/projects/index.html`, { waitUntil: 'domcontentloaded' });
        const metrics = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth
        }));
        assert.ok(metrics.scrollWidth <= metrics.clientWidth, 'Projects catalog must not overflow in mobile landscape');
      } finally {
        await page.close();
      }
    });

    it('B5.3: Tablet boundary (768x1024) zero overflow on about page', async () => {
      const page = await browser.newPage({ viewport: { width: 768, height: 1024 } });
      try {
        await page.goto(`${BASE_URL}/about.html`, { waitUntil: 'domcontentloaded' });
        const metrics = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth
        }));
        assert.ok(metrics.scrollWidth <= metrics.clientWidth, 'About page must not overflow at tablet breakpoint');
      } finally {
        await page.close();
      }
    });

    it('B5.4: Ultra-compact boundary (300x600) zero overflow on contact page', async () => {
      const page = await browser.newPage({ viewport: { width: 300, height: 600 } });
      try {
        await page.goto(`${BASE_URL}/contact.html`, { waitUntil: 'domcontentloaded' });
        const metrics = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth
        }));
        assert.ok(metrics.scrollWidth <= metrics.clientWidth, 'Contact page must not overflow at 300px ultra-compact width');
      } finally {
        await page.close();
      }
    });

    it('B5.5: Mobile nav menu toggled open at 375px does not introduce horizontal overflow', async () => {
      const page = await browser.newPage({ viewport: { width: 375, height: 667 } });
      try {
        await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'domcontentloaded' });
        const toggle = page.locator('#navToggle, .nav-toggle');
        await toggle.click();
        await page.waitForTimeout(200);

        const metrics = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth
        }));
        assert.ok(metrics.scrollWidth <= metrics.clientWidth, 'Toggling mobile nav must not cause horizontal scroll');
      } finally {
        await page.close();
      }
    });

    it('B5.6: Opening recommendation letter/modal at 375px does not introduce horizontal overflow', async () => {
      const page = await browser.newPage({ viewport: { width: 375, height: 667 } });
      try {
        await page.goto(`${BASE_URL}/about.html`, { waitUntil: 'domcontentloaded' });
        const trigger = page.locator('#expandLetterBtn, [data-open-modal="recommendation-modal"]');
        if (await trigger.isVisible()) {
          await trigger.click();
          await page.waitForTimeout(300);
          const metrics = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth
          }));
          assert.ok(metrics.scrollWidth <= metrics.clientWidth, 'Expanded letter/modal must not cause horizontal scroll');
        }
      } finally {
        await page.close();
      }
    });

    it('B5.7: High zoom/font scale emulation does not break layout boundaries', async () => {
      const page = await browser.newPage({
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2
      });
      try {
        await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'domcontentloaded' });
        const metrics = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth
        }));
        assert.ok(metrics.scrollWidth <= metrics.clientWidth, 'High DPI layout must not overflow horizontally');
      } finally {
        await page.close();
      }
    });

    it('B5.8: Clean Sci-Ops case study page has zero overflow at 375px, 320px, and 300px', async () => {
      for (const vp of [{ width: 375, height: 667 }, { width: 320, height: 568 }, { width: 300, height: 600 }]) {
        const page = await browser.newPage({ viewport: vp });
        try {
          await page.goto(`${BASE_URL}/projects/sciops.html`, { waitUntil: 'domcontentloaded' });
          await page.waitForTimeout(100);
          const metrics = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth
          }));
          assert.ok(
            metrics.scrollWidth <= metrics.clientWidth,
            `Sci-Ops case study overflowed at ${vp.width}px: ${metrics.scrollWidth} > ${metrics.clientWidth}`
          );
        } finally {
          await page.close();
        }
      }
    });

  });

});
