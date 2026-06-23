/**
 * landing.js — minimal, typography-forward landing page (route #/).
 */

import { tile } from './tiles.js';

const FEATURED = ['0x0041', '0x00E9', '0x03A9', '0x0635', '0x2603', '0x266B', '0x2766', '0x2318', '0x2042', '0x2702', '0x221E', '0x00A7'];

/* ------------------------------------------------------------------ *
 * Wordmark dot animation — the "." in unicode.ninja cycles through
 * visually interesting glyphs that each read like a period.
 *
 * TO EDIT: just add or remove characters in the DOT_GLYPHS array below.
 *   - Put any single character in quotes, separated by commas.
 *   - The FIRST entry is what shows on page load (keep it period-like).
 *   - Pick glyphs of roughly equal visual size for a smooth cycle.
 *   - Any length works (even 1 glyph, or none to disable cycling).
 *   - Change DOT_CYCLE_MS to speed up / slow down the swap interval.
 * ------------------------------------------------------------------ */
const DOT_GLYPHS = ['⏺', '❂', '✺', '❉', '❋', '✦', '❄', '✵', '⊛', '✬', '☸', '⚙', '❖', '⬢', '⏣', '⍟',  '❀', '✸'];

const DOT_CYCLE_MS = 2000; // time each glyph is shown
const DOT_FADE_MS = 180; // fade-out duration before swapping the glyph

let dotTimer = null;

export function mountLanding() {
	if (dotTimer) {
		clearInterval(dotTimer);
		dotTimer = null;
	}
	const dot = document.querySelector('.landing__dot');
	if (!dot || DOT_GLYPHS.length < 2) return;
	if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
	let i = 0;
	dotTimer = setInterval(() => {
		if (!dot.isConnected) {
			clearInterval(dotTimer);
			dotTimer = null;
			return;
		}
		i = (i + 1) % DOT_GLYPHS.length;
		dot.classList.add('is-swapping');
		setTimeout(() => {
			dot.textContent = DOT_GLYPHS[i];
			dot.classList.remove('is-swapping');
		}, DOT_FADE_MS);
	}, DOT_CYCLE_MS);
}

export function renderLanding() {
	return `
	<div class="landing">
		<section class="landing__hero">
			<h1 class="landing__title">unicode<span class="landing__dot">${DOT_GLYPHS[0] || '.'}</span>ninja</h1>
			<p class="landing__tagline">Browse every Unicode range, preview characters in your own typeface, and grab the exact glyph, entity, or code point you need.</p>
			<div class="landing__actions">
				<button type="button" class="btn btn--primary btn--lg" data-action="nav" data-route="explore">Explore ranges</button>
				<button type="button" class="btn btn--lg" data-action="open-search">Search characters</button>
			</div>
		</section>

		<section class="landing__glyphs" aria-label="A few characters to start with">
			${FEATURED.map((c) => `<div class="landing__glyph">${tile(c, 'lg')}</div>`).join('')}
		</section>

		<section class="landing__features">
			<div class="feature">
				<div class="feature__icon" aria-hidden="true">▦</div>
				<h3>Every range, organized</h3>
				<p>Navigate all four Unicode planes — grouped by script and symbol, or sorted by code point.</p>
			</div>
			<div class="feature">
				<div class="feature__icon" aria-hidden="true">ℱ</div>
				<h3>Preview your font</h3>
				<p>Drop in a <code>.otf</code>, <code>.ttf</code>, or <code>.woff</code> and see real glyphs across thousands of characters.</p>
			</div>
			<div class="feature">
				<div class="feature__icon" aria-hidden="true">⧉</div>
				<h3>Copy &amp; share</h3>
				<p>One click copies the character or its HTML entity. Every character and range has a shareable link.</p>
			</div>
		</section>

		<footer class="landing__foot">
			<span>For designers &amp; curious humans.</span>
			<button type="button" class="link-btn" data-action="nav" data-route="settings">About &amp; settings</button>
		</footer>
	</div>`;
}
