# Shobhit Vats Sharma — Portfolio & Case Studies

**Live Site:** [https://shobhitvats.github.io/](https://shobhitvats.github.io/) · **GitHub:** [@shobhitvats](https://github.com/shobhitvats) · **LinkedIn:** [Shobhit Vats Sharma](https://linkedin.com/in/shobhit-vats-s-204427132)

> **Researcher & Systems Builder — Bridging Science, Computation, and Execution.**  
> Final-year BS-MS researcher at IISER Pune working across structural bioinformatics, scientific software engineering, clinical genomics verification, LLM evaluation, and biotech research operations.

---

## Featured Case Studies & Engineering Platforms

| Work | Domain | Highlights | Live Case Study / Source |
| :--- | :--- | :--- | :--- |
| **MolBridge: NonCovalent Atlas** | Structural Bioinformatics | Detects 15+ noncovalent interaction families across PDB structures; Streamlit + FastAPI + Numba/Rust kernels achieving 60% HPC runtime reduction | [Case Study](https://shobhitvats.github.io/projects/molbridge.html) · [Live App](https://molbridge.streamlit.app) · [GitHub Repo](https://github.com/shobhitvats/MolBridge-NonCovalent-Atlas) |
| **Velsera — KB V&V & Comparator Automation** | Clinical Genomics QA | Standalone Python Knowledge Base Verification & Validation comparator automating Gold Set checks across 3+ UAT rounds with 100% team adoption | [Case Study](https://shobhitvats.github.io/projects/velsera.html) |
| **Nucleovir Therapeutics — Scientific Operations** | Biotech Sci-Ops (Founder's Office) | Structured R&D project tracking, digital record governance, SOP documentation, and internal NAS/Samba storage infrastructure | [Case Study](https://shobhitvats.github.io/projects/sciops.html) |
| **Outlier — STEM LLM Evaluation & RLHF** | AI Evaluation & Alignment | Seven-month LLM evaluation across Projects Blackbeard, Ather, and Springer — chain-of-thought audits, hallucination detection, RLHF preference critiques, and GEM prompting | [Case Study](https://shobhitvats.github.io/projects/outlier.html) |
| **IISER Pune (Sai Lab) — Structural Biology & NCI Research** | Computational Biophysics Thesis | Quantified σ-hole NCIs across >1.2M CSD entries, quality-gated PDB loops, kinematic null models, ClinVar variants, and 214M AlphaFold v4 models on ParamBrahma HPC (60% speedup) | [Case Study](https://shobhitvats.github.io/projects/sai-lab.html) · [PDB Scripts](https://github.com/shobhitvats/PDB_Python_codes) |
| **ΔΔG Protein Stability Calculator** | Molecular Mechanics / GPU | AMBER ff14SB + analytical LCPO SASA calculator with 4-stage crystallographic strain relaxation & CUDA/KD-Tree kernels | [Case Study](https://shobhitvats.github.io/projects/ddg.html) · [Related Repo (Mutalyze)](https://github.com/shobhitvats/Mutalyze) |
| **OptiScan** | Static Analysis | Zero-false-positive Python AST/LibCST scanner detecting performance anti-patterns in automated refactoring pipelines | [Case Study](https://shobhitvats.github.io/projects/optiscan.html) |
| **Aegis Intelligence Platform** | Automation / DaaS | Stealth Playwright workflows, SQLite persistence, analytics UI, and Chrome Manifest V3 extension | [Case Study](https://shobhitvats.github.io/projects/aegis.html) |
| **Project Clarity** | Code Knowledge Graphs | AST repository parser rendering force-directed module dependency graphs | [Case Study](https://shobhitvats.github.io/projects/clarity.html) |
| **HEPBlenderFusion** | Scientific Visualization | Real-time bidirectional C++ Geant4 ↔ Blender bridge over gRPC & Protocol Buffers | [Case Study](https://shobhitvats.github.io/projects/hep.html) |

---

## Downloadable CVs

- [**Computational Biology, Scientific Systems & Sci-Ops CV (PDF)**](https://shobhitvats.github.io/assets/resume.pdf) — Operations, Chief of Staff / Founder's Office, clinical genomics automation, and computational systems.
- [**Structural & Computational Biology Research CV (PDF)**](https://shobhitvats.github.io/assets/cv-research.pdf) — Macromolecular noncovalent interactions, ParamBrahma HPC benchmarking, NMR, and `MolBridge`.

---

## Site Architecture & Quality Standards

- **Zero-Framework Static Stack:** Vanilla semantic HTML5, modern CSS3 design tokens (light editorial parchment `#FAF6F0` and high-contrast dark slate), and progressive ES6+ JavaScript with zero bundler or CDN UI dependencies.
- **Built-in Discovery & Navigation:** Self-contained `Ctrl K` / `⌘ K` Command Palette ([`js/features/search.js`](js/features/search.js)), automatic legacy `/portfolio/*` redirect inside [`404.html`](404.html), `sitemap.xml`, `robots.txt`, and `1200×630` OpenGraph/Twitter Card social previews.
- **Accessibility & Performance:** WCAG 2.1 AA+ contrast, `>= 44×44px` touch targets across `300px–1440px` viewports, keyboard-accessible native `<dialog>` modals, and WebP image optimization.

---

## Local Preview & Verification

Serve locally with any static HTTP server:

```bash
python3 -m http.server 8080 --bind 127.0.0.1
```

Run the 4-tier Playwright & Lighthouse verification suite (requires Chromium & Node.js):

```bash
npm test
```

The test harness ([`tests/run_e2e_tests.sh`](tests/run_e2e_tests.sh)) validates:
1. **Tier 1 (`test_features.mjs`):** Content integrity, SEO/OG metadata, NDA hygiene, and search indexing across all 16 content HTML pages.
2. **Tier 2 (`test_mobile_375px.mjs`):** Zero horizontal overflow and `>= 44×44px` touch targets across `300px`, `320px`, `375px`, `414px`, `667px`, and `768px` viewports.
3. **Tier 3 (`test_interactions.mjs`):** Theme persistence, mobile drawer, recommendation `<dialog>` modals, clipboard email copy, and Command Palette keyboard flows.
4. **Tier 4 (`test_lighthouse.mjs`):** Automated Chromium user journeys and Desktop Lighthouse thresholds (`Performance >= 90`, `Accessibility = 100`, `Best Practices = 100`).
