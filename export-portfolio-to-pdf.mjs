import { chromium } from "playwright";
import fs from "fs/promises";
import path from "path";
import { PDFDocument } from "pdf-lib";

const BASE = process.env.BASE || "http://localhost:8080";
const OUT_DIR = "pdf_out";
const FINAL_PDF = "portfolio-full.pdf";

// Keep only same-origin links; avoid assets
function normalizeUrl(u) {
    try {
        const url = new URL(u);
        url.hash = "";
        // drop common tracking params
        ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(p => url.searchParams.delete(p));
        // Remove trailing slashes and normalize index.html to /
        let pathName = url.pathname;
        if (pathName.endsWith("/index.html")) {
            pathName = pathName.slice(0, -10);
        }
        if (pathName.length > 1 && pathName.endsWith("/")) {
            pathName = pathName.slice(0, -1);
        }
        url.pathname = pathName;
        return url.toString();
    } catch { return null; }
}
function isHtmlPage(url) {
    try {
        const u = new URL(url);
        if (u.origin !== new URL(BASE).origin) return false;
        const p = u.pathname.toLowerCase();
        if (p.includes("/assets/") || p.includes("/static/")) return false;
        if (p.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|map|json|xml|txt|pdf|zip)$/)) return false;
        return true;
    } catch { return false; }
}

async function main() {
    await fs.mkdir(OUT_DIR, { recursive: true });

    const browser = await chromium.launch();
    const page = await browser.newPage({
        viewport: { width: 1440, height: 900 },
    });

    const seen = new Set();
    const queue = [BASE];

    const pages = [];
    while (queue.length) {
        const url = queue.shift();
        const norm = normalizeUrl(url);
        if (!norm || seen.has(norm) || !isHtmlPage(norm)) continue;
        seen.add(norm);

        console.log("Visiting:", norm);
        await page.goto(norm, { waitUntil: "networkidle" });

        // collect links
        const links = await page.$$eval("a[href]", as => as.map(a => a.href));
        for (const l of links) {
            const n = normalizeUrl(l);
            if (n && !seen.has(n) && isHtmlPage(n)) queue.push(n);
        }

        pages.push(norm);
    }

    // Print each page to PDF (full length)
    const pdfPaths = [];
    for (let i = 0; i < pages.length; i++) {
        const url = pages[i];
        console.log(`Printing (${i + 1}/${pages.length}):`, url);

        await page.goto(url, { waitUntil: "networkidle" });
        await page.emulateMedia({ media: "screen" });

        // Force all fade-in reveal animations to be fully visible instantly,
        // un-stick fixed headers/navs to prevent weird repeating/overlapping in the PDF,
        // and add break-inside prevention for cards.
        await page.addStyleTag({
            content: `
                /* Make reveal elements visible */
                .reveal, .reveal-on-scroll, [class*="reveal"] {
                    opacity: 1 !important;
                    transform: none !important;
                    visibility: visible !important;
                    transition: none !important;
                    animation: none !important;
                }
                /* Do not overlap the navbar over page content */
                .navbar, header, nav, .sticky {
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    width: 100% !important;
                    box-shadow: none !important;
                    background: transparent !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                }
                /* Avoid page breaks inside cards */
                .card, .preview-card, .preview-featured-card, .section, .project-card, blockquote, .skill-card {
                    break-inside: avoid !important;
                    page-break-inside: avoid !important;
                }
            `
        });

        // If your site has lazy-loading sections, scroll to force render
        await page.evaluate(async () => {
            await new Promise(resolve => {
                let total = 0;
                const step = 800;
                const timer = setInterval(() => {
                    window.scrollBy(0, step);
                    total += step;
                    if (total >= document.body.scrollHeight) {
                        clearInterval(timer);
                        window.scrollTo(0, 0);
                        resolve();
                    }
                }, 50);
            });
        });

        // Ensure everything settles before capturing the PDF
        await page.waitForTimeout(1000);

        const out = path.join(OUT_DIR, `${String(i + 1).padStart(3, "0")}.pdf`);
        await page.pdf({
            path: out,
            printBackground: true,
            preferCSSPageSize: false,
            format: "A4",
            margin: { top: "15mm", right: "15mm", bottom: "15mm", left: "15mm" },
        });
        pdfPaths.push(out);
    }

    await browser.close();

    // Merge into one PDF
    console.log("Merging into:", FINAL_PDF);
    const merged = await PDFDocument.create();
    for (const p of pdfPaths) {
        const bytes = await fs.readFile(p);
        const doc = await PDFDocument.load(bytes);
        const copied = await merged.copyPages(doc, doc.getPageIndices());
        copied.forEach(pg => merged.addPage(pg));
    }
    await fs.writeFile(FINAL_PDF, await merged.save());

    console.log("Done! Created:", FINAL_PDF);
    console.log("Pages included:");
    pages.forEach(p => console.log(" -", p));
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});