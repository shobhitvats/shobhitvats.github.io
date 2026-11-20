/* ==========================================================================
   COMMAND PALETTE (Cmd+K / Ctrl+K) — Self-Contained, Zero CDN Dependency
   Resolves paths cleanly from both root pages and /projects/* subpages.
   ========================================================================== */

(() => {
  class CommandPalette {
    constructor(customData) {
      const is404 = document.documentElement.hasAttribute('data-is-404');
      const inProjects = window.location.pathname.includes('/projects/');
      const prefix = is404 ? '/' : (inProjects ? '../' : '');

      this.data = customData || [
        { title: 'Home', type: 'Page', url: `${prefix}index.html`, keywords: 'landing hero overview' },
        { title: 'About & Experience', type: 'Page', url: `${prefix}about.html`, keywords: 'bio skills research timeline education' },
        { title: 'Projects Catalog', type: 'Page', url: `${prefix}projects/index.html`, keywords: 'software case studies' },
        { title: 'Beyond the Lab', type: 'Page', url: `${prefix}beyond.html`, keywords: 'music flute guitar art gallery' },
        { title: 'Contact & Endorsements', type: 'Page', url: `${prefix}contact.html`, keywords: 'email linkedin github resume' },
        { title: 'KB V&V & Comparator Analysis Automation (Velsera)', type: 'Project', url: `${prefix}projects/velsera.html`, keywords: 'velsera clinical genomics comparator gold set uat validation dr gargi nanda' },
        { title: 'Scientific Operations & Research Infrastructure (Nucleovir)', type: 'Project', url: `${prefix}projects/sciops.html`, keywords: 'nucleovir therapeutics nas samba project management data organisation documentation' },
        { title: 'STEM LLM Evaluation, RLHF & Reasoning Audits (Outlier)', type: 'Project', url: `${prefix}projects/outlier.html`, keywords: 'outlier rlhf llm evaluator blackbeard ather springer gem hallucination qa' },
        { title: 'Computational Structural Biology & NCI Research (IISER Pune · Sai Lab)', type: 'Project', url: `${prefix}projects/sai-lab.html`, keywords: 'iiser pune sai lab saikrishnan kayarat csd pdb alphafold parambrahma clinvar nmr pnictogen chalcogen tetrel' },
        { title: 'Nucleovir Therapeutics — Scientific Operations (Founder\'s Office)', type: 'Experience', url: `${prefix}about.html#experience`, keywords: 'nucleovir therapeutics scientific operations sci-ops founder office iiser pune' },
        { title: 'Velsera — Automation Developer (KB V&V & Dr. Gargi Nanda LOR)', type: 'Experience', url: `${prefix}about.html#recommendation`, keywords: 'velsera comparator analysis uat dr gargi nanda' },
        { title: 'Outlier — Data Annotator & LLM Evaluator', type: 'Experience', url: `${prefix}projects/outlier.html`, keywords: 'outlier rlhf blackbeard ather springer hallucination' },
        { title: 'IISER Pune (Sai Lab) — Computational Structural Biology', type: 'Research', url: `${prefix}projects/sai-lab.html`, keywords: 'pnictogen tetrel chalcogen cxxc ramachandran param brahma' },
        { title: 'MolBridge: NonCovalent Atlas (Live App)', type: 'Project', url: `${prefix}projects/molbridge.html`, keywords: 'protein noncovalent streamlit fastapi numba pdb' },
        { title: 'ΔΔG Protein Stability Calculator', type: 'Project', url: `${prefix}projects/ddg.html`, keywords: 'amber cuda gpu mutation force field' },
        { title: 'OptiScan Static Analysis Engine', type: 'Project', url: `${prefix}projects/optiscan.html`, keywords: 'libcst python performance zero false positive' },
        { title: 'Aegis Intelligence Platform', type: 'Project', url: `${prefix}projects/aegis.html`, keywords: 'playwright mv3 daas scraping sqlite' },
        { title: 'Project Clarity (Code Knowledge Graphs)', type: 'Project', url: `${prefix}projects/clarity.html`, keywords: 'ast pyvis vis.js dependency graph' },
        { title: 'HEPBlenderFusion (Geant4 ↔ Blender)', type: 'Project', url: `${prefix}projects/hep.html`, keywords: 'cpp grpc protobuf geant4 blender physics' },
        { title: 'Computational Astrology Engine', type: 'Project', url: `${prefix}projects/computational-astrology.html`, keywords: 'swiss ephemeris recursive modeling' },
        { title: 'Download Computational Biology & Sci-Ops CV (PDF)', type: 'Document', url: `${prefix}assets/resume.pdf`, keywords: 'cv resume download pdf' },
        { title: 'Download Structural Biology Research CV (PDF)', type: 'Document', url: `${prefix}assets/cv-research.pdf`, keywords: 'cv latchbio structural biology pdf' },
        { title: 'Download Velsera Recommendation Letter (PDF)', type: 'Document', url: `${prefix}assets/recommendation.pdf`, keywords: 'gargi nanda lor recommendation pdf' }
      ];

      this.activeIndex = 0;
      this.filtered = this.data.slice(0, 7);
      this.initDOM();
      this.attachListeners();
    }

    initDOM() {
      if (document.getElementById('cmd-palette-overlay')) return;

      const style = document.createElement('style');
      style.textContent = `
        #cmd-palette-overlay {
          position: fixed;
          inset: 0;
          background: rgba(11, 15, 23, 0.65);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: none;
          justify-content: center;
          align-items: flex-start;
          padding: 12vh 1rem 1rem;
          z-index: 9999;
        }
        #cmd-palette-overlay.open {
          display: flex;
        }
        .cmd-palette-modal {
          width: 100%;
          max-width: 620px;
          background: var(--surface-card, #fff);
          color: var(--text-primary, #1f140b);
          border: 1px solid var(--border, #d4c5ae);
          border-radius: var(--radius-md, 12px);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }
        .cmd-palette-head {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0 1rem;
          border-bottom: 1px solid var(--border, #d4c5ae);
        }
        #cmd-palette-input {
          width: 100%;
          padding: 1rem 0.25rem;
          border: none;
          background: transparent;
          color: var(--text-primary, #1f140b);
          font-family: var(--font-sans, sans-serif);
          font-size: 1rem;
        }
        #cmd-palette-input:focus {
          outline: none;
        }
        .cmd-close-btn {
          min-width: 44px;
          min-height: 44px;
          border: none;
          background: transparent;
          color: var(--text-muted, #635040);
          font-size: 1.25rem;
          cursor: pointer;
        }
        #cmd-palette-results {
          max-height: 360px;
          overflow-y: auto;
          overscroll-behavior: contain;
        }
        .cmd-result-item {
          width: 100%;
          min-height: 48px;
          padding: 0.75rem 1.15rem;
          border: none;
          border-bottom: 1px solid var(--border-light, #e5dac6);
          background: transparent;
          color: inherit;
          text-align: left;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          font-family: var(--font-sans, sans-serif);
        }
        .cmd-result-item:hover,
        .cmd-result-item.is-selected {
          background: var(--accent-light, #f6e6d7);
        }
        .cmd-result-title {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-primary, #1f140b);
        }
        .cmd-result-type {
          font-size: 0.72rem;
          font-family: var(--font-mono, monospace);
          color: var(--accent, #9a4d1c);
          text-transform: uppercase;
          flex-shrink: 0;
        }
        .cmd-empty {
          padding: 1.5rem;
          text-align: center;
          color: var(--text-muted, #635040);
          font-size: 0.9rem;
        }
      `;
      document.head.appendChild(style);

      const overlay = document.createElement('div');
      overlay.id = 'cmd-palette-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Quick site search');
      overlay.innerHTML = `
        <div class="cmd-palette-modal">
          <div class="cmd-palette-head">
            <label for="cmd-palette-input" class="sr-only">Search pages, Nucleovir, Velsera, Outlier, projects, or CV</label>
            <input type="text" id="cmd-palette-input" placeholder="Search Nucleovir, MolBridge, Velsera, skills, CV…" autocomplete="off" spellcheck="false" />
            <button type="button" class="cmd-close-btn" id="cmd-palette-close" aria-label="Close search">&times;</button>
          </div>
          <div id="cmd-palette-results" role="listbox"></div>
        </div>
      `;
      document.body.appendChild(overlay);

      this.overlay = overlay;
      this.input = document.getElementById('cmd-palette-input');
      this.closeBtn = document.getElementById('cmd-palette-close');
      this.resultsContainer = document.getElementById('cmd-palette-results');
    }

    attachListeners() {
      if (!this.overlay) return;

      document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          this.toggle();
          return;
        }
        if (!this.isOpen()) return;
        if (e.key === 'Escape') {
          e.preventDefault();
          this.close();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.moveSelection(1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.moveSelection(-1);
        } else if (e.key === 'Enter' && this.filtered[this.activeIndex]) {
          e.preventDefault();
          window.location.href = this.filtered[this.activeIndex].url;
          this.close();
        }
      });

      document.addEventListener('click', (e) => {
        if (e.target.closest('[data-cmd-open]')) {
          e.preventDefault();
          this.open();
        }
      });

      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) this.close();
      });

      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }

      this.input.addEventListener('input', (e) => {
        this.search(e.target.value);
      });
    }

    isOpen() {
      return this.overlay && this.overlay.classList.contains('open');
    }

    toggle() {
      if (this.isOpen()) this.close();
      else this.open();
    }

    open() {
      this.lastFocus = document.activeElement;
      this.overlay.classList.add('open');
      this.input.value = '';
      this.search('');
      setTimeout(() => this.input.focus(), 20);
    }

    close() {
      this.overlay.classList.remove('open');
      if (this.lastFocus && document.contains(this.lastFocus)) {
        this.lastFocus.focus();
      }
    }

    moveSelection(delta) {
      if (!this.filtered.length) return;
      this.activeIndex = (this.activeIndex + delta + this.filtered.length) % this.filtered.length;
      this.renderResults();
    }

    search(query) {
      const q = (query || '').trim().toLowerCase();
      if (!q) {
        this.filtered = this.data.slice(0, 8);
      } else {
        const terms = q.split(/\s+/);
        this.filtered = this.data.filter((item) => {
          const hay = `${item.title} ${item.type} ${item.keywords || ''}`.toLowerCase();
          return terms.every((t) => hay.includes(t));
        });
      }
      this.activeIndex = 0;
      this.renderResults();
    }

    renderResults() {
      if (!this.filtered.length) {
        this.resultsContainer.innerHTML = '<div class="cmd-empty">No matching pages, projects, or credentials found.</div>';
        return;
      }

      this.resultsContainer.innerHTML = '';
      this.filtered.forEach((item, idx) => {
        const link = document.createElement('a');
        link.href = item.url;
        link.className = `cmd-result-item${idx === this.activeIndex ? ' is-selected' : ''}`;
        link.setAttribute('role', 'option');
        link.setAttribute('aria-selected', String(idx === this.activeIndex));
        link.addEventListener('click', () => this.close());

        const titleSpan = document.createElement('span');
        titleSpan.className = 'cmd-result-title';
        titleSpan.textContent = item.title;

        const typeSpan = document.createElement('span');
        typeSpan.className = 'cmd-result-type';
        typeSpan.textContent = item.type;

        link.appendChild(titleSpan);
        link.appendChild(typeSpan);
        this.resultsContainer.appendChild(link);
      });
    }
  }

  window.CommandPalette = CommandPalette;
  document.addEventListener('DOMContentLoaded', () => {
    const isMac = /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent || '');
    document.querySelectorAll('.kbd-hint').forEach((el) => {
      el.textContent = isMac ? '⌘ K' : 'Ctrl K';
    });
    if (!window.cmdPalette) {
      window.cmdPalette = new CommandPalette();
    }
  });
})();
