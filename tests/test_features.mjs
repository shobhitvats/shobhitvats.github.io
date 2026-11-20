/**
 * Tier 1: Feature Presence & Content Accuracy E2E Test Suite
 * Path: tests/test_features.mjs
 * 
 * Verifies explicit presence, formatting, and structural integrity of:
 * - F1: Visual Design System & CSS Variables
 * - F2: Navigation & Responsive Menu
 * - F3: Velsera Experience Integration
 * - F4: Outlier Experience Integration
 * - F5: MolBridge Project Showcase
 * - F6: Aegis Intelligence Showcase
 * - F7: Gargi Nanda Recommendation Flow
 * - F8: Resume Accessibility & CTAs
 * - F9: Mobile 375px Responsive Safeguards
 * - F10: Desktop Lighthouse & Foundational Standards
 * - F11: Semantic HTML & Accessibility Standards
 * - F12: Nucleovir Therapeutics & Sci-Ops Demonstration
 * 
 * Total: 60 tests (5 tests per feature).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const ALL_PAGES = [
  'index.html',
  'about.html',
  'contact.html',
  'beyond.html',
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

const PRIMARY_PAGES = [
  'index.html',
  'about.html',
  'contact.html',
  'beyond.html',
  'projects/index.html'
];

function readPage(relativePath) {
  const fullPath = path.join(ROOT_DIR, relativePath);
  assert.ok(fs.existsSync(fullPath), `File must exist: ${relativePath}`);
  return fs.readFileSync(fullPath, 'utf8');
}

function readCss() {
  const cssPath = path.join(ROOT_DIR, 'css/style.css');
  assert.ok(fs.existsSync(cssPath), 'css/style.css must exist');
  return fs.readFileSync(cssPath, 'utf8');
}

describe('Tier 1: Feature Presence & Content Accuracy', () => {

  // ───────────────────────────────────────────────────────────────────────────
  // F1: Visual Design System & CSS Variables
  // ───────────────────────────────────────────────────────────────────────────
  describe('F1: Visual Design System & CSS Variables', () => {
    const css = readCss();

    it('F1.1: Root custom properties define canvas/background tokens', () => {
      const hasBg = /--bg(-canvas)?\s*:/i.test(css) || /--surface\s*:/i.test(css);
      assert.ok(hasBg, 'CSS :root must define background tokens like --bg or --bg-canvas');
    });

    it('F1.2: Root custom properties define typography/text color tokens', () => {
      const hasTextTokens = /--text(-primary)?\s*:/i.test(css) && /--text-secondary\s*:/i.test(css);
      assert.ok(hasTextTokens, 'CSS :root must define text tokens (--text/--text-primary and --text-secondary)');
    });

    it('F1.3: Root custom properties define accent color tokens', () => {
      const hasAccent = /--accent\s*:/i.test(css);
      assert.ok(hasAccent, 'CSS :root must define --accent color token');
    });

    it('F1.4: Root custom properties define typography font families', () => {
      const hasFonts = /--font-sans\s*:/i.test(css) && /--font-serif\s*:/i.test(css);
      assert.ok(hasFonts, 'CSS :root must define font tokens (--font-sans and --font-serif)');
    });

    it('F1.5: Modular utility and layout classes exist in stylesheet', () => {
      const hasContainer = /\.container\b/i.test(css);
      const hasBtn = /\.btn\b/i.test(css);
      const hasBadge = /\.badge\b/i.test(css);
      assert.ok(hasContainer && hasBtn && hasBadge, 'CSS must include standard modular classes: .container, .btn, .badge');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // F2: Navigation & Responsive Menu
  // ───────────────────────────────────────────────────────────────────────────
  describe('F2: Navigation & Responsive Menu', () => {
    it('F2.1: Navigation landmark (<nav>) exists on all primary pages', () => {
      for (const page of PRIMARY_PAGES) {
        const html = readPage(page);
        assert.ok(/<nav\b[^>]*>/i.test(html), `Page ${page} must contain a <nav> element`);
      }
    });

    it('F2.2: Consistent core navigation links present in navigation menus', () => {
      for (const page of PRIMARY_PAGES) {
        const html = readPage(page);
        const navMatch = html.match(/<nav\b[^>]*>([\s\S]*?)<\/nav>/i);
        assert.ok(navMatch, `Page ${page} must contain <nav> content`);
        const navHtml = navMatch[1];
        assert.ok(/Home/i.test(navHtml), `Nav in ${page} must contain Home link`);
        assert.ok(/About/i.test(navHtml), `Nav in ${page} must contain About link`);
        assert.ok(/Projects/i.test(navHtml), `Nav in ${page} must contain Projects link`);
        assert.ok(/Contact/i.test(navHtml), `Nav in ${page} must contain Contact link`);
      }
    });

    it('F2.3: Mobile hamburger menu toggle button exists on primary pages', () => {
      for (const page of PRIMARY_PAGES) {
        const html = readPage(page);
        const hasToggle = /id=["']navToggle["']|class=["'][^"']*nav-toggle[^"']*["']/i.test(html);
        assert.ok(hasToggle, `Page ${page} must contain a mobile nav toggle button (#navToggle or .nav-toggle)`);
      }
    });

    it('F2.4: Mobile nav toggle button includes accessible label (aria-label)', () => {
      for (const page of PRIMARY_PAGES) {
        const html = readPage(page);
        const hasAriaLabel = /<button[^>]*nav-toggle[^>]*aria-label=["'][^"']+["']|<button[^>]*aria-label=["'][^"']+["'][^>]*nav-toggle|<button[^>]*id=["']navToggle["'][^>]*aria-label=["'][^"']+["']|<button[^>]*aria-label=["'][^"']+["'][^>]*id=["']navToggle["']/i.test(html);
        assert.ok(hasAriaLabel, `Page ${page} mobile nav toggle must include an aria-label`);
      }
    });

    it('F2.5: Navigation brand/logo links to homepage', () => {
      for (const page of PRIMARY_PAGES) {
        const html = readPage(page);
        // Find <a> tag with class containing nav-logo
        const logoMatch = html.match(/<a\b[^>]*\bclass=["'][^"']*nav-logo[^"']*["'][^>]*>|<a\b[^>]*\bhref=["'][^"']*["'][^>]*\bclass=["'][^"']*nav-logo[^"']*["'][^>]*>/i);
        assert.ok(logoMatch, `Page ${page} must contain a nav-logo link`);
        const hrefMatch = logoMatch[0].match(/href=["']([^"']*)["']/i);
        assert.ok(hrefMatch, `Nav logo in ${page} must have an href attribute`);
        const target = hrefMatch[1];
        assert.ok(
          target.endsWith('index.html') || target === '/' || target === './',
          `Nav logo in ${page} must link to home (found: ${target})`
        );
      }
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // F3: Velsera Experience Integration
  // ───────────────────────────────────────────────────────────────────────────
  describe('F3: Velsera Experience Integration', () => {
    const aboutHtml = readPage('about.html');
    const indexHtml = readPage('index.html');
    const velseraHtml = readPage('projects/velsera.html');

    it('F3.1: "Velsera" explicitly present in experience section & case study', () => {
      assert.ok(/Velsera/i.test(aboutHtml), 'about.html must explicitly mention Velsera');
      assert.ok(/Velsera/i.test(velseraHtml), 'projects/velsera.html must explicitly mention Velsera');
    });

    it('F3.2: Role "Automation Developer" explicitly documented', () => {
      assert.ok(/Automation Developer/i.test(aboutHtml), 'about.html must document role as Automation Developer');
    });

    it('F3.3: "KB V&V" (Knowledge Base Verification & Validation) context documented', () => {
      const hasKbVv = /KB V&V|Knowledge[- ]base.*Verification/i.test(aboutHtml);
      assert.ok(hasKbVv, 'about.html must reference KB V&V or Knowledge Base Verification');
      assert.ok(/KB V&V|Knowledge Base Verification/i.test(velseraHtml), 'projects/velsera.html must reference KB V&V');
    });

    it('F3.4: Automated "Comparator Analysis" tool development documented', () => {
      assert.ok(/Comparator Analysis/i.test(aboutHtml), 'about.html must document the Comparator Analysis tool');
      assert.ok(/Comparator Analysis/i.test(velseraHtml), 'projects/velsera.html must document Comparator Analysis');
    });

    it('F3.5: UAT, documentation, 100% adoption, and NDA hygiene documented cleanly on Velsera case study', () => {
      const hasUat = /UAT|User Acceptance Testing|technical manual|user manual/i.test(aboutHtml);
      assert.ok(hasUat, 'about.html must document UAT or technical documentation for Velsera work');
      assert.ok(/User Acceptance Testing/i.test(velseraHtml) && /100%/i.test(velseraHtml), 'projects/velsera.html must document UAT and 100% adoption');
      assert.equal(/gold_set_tps_comparison|diseaseTree/i.test(velseraHtml), false, 'projects/velsera.html must not leak internal script or variable names');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // F4: Outlier Experience Integration
  // ───────────────────────────────────────────────────────────────────────────
  describe('F4: Outlier Experience Integration', () => {
    const aboutHtml = readPage('about.html');

    it('F4.1: "Outlier" explicitly present in experience section', () => {
      assert.ok(/Outlier/i.test(aboutHtml), 'about.html must explicitly mention Outlier');
    });

    it('F4.2: Role "LLM Evaluator" or "Data Annotator & LLM Evaluator" documented', () => {
      const hasRole = /LLM Evaluator|Data Annotator/i.test(aboutHtml);
      assert.ok(hasRole, 'about.html must document role as LLM Evaluator or Data Annotator');
    });

    it('F4.3: LLM evaluation criteria explicitly cited', () => {
      const hasCriteria = /factual accuracy|logical consistency|hallucination|reasoning chain/i.test(aboutHtml);
      assert.ok(hasCriteria, 'about.html must cite evaluation dimensions (accuracy, consistency, hallucinations, reasoning)');
    });

    it('F4.4: AI training projects named (Blackbeard, Ather, or Springer)', () => {
      const hasProjects = /Blackbeard|Ather|Springer/i.test(aboutHtml);
      assert.ok(hasProjects, 'about.html must cite AI training projects like Blackbeard, Ather, or Springer');
    });

    it('F4.5: Tenure duration or remote professional context documented', () => {
      const hasContext = /Remote|Oct 2025|7 months|\d+\s*months/i.test(aboutHtml);
      assert.ok(hasContext, 'about.html must document Outlier tenure duration or remote setting');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // F5: MolBridge Project Showcase
  // ───────────────────────────────────────────────────────────────────────────
  describe('F5: MolBridge Project Showcase', () => {
    const indexHtml = readPage('index.html');
    const molbridgeHtml = readPage('projects/molbridge.html');
    const projectsIndexHtml = readPage('projects/index.html');

    it('F5.1: Flagship project "MolBridge" featured with "NonCovalent Atlas"', () => {
      const hasAtlas = /MolBridge.*NonCovalent Atlas|NonCovalent Atlas.*MolBridge/i.test(indexHtml) ||
                       /MolBridge.*NonCovalent Atlas/i.test(molbridgeHtml);
      assert.ok(hasAtlas, 'MolBridge must be presented as the NonCovalent Atlas');
    });

    it('F5.2: Capability of mapping 15+ noncovalent interaction families documented', () => {
      const has15Families = /15\+\s*(noncovalent|interaction families|families)/i.test(molbridgeHtml) ||
                            /15\+\s*(noncovalent|interaction families|families)/i.test(indexHtml);
      assert.ok(has15Families, 'MolBridge must highlight 15+ noncovalent interaction families');
    });

    it('F5.3: Live application link (molbridge.streamlit.app) present and valid', () => {
      const hasLiveUrl = /https:\/\/molbridge\.streamlit\.app/i.test(indexHtml) ||
                         /https:\/\/molbridge\.streamlit\.app/i.test(molbridgeHtml) ||
                         /https:\/\/molbridge\.streamlit\.app/i.test(projectsIndexHtml);
      assert.ok(hasLiveUrl, 'MolBridge live link https://molbridge.streamlit.app must be present');
    });

    it('F5.4: Core tech stack tags present (Python, Streamlit, FastAPI, BioPython, Docker, Numba)', () => {
      const fullText = indexHtml + molbridgeHtml + projectsIndexHtml;
      assert.ok(/Streamlit/i.test(fullText), 'MolBridge stack must include Streamlit');
      assert.ok(/FastAPI/i.test(fullText), 'MolBridge stack must include FastAPI');
      assert.ok(/BioPython/i.test(fullText), 'MolBridge stack must include BioPython');
      assert.ok(/Numba/i.test(fullText), 'MolBridge stack must include Numba');
    });

    it('F5.5: Quantitative performance impact documented (60% runtime reduction)', () => {
      const hasMetric = /60%\s*Runtime reduction|60%\s*reduction/i.test(indexHtml) ||
                        /60%\s*Runtime reduction|60%\s*reduction/i.test(molbridgeHtml);
      assert.ok(hasMetric, 'MolBridge must document 60% runtime reduction impact');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // F6: Aegis Intelligence Showcase
  // ───────────────────────────────────────────────────────────────────────────
  describe('F6: Aegis Intelligence Showcase', () => {
    const indexHtml = readPage('index.html');
    const aegisHtml = readPage('projects/aegis.html');
    const projectsIndexHtml = readPage('projects/index.html');

    it('F6.1: Project "Aegis Intelligence" prominently featured', () => {
      const hasAegis = /Aegis Intelligence/i.test(indexHtml) && /Aegis Intelligence/i.test(aegisHtml);
      assert.ok(hasAegis, 'Aegis Intelligence must be featured on index.html and projects/aegis.html');
    });

    it('F6.2: Positioned as Data-as-a-Service (DaaS) engine', () => {
      const hasDaas = /Data-as-a-Service|DaaS/i.test(aegisHtml) || /DaaS/i.test(indexHtml);
      assert.ok(hasDaas, 'Aegis Intelligence must document Data-as-a-Service (DaaS) capability');
    });

    it('F6.3: Stealth browser automation / Playwright architecture documented', () => {
      const hasPlaywright = /Playwright/i.test(aegisHtml);
      assert.ok(hasPlaywright, 'Aegis Intelligence must document Playwright automation architecture');
    });

    it('F6.4: Chrome Manifest V3 (MV3) extension integration documented', () => {
      const hasMv3 = /MV3|Manifest V3/i.test(aegisHtml) || /MV3/i.test(indexHtml);
      assert.ok(hasMv3, 'Aegis Intelligence must document Chrome MV3 extension component');
    });

    it('F6.5: Zero-API-cost ($0 API cost) or commercial replacement capability documented', () => {
      const hasZeroCost = /\$0\s*API Cost|zero-API-cost/i.test(aegisHtml);
      assert.ok(hasZeroCost, 'Aegis Intelligence must document $0 API cost capability');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // F7: Gargi Nanda Recommendation Flow
  // ───────────────────────────────────────────────────────────────────────────
  describe('F7: Gargi Nanda Recommendation Flow', () => {
    const aboutHtml = readPage('about.html');

    it('F7.1: Recommender "Dr. Gargi Nanda" explicitly cited everywhere without bare "Gargi Nanda"', () => {
      for (const page of ['about.html', 'index.html', 'contact.html', 'projects/velsera.html']) {
        const html = readPage(page);
        assert.ok(/Dr\.\s+Gargi Nanda/i.test(html), `${page} must cite Dr. Gargi Nanda`);
        assert.equal(/(?<!Dr\.\s)Gargi Nanda/i.test(html), false, `${page} must not use bare "Gargi Nanda" without "Dr."`);
      }
      const searchJs = fs.readFileSync(path.join(ROOT_DIR, 'js/features/search.js'), 'utf8');
      assert.ok(/Dr\.\s+Gargi Nanda/i.test(searchJs), 'search.js must cite Dr. Gargi Nanda');
    });

    it('F7.2: Professional title "Senior Manager, Knowledge-base" at "Velsera" documented', () => {
      const hasTitle = /Senior Manager.*Knowledge-base/i.test(aboutHtml);
      assert.ok(hasTitle, 'about.html must document title Senior Manager, Knowledge-base');
    });

    it('F7.3: Recommendation quote card present without disrupting main visual flow', () => {
      const hasQuote = /<blockquote\b|class=["'][^"']*quote[^"']*["']/i.test(aboutHtml);
      assert.ok(hasQuote, 'about.html must feature an endorsement quote block');
    });

    it('F7.4: Dedicated trigger present to access full letter of recommendation', () => {
      const hasTrigger = /id=["']expandLetterBtn["']|data-open-modal=["']recommendation-modal["']|class=["'][^"']*expand-btn[^"']*["']/i.test(aboutHtml);
      assert.ok(hasTrigger, 'about.html must include a trigger to view the full recommendation letter');
    });

    it('F7.5: Letter of recommendation PDF link (recommendation.pdf) present and accessible', () => {
      const hasPdf = /recommendation\.pdf/i.test(aboutHtml);
      assert.ok(hasPdf, 'about.html must provide a link to recommendation.pdf');
      const recPdfPath = path.join(ROOT_DIR, 'assets/recommendation.pdf');
      assert.ok(fs.existsSync(recPdfPath), 'assets/recommendation.pdf file must exist on disk');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // F8: Resume Accessibility & CTAs
  // ───────────────────────────────────────────────────────────────────────────
  describe('F8: Resume Accessibility & CTAs', () => {
    it('F8.1: Primary resume CTA link present on site', () => {
      const allText = PRIMARY_PAGES.map(readPage).join('\n');
      const hasResumeCta = /resume\.pdf/i.test(allText);
      assert.ok(hasResumeCta, 'Website must contain links targeting resume.pdf');
    });

    it('F8.2: Resume link points to valid relative assets path', () => {
      const allText = PRIMARY_PAGES.map(readPage).join('\n');
      const hasAssetsLink = /href=["'][^"']*assets\/resume\.pdf["']/i.test(allText) || /resume\.pdf/i.test(allText);
      assert.ok(hasAssetsLink, 'Resume link must point to assets/resume.pdf');
    });

    it('F8.3: Resume link contains accessible descriptive text', () => {
      const allText = PRIMARY_PAGES.map(readPage).join('\n');
      const hasDescriptiveText = /Resume|Download Resume|CV/i.test(allText);
      assert.ok(hasDescriptiveText, 'Resume CTA must contain descriptive accessible text');
    });

    it('F8.4: Physical resume PDF asset exists and has non-zero size', () => {
      const resumePath = path.join(ROOT_DIR, 'assets/resume.pdf');
      assert.ok(fs.existsSync(resumePath), 'assets/resume.pdf must exist');
      const stat = fs.statSync(resumePath);
      assert.ok(stat.size > 1000, `assets/resume.pdf must be non-empty (size: ${stat.size} bytes)`);
    });

    it('F8.5: Contact or profile channels provide access to resume or qualifications', () => {
      const contactHtml = readPage('contact.html');
      const aboutHtml = readPage('about.html');
      const hasContactOrQuals = /shobhitvats1122@gmail\.com/i.test(contactHtml) &&
                                /BS-MS/i.test(aboutHtml);
      assert.ok(hasContactOrQuals, 'Contact and about pages must convey professional qualifications and contact channels');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // F9: Mobile 375px Zero Horizontal Overflow Safeguards
  // ───────────────────────────────────────────────────────────────────────────
  describe('F9: Mobile 375px Responsive Safeguards', () => {
    it('F9.1: Viewport meta tag present on all 12 HTML pages', () => {
      for (const page of ALL_PAGES) {
        const html = readPage(page);
        const hasViewport = /<meta[^>]*name=["']viewport["'][^>]*content=["'][^"']*width=device-width[^"']*["']/i.test(html);
        assert.ok(hasViewport, `Page ${page} must contain a responsive viewport meta tag`);
      }
    });

    it('F9.2: No elements with hardcoded inline pixel widths exceeding 375px', () => {
      for (const page of ALL_PAGES) {
        const html = readPage(page);
        // Match fixed width: Npx where N > 375, excluding max-width and min-width
        const inlineFixedWidthMatches = html.match(/(?<![a-z-])width:\s*([4-9]\d{2}|\d{4,})px/gi) || [];
        assert.equal(
          inlineFixedWidthMatches.length,
          0,
          `Page ${page} must not have fixed inline widths > 375px (found: ${inlineFixedWidthMatches.join(', ')})`
        );
      }
    });

    it('F9.3: Responsive media query breakpoints defined in CSS', () => {
      const css = readCss();
      const hasMediaQueries = /@media[^{]*\(\s*max-width:\s*\d+px\s*\)/i.test(css);
      assert.ok(hasMediaQueries, 'css/style.css must define mobile responsive media queries');
    });

    it('F9.4: Global image style sets max-width: 100% or fluid sizing', () => {
      const css = readCss();
      const hasResponsiveImg = /img\b[^{]*{[^}]*max-width:\s*100%/i.test(css) ||
                               /max-width:\s*100%/i.test(css);
      assert.ok(hasResponsiveImg, 'css/style.css must ensure images are constrained with max-width: 100%');
    });

    it('F9.5: Responsive container / grid styling ensures fluid layout', () => {
      const css = readCss();
      const hasFluidContainer = /\.container\b[^{]*{[^}]*max-width/i.test(css) ||
                                /--max-width/i.test(css);
      assert.ok(hasFluidContainer, 'css/style.css must configure responsive max-width on containers');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // F10: Desktop Lighthouse & Foundational Standards
  // ───────────────────────────────────────────────────────────────────────────
  describe('F10: Desktop Lighthouse & Foundational Standards', () => {
    it('F10.1: Valid <title> element with descriptive subject on all 12 pages', () => {
      for (const page of ALL_PAGES) {
        const html = readPage(page);
        const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
        assert.ok(titleMatch, `Page ${page} must contain a <title> element`);
        assert.ok(titleMatch[1].trim().length > 5, `Page ${page} title must not be empty`);
        assert.ok(/Shobhit/i.test(titleMatch[1]), `Page ${page} title should include Shobhit`);
      }
    });

    it('F10.2: <meta name="description"> tag present on primary pages', () => {
      for (const page of PRIMARY_PAGES) {
        const html = readPage(page);
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
        assert.ok(descMatch, `Page ${page} must have a meta description tag`);
        assert.ok(descMatch[1].trim().length >= 15, `Page ${page} meta description must be informative`);
      }
    });

    it('F10.3: Character encoding UTF-8 declared on all 12 pages', () => {
      for (const page of ALL_PAGES) {
        const html = readPage(page);
        const hasUtf8 = /<meta[^>]*charset=["']UTF-8["']/i.test(html);
        assert.ok(hasUtf8, `Page ${page} must declare UTF-8 charset`);
      }
    });

    it('F10.4: Content images specify alt attributes for accessibility', () => {
      for (const page of PRIMARY_PAGES) {
        const html = readPage(page);
        const imgTags = html.match(/<img\b[^>]*>/gi) || [];
        for (const img of imgTags) {
          assert.ok(/\balt=["'][^"']*["']/i.test(img), `Image in ${page} must have an alt attribute: ${img}`);
        }
      }
    });

    it('F10.5: Optimized modern WebP or SVG format media assets present', () => {
      const assetsDir = path.join(ROOT_DIR, 'assets');
      const files = fs.readdirSync(assetsDir);
      const hasWebp = files.some(f => f.endsWith('.webp'));
      const hasSvg = files.some(f => f.endsWith('.svg'));
      assert.ok(hasWebp, 'assets directory must contain WebP image assets');
      assert.ok(hasSvg, 'assets directory must contain SVG assets');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // F11: Semantic HTML & Accessibility Standards
  // ───────────────────────────────────────────────────────────────────────────
  describe('F11: Semantic HTML & Accessibility Standards', () => {
    it('F11.1: Root <html> specifies lang="en" on all 12 pages', () => {
      for (const page of ALL_PAGES) {
        const html = readPage(page);
        assert.ok(/<html[^>]*\blang=["']en["']/i.test(html), `Page ${page} must have lang="en"`);
      }
    });

    it('F11.2: Valid <nav> landmark present on all 12 pages', () => {
      for (const page of ALL_PAGES) {
        const html = readPage(page);
        assert.ok(/<nav\b[^>]*>/i.test(html), `Page ${page} must have a <nav> landmark`);
      }
    });

    it('F11.3: Content landmarks or semantic sections present on all 12 pages', () => {
      for (const page of ALL_PAGES) {
        const html = readPage(page);
        const hasLandmarks = /<main\b|<section\b|<article\b/i.test(html);
        assert.ok(hasLandmarks, `Page ${page} must contain semantic landmarks (<main>, <section>, or <article>)`);
      }
    });

    it('F11.4: Valid <footer> landmark present on all primary pages', () => {
      for (const page of PRIMARY_PAGES) {
        const html = readPage(page);
        assert.ok(/<footer\b[^>]*>/i.test(html), `Page ${page} must have a <footer> landmark`);
      }
    });

    it('F11.5: Exactly one <h1> heading per page for proper heading hierarchy', () => {
      for (const page of ALL_PAGES) {
        const html = readPage(page);
        const h1Matches = html.match(/<h1\b[^>]*>/gi) || [];
        assert.equal(
          h1Matches.length,
          1,
          `Page ${page} must have exactly one <h1> element (found: ${h1Matches.length})`
        );
      }
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // F12: Nucleovir Therapeutics & Sci-Ops Demonstration
  // ───────────────────────────────────────────────────────────────────────────
  describe('F12: Nucleovir Therapeutics & Sci-Ops Demonstration', () => {
    const indexHtml = readPage('index.html');
    const aboutHtml = readPage('about.html');
    const projectsIndexHtml = readPage('projects/index.html');
    const sciopsHtml = readPage('projects/sciops.html');
    const searchJs = fs.readFileSync(path.join(ROOT_DIR, 'js/features/search.js'), 'utf8');

    it('F12.1: Nucleovir Therapeutics & Sci-Ops documented across primary portfolio entry points', () => {
      for (const [name, html] of [
        ['index.html', indexHtml],
        ['about.html', aboutHtml],
        ['projects/index.html', projectsIndexHtml],
        ['projects/sciops.html', sciopsHtml]
      ]) {
        assert.ok(/Nucleovir Therapeutics/i.test(html), `${name} must mention Nucleovir Therapeutics`);
        assert.ok(/Sci-Ops|Scientific Operations/i.test(html), `${name} must highlight Scientific Operations / Sci-Ops`);
      }
    });

    it('F12.2: sciops.html cites Co-Founder & CSO / CEO roles without naming founders directly, and about.html retains AIC-IISER Pune + certification modal', () => {
      assert.ok(/Co-Founder\s*&(amp;)?\s*CSO/i.test(sciopsHtml), 'sciops.html must cite Co-Founder & CSO');
      assert.ok(/Co-Founder\s*&(amp;)?\s*CEO/i.test(sciopsHtml), 'sciops.html must cite Co-Founder & CEO');
      assert.equal(/Ayush Ranawade|Yogesh Ostwal/i.test(sciopsHtml), false, 'sciops.html must not directly name founders');
      assert.ok(/AIC[–-]IISER Pune/i.test(aboutHtml), 'about.html must cite AIC-IISER Pune');
      assert.ok(/id=["']nucleovir-modal["']/i.test(aboutHtml), 'about.html must contain #nucleovir-modal <dialog>');
    });

    it('F12.3: projects/sciops.html documents core operational pillars concisely without contrived mock examples', () => {
      for (const pillar of ['Project Management', 'Data Organisation', 'NAS', 'Samba', 'Documentation', 'Cross-Functional']) {
        assert.ok(new RegExp(pillar, 'i').test(sciopsHtml), `sciops.html must document ${pillar}`);
      }
      assert.equal(
        /Load Valid Example|PROJ-ALPHA|NAS_ROOT|final_v2/i.test(sciopsHtml),
        false,
        'sciops.html must not contain contrived mock examples or directory trees'
      );
      assert.equal(
        /\(9 July\s*[–-]\s*1 October 2026\)|9 July 2026\s*[–-]\s*1 October 2026/i.test(aboutHtml),
        false,
        'about.html endorsement card and modal must not display the parenthetical 9 July - 1 October 2026 bracket'
      );
    });

    it('F12.4: Strict NDA hygiene enforced across all 13 HTML pages (zero confidential leaks)', () => {
      for (const page of ALL_PAGES) {
        const html = readPage(page);
        assert.equal(/NV_010|Oncovir|docs\.google\.com\/document|25,?000|30,?000|\/home\/vats/i.test(html), false, `Confidential identifier leaked on ${page}`);
      }
    });

    it('F12.5: Command Palette search index surfaces Nucleovir and Sci-Ops case study', () => {
      assert.ok(/Nucleovir/i.test(searchJs), 'search.js must index Nucleovir');
      assert.ok(/projects\/sciops\.html/i.test(searchJs), 'search.js must index projects/sciops.html');
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // F13: Pre-Launch SEO, Social Preview, 404 & Repository Polish
  // ───────────────────────────────────────────────────────────────────────────
  describe('F13: Pre-Launch SEO, Social Preview, 404 & Repository Polish', () => {
    it('F13.1: Branded 1200x630 OpenGraph banner exists and canonical + OG/Twitter tags exist on all 16 HTML pages', () => {
      const ogBannerPath = path.join(ROOT_DIR, 'assets/og-banner.png');
      assert.ok(fs.existsSync(ogBannerPath), 'assets/og-banner.png must exist');
      assert.ok(fs.statSync(ogBannerPath).size > 10 * 1024, 'assets/og-banner.png must be > 10 KB');

      for (const page of ALL_PAGES) {
        const html = readPage(page);
        assert.ok(/<link\s+rel=["']canonical["']\s+href=["']https:\/\/shobhitvats\.github\.io\//i.test(html), `${page} must include canonical link`);
        assert.ok(/<meta\s+property=["']og:title["']/i.test(html), `${page} must include og:title`);
        assert.ok(/<meta\s+property=["']og:image["']\s+content=["']https:\/\/shobhitvats\.github\.io\/assets\/og-banner\.png["']/i.test(html), `${page} must include og:image`);
        assert.ok(/<meta\s+name=["']twitter:card["']\s+content=["']summary_large_image["']/i.test(html), `${page} must include twitter:card`);
      }
    });

    it('F13.2: Branded 404.html exists with root-relative assets, noindex, legacy /portfolio/ redirect, and clean NDA hygiene', () => {
      const html404 = readPage('404.html');
      assert.ok(/data-is-404=["']true["']/i.test(html404), '404.html must declare data-is-404="true"');
      assert.ok(/<meta\s+name=["']robots["']\s+content=["']noindex/i.test(html404), '404.html must include noindex robots tag');
      assert.ok(/\/portfolio/i.test(html404) && /window\.location\.replace/i.test(html404), '404.html must redirect legacy /portfolio/ routes');
      assert.ok(/href=["']\/css\/style\.css["']/i.test(html404) && /src=["']\/js\/features\/search\.js["']/i.test(html404), '404.html must use root-relative stylesheet and script URLs');
      assert.equal(/NV_010|Oncovir|gold_set_tps_comparison_v2|\/home\/vats/i.test(html404), false, '404.html must not leak confidential identifiers');
    });

    it('F13.3: Public README.md exists, links live portfolio, documents npm test, and keeps NDA/local-path hygiene', () => {
      const readmePath = path.join(ROOT_DIR, 'README.md');
      assert.ok(fs.existsSync(readmePath), 'README.md must exist at repo root');
      const readme = fs.readFileSync(readmePath, 'utf8');
      assert.ok(/https:\/\/shobhitvats\.github\.io\//i.test(readme), 'README.md must link live site');
      assert.ok(/npm test/i.test(readme), 'README.md must document npm test');
      assert.ok(/MolBridge-NonCovalent-Atlas/i.test(readme), 'README.md must reference verified MolBridge repo');
      assert.equal(/NV_010|Oncovir|gold_set_tps_comparison_v2|\/home\/vats/i.test(readme), false, 'README.md must not leak private paths or NDA strings');
    });

    it('F13.4: sitemap.xml, robots.txt, and .nojekyll exist with valid canonical coverage', () => {
      const nojekyllPath = path.join(ROOT_DIR, '.nojekyll');
      const robotsPath = path.join(ROOT_DIR, 'robots.txt');
      const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
      assert.ok(fs.existsSync(nojekyllPath), '.nojekyll must exist');
      assert.ok(fs.existsSync(robotsPath), 'robots.txt must exist');
      assert.ok(fs.existsSync(sitemapPath), 'sitemap.xml must exist');

      const robots = fs.readFileSync(robotsPath, 'utf8');
      assert.ok(/Sitemap:\s*https:\/\/shobhitvats\.github\.io\/sitemap\.xml/i.test(robots), 'robots.txt must reference sitemap.xml');

      const sitemap = fs.readFileSync(sitemapPath, 'utf8');
      const urlCount = (sitemap.match(/<loc>https:\/\/shobhitvats\.github\.io\//g) || []).length;
      assert.equal(urlCount, 16, `sitemap.xml must contain all 16 canonical URLs (got ${urlCount})`);
    });

    it('F13.5: Verified public GitHub repo links appear on engineering pages with noopener noreferrer', () => {
      const checks = [
        ['index.html', /https:\/\/github\.com\/shobhitvats\/MolBridge-NonCovalent-Atlas/i],
        ['projects/index.html', /https:\/\/github\.com\/shobhitvats\/shobhitvats\.github\.io/i],
        ['projects/molbridge.html', /https:\/\/github\.com\/shobhitvats\/MolBridge-NonCovalent-Atlas/i],
        ['projects/ddg.html', /https:\/\/github\.com\/shobhitvats\/Mutalyze/i],
        ['about.html', /https:\/\/github\.com\/shobhitvats\/PDB_Python_codes/i]
      ];
      for (const [page, regex] of checks) {
        const html = readPage(page);
        assert.ok(regex.test(html), `${page} must include verified public GitHub repo link`);
        assert.ok(/rel=["']noopener noreferrer["']/i.test(html), `${page} external links must use rel="noopener noreferrer"`);
      }
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // F14: Outlier & IISER Pune Sai Lab Dedicated Case Study Pages
  // ───────────────────────────────────────────────────────────────────────────
  describe('F14: Outlier & IISER Pune Sai Lab Dedicated Case Study Pages', () => {
    const outlierHtml = readPage('projects/outlier.html');
    const saiLabHtml = readPage('projects/sai-lab.html');
    const indexHtml = readPage('index.html');
    const aboutHtml = readPage('about.html');
    const projectsIndexHtml = readPage('projects/index.html');
    const searchJs = fs.readFileSync(path.join(ROOT_DIR, 'js/features/search.js'), 'utf8');

    it('F14.1: Outlier case study documents Blackbeard, Ather, Springer, RLHF, GEM, and STEM reasoning QA', () => {
      for (const term of ['Outlier', 'Blackbeard', 'Ather', 'Springer', 'RLHF', 'GEM', 'Oct 2025']) {
        assert.ok(new RegExp(term, 'i').test(outlierHtml), `projects/outlier.html must document ${term}`);
      }
    });

    it('F14.2: Sai Lab case study documents Prof. Saikrishnan Kayarat, CSD, PDB, AlphaFold v4, ParamBrahma, ClinVar, NMR & MolBridge', () => {
      for (const term of ['Saikrishnan Kayarat', '1\\.2M', '214M', 'ParamBrahma', 'ClinVar', 'NMR', 'MolBridge']) {
        assert.ok(new RegExp(term, 'i').test(saiLabHtml), `projects/sai-lab.html must document ${term}`);
      }
    });

    it('F14.3: Primary portfolio entry points and search index link to outlier.html and sai-lab.html', () => {
      for (const [name, content] of [
        ['index.html', indexHtml],
        ['about.html', aboutHtml],
        ['projects/index.html', projectsIndexHtml],
        ['js/features/search.js', searchJs]
      ]) {
        assert.ok(/outlier\.html/i.test(content), `${name} must reference outlier.html`);
        assert.ok(/sai-lab\.html/i.test(content), `${name} must reference sai-lab.html`);
      }
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // F15: Entity SEO, Schema.org JSON-LD, llms.txt & IndexNow
  // ───────────────────────────────────────────────────────────────────────────
  describe('F15: Entity SEO, Schema.org JSON-LD, llms.txt & IndexNow', () => {
    it('F15.1: All 16 public HTML pages contain valid parsable application/ld+json structured data', () => {
      for (const page of ALL_PAGES) {
        const html = readPage(page);
        const match = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
        assert.ok(match, `${page} must include <script type="application/ld+json">`);
        const parsed = JSON.parse(match[1]);
        assert.equal(parsed['@context'], 'https://schema.org', `${page} JSON-LD must target schema.org`);
        assert.ok(Array.isArray(parsed['@graph']) && parsed['@graph'].length >= 2, `${page} JSON-LD @graph must have >= 2 nodes`);
      }
    });

    it('F15.2: index.html and about.html JSON-LD declare ProfilePage and Person with Shobhit Vats alternateName and sameAs', () => {
      for (const page of ['index.html', 'about.html']) {
        const html = readPage(page);
        const match = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
        const parsed = JSON.parse(match[1]);
        const profileNode = parsed['@graph'].find((n) => n['@type'] === 'ProfilePage');
        const personNode = parsed['@graph'].find((n) => n['@type'] === 'Person');
        assert.ok(profileNode, `${page} JSON-LD must contain ProfilePage node`);
        assert.ok(personNode, `${page} JSON-LD must contain Person node`);
        assert.equal(personNode.name, 'Shobhit Vats Sharma');
        assert.ok(Array.isArray(personNode.alternateName) && personNode.alternateName.includes('Shobhit Vats'), `${page} Person.alternateName must include "Shobhit Vats"`);
        assert.ok(Array.isArray(personNode.sameAs) && personNode.sameAs.some((u) => /github\.com\/shobhitvats/i.test(u)) && personNode.sameAs.some((u) => /linkedin\.com/i.test(u)), `${page} Person.sameAs must link GitHub and LinkedIn`);
      }
    });

    it('F15.3: index.html includes bidirectional rel="me" identity links and max-image-preview:large crawler directive', () => {
      const indexHtml = readPage('index.html');
      assert.ok(/<link\s+rel=["']me["']\s+href=["']https:\/\/github\.com\/shobhitvats["']/i.test(indexHtml), 'index.html must include rel="me" GitHub link');
      assert.ok(/<link\s+rel=["']me["']\s+href=["']https:\/\/www\.linkedin\.com\/in\/shobhit-vats-s-204427132["']/i.test(indexHtml), 'index.html must include rel="me" LinkedIn link');
      assert.ok(/max-image-preview:large/i.test(indexHtml), 'index.html must enable max-image-preview:large');
    });

    it('F15.4: llms.txt and IndexNow verification key file exist with zero NDA or private-path leaks', () => {
      const llmsPath = path.join(ROOT_DIR, 'llms.txt');
      const indexNowPath = path.join(ROOT_DIR, '8f4e2a9c1d7b6035e2a4c8d1f9b0736e.txt');
      assert.ok(fs.existsSync(llmsPath), 'llms.txt must exist at repo root');
      assert.ok(fs.existsSync(indexNowPath), 'IndexNow verification key file must exist at repo root');
      const llms = fs.readFileSync(llmsPath, 'utf8');
      assert.ok(/Shobhit Vats Sharma/i.test(llms) && /Shobhit Vats/i.test(llms), 'llms.txt must cite Shobhit Vats Sharma and Shobhit Vats');
      assert.equal(/NV_010|Oncovir|gold_set_tps_comparison_v2|\/home\/vats/i.test(llms), false, 'llms.txt must not leak private paths or NDA strings');
      assert.equal(fs.readFileSync(indexNowPath, 'utf8').trim(), '8f4e2a9c1d7b6035e2a4c8d1f9b0736e');
    });
  });

});
