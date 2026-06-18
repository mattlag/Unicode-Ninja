/**
 * search.js — non-blocking, cancellable character-name search,
 * available both as a command-palette overlay and a shareable results page.
 */

/* global unicodeNamesListBMP, unicodeNamesListSMP */

import { blocks, rangeSize } from './data.js';
import { esc, nbsp, on, qs } from './dom.js';
import { navigate } from './router.js';
import { settings } from './state.js';
import { charList } from './tiles.js';

const CHUNK = 1500;
let activeToken = null;

function highlight(name, pos, len) {
	return `${nbsp(esc(name.substring(0, pos)))}<mark>${nbsp(esc(name.substring(pos, pos + len)))}</mark>${nbsp(esc(name.substring(pos + len)))}`;
}

/**
 * Search range / block names (synchronous — there are only a few hundred).
 * @returns {Array<{rid:string, name:string, html:string, size:number}>}
 */
export function searchRanges(term) {
	term = term.trim().toUpperCase();
	if (!term) return [];
	const out = [];
	for (const rid in blocks) {
		if (!rid.startsWith('r-')) continue;
		const name = blocks[rid].name;
		const pos = name.toUpperCase().indexOf(term);
		if (pos > -1) {
			out.push({ rid, name, html: highlight(name, pos, term.length), size: rangeSize(blocks[rid]) });
		}
	}
	// Shorter (more exact) names first, then alphabetical.
	out.sort((a, b) => a.name.length - b.name.length || a.name.localeCompare(b.name));
	return out;
}

/** A single range result row (keyboard-navigable, shares .char-row styling). */
function rangeRow(item) {
	const begin = blocks[item.rid].begin;
	const end = blocks[item.rid].end;
	const cp = `U+${begin.toString(16).toUpperCase().padStart(4, '0')}–U+${end.toString(16).toUpperCase().padStart(4, '0')}`;
	return `
		<div class="char-row range-row" data-action="show-range" data-range="${item.rid}">
			<span class="range-row__badge" aria-hidden="true">▦</span>
			<div class="char-row__name">${item.html}</div>
			<code class="char-row__cp">${cp}</code>
			<div class="char-row__range">${item.size} chars</div>
		</div>`;
}

/** Combined results markup: a Ranges section (if any) then a Characters section. */
function resultsHtml(ranges, chars, query) {
	let out = '';
	if (ranges.length) {
		out += `<div class="search-section"><div class="search-section__head">Ranges</div><div class="char-list">${ranges.map(rangeRow).join('')}</div></div>`;
	}
	out += `<div class="search-section"><div class="search-section__head">Characters</div>${charList(chars, ranges.length ? `No characters match “${query}”.` : `No characters or ranges match “${query}”.`)}</div>`;
	return out;
}

/**
 * Run a cancellable, chunked search over the BMP + SMP name lists.
 * @returns {Promise<Array<{char:string, html:string}>>}
 */
export async function runSearch(term, { max = settings.maxSearchResults, onChunk } = {}) {
	if (activeToken) activeToken.cancelled = true;
	const token = { cancelled: false };
	activeToken = token;

	const results = [];
	term = term.trim().toUpperCase();
	if (!term) return results;

	const lists = [unicodeNamesListBMP, unicodeNamesListSMP];
	let iterated = 0;

	for (const list of lists) {
		for (const point in list) {
			if (results.length >= max) return results;
			const name = list[point];
			const pos = name.indexOf(term);
			if (pos > -1) {
				results.push({ char: point, html: highlight(name, pos, term.length) });
				if (onChunk && results.length % 25 === 0) onChunk(results.slice());
			}
			if (++iterated % CHUNK === 0) {
				await Promise.resolve();
				if (token.cancelled) return results;
			}
		}
	}
	return results;
}

/* ------------------------------------------------------------------ *
 * Shareable results page (route #/search/<query>)
 * ------------------------------------------------------------------ */

export function renderSearchPage(query) {
	return `
	<div class="search-page">
		<header class="page-head">
			<h1>Search</h1>
			<div class="search-page__field">
				<span class="rail-search__icon" aria-hidden="true">⌕</span>
				<input id="searchPageInput" type="search" value="${esc(query || '')}" placeholder="Search characters and ranges…" autocomplete="off" data-action="search-page-input" aria-label="Search characters and ranges" />
			</div>
			<div class="search-page__status" id="searchPageStatus">${query ? 'Searching…' : 'Type to search by character or range name.'}</div>
		</header>
		<div id="searchPageResults">${query ? '' : ''}</div>
	</div>`;
}

export async function mountSearchPage(query) {
	const input = qs('#searchPageInput');
	if (input) {
		input.focus();
		// Place caret at end.
		const v = input.value;
		input.value = '';
		input.value = v;
	}
	if (!query) return;
	await searchInline(query);
}

/** Run a search and update the results page in place (no input focus changes). */
export async function searchInline(query) {
	if (!query || !query.trim()) {
		updateSearchPage([], [], query, false);
		const status = qs('#searchPageStatus');
		if (status) status.textContent = 'Type to search by character or range name.';
		return;
	}
	const ranges = searchRanges(query);
	const results = await runSearch(query, {
		onChunk: (partial) => updateSearchPage(ranges, partial, query, true),
	});
	updateSearchPage(ranges, results, query, false);
}

function updateSearchPage(ranges, results, query, partial) {
	const status = qs('#searchPageStatus');
	const container = qs('#searchPageResults');
	if (!container) return;
	const maxed = results.length >= parseInt(settings.maxSearchResults);
	if (status) {
		if (partial) {
			status.textContent = `Searching… ${results.length} character${results.length === 1 ? '' : 's'} so far`;
		} else {
			const rangePart = ranges.length ? `${ranges.length} range${ranges.length === 1 ? '' : 's'} · ` : '';
			status.textContent = `${rangePart}${maxed ? 'first ' : ''}${results.length} character${results.length === 1 ? '' : 's'} for “${query}”`;
		}
	}
	container.innerHTML = resultsHtml(ranges, results, query);
}

/* ------------------------------------------------------------------ *
 * Command-palette overlay
 * ------------------------------------------------------------------ */

let overlayEl = null;
let overlayCleanup = [];
let activeIndex = -1;
let overlayResults = [];

export function isSearchOverlayOpen() {
	return !!overlayEl;
}

export function openSearchOverlay(initial = '') {
	if (overlayEl) {
		qs('#paletteInput', overlayEl).focus();
		return;
	}
	overlayEl = document.createElement('div');
	overlayEl.className = 'palette';
	overlayEl.innerHTML = `
		<div class="palette__backdrop" data-palette-close></div>
		<div class="palette__panel" role="dialog" aria-modal="true" aria-label="Search characters">
			<div class="palette__field">
				<span class="palette__icon" aria-hidden="true">⌕</span>
				<input id="paletteInput" type="search" placeholder="Search characters and ranges…" autocomplete="off" value="${esc(initial)}" />
				<kbd class="palette__hint">Esc</kbd>
			</div>
			<div class="palette__status" id="paletteStatus">Type to search — ↑↓ to move, ↵ for all results.</div>
			<div class="palette__results" id="paletteResults"></div>
		</div>`;
	document.body.appendChild(overlayEl);
	document.body.classList.add('no-scroll');

	const input = qs('#paletteInput', overlayEl);
	input.focus();

	let debounce;
	overlayCleanup.push(
		on(input, 'input', () => {
			clearTimeout(debounce);
			debounce = setTimeout(() => doOverlaySearch(input.value), 120);
		}),
		on(input, 'keydown', onOverlayKeydown),
		on(overlayEl, 'click', (e) => {
			if (e.target.closest('[data-palette-close]')) closeSearchOverlay();
			const rangeRowEl = e.target.closest('.range-row[data-range]');
			if (rangeRowEl) {
				selectRange(rangeRowEl.dataset.range);
				return;
			}
			const row = e.target.closest('.char-row[data-char]');
			if (row) {
				selectChar(row.dataset.char);
			}
		}),
	);

	if (initial.trim()) doOverlaySearch(initial);
}

export function closeSearchOverlay() {
	if (!overlayEl) return;
	overlayCleanup.forEach((fn) => fn());
	overlayCleanup = [];
	overlayEl.remove();
	overlayEl = null;
	activeIndex = -1;
	overlayResults = [];
	document.body.classList.remove('no-scroll');
}

async function doOverlaySearch(term) {
	const status = qs('#paletteStatus', overlayEl);
	const list = qs('#paletteResults', overlayEl);
	activeIndex = -1;
	if (!term.trim()) {
		overlayResults = [];
		status.textContent = 'Type to search — ↑↓ to move, ↵ for all results.';
		list.innerHTML = '';
		return;
	}
	status.textContent = 'Searching…';
	const ranges = searchRanges(term);
	// Cap overlay character results for snappiness.
	const results = await runSearch(term, { max: Math.min(200, parseInt(settings.maxSearchResults)) });
	if (!overlayEl) return;
	overlayResults = results;
	const total = ranges.length + results.length;
	const rangePart = ranges.length ? `${ranges.length} range${ranges.length === 1 ? '' : 's'} · ` : '';
	status.innerHTML = total ? `${rangePart}${results.length} character${results.length === 1 ? '' : 's'} — <button type="button" class="link-btn" data-palette-all>See all in a page →</button>` : `No matches — <button type="button" class="link-btn" data-palette-all>Open results page →</button>`;
	list.innerHTML = resultsHtml(ranges, results, term);
	const allBtn = qs('[data-palette-all]', overlayEl);
	if (allBtn) on(allBtn, 'click', goToResultsPage);
}

function goToResultsPage() {
	if (!overlayEl) return;
	const q = qs('#paletteInput', overlayEl).value;
	if (!q.trim()) return;
	closeSearchOverlay();
	navigate('search', { query: q });
}

function onOverlayKeydown(e) {
	if (e.key === 'Escape') {
		e.preventDefault();
		closeSearchOverlay();
	} else if (e.key === 'ArrowDown') {
		e.preventDefault();
		moveActive(1);
	} else if (e.key === 'ArrowUp') {
		e.preventDefault();
		moveActive(-1);
	} else if (e.key === 'Enter') {
		e.preventDefault();
		// If a row is explicitly highlighted, open it; otherwise show all results.
		const active = overlayEl.querySelector('.char-row.is-active');
		if (active) {
			openRow(active);
		} else {
			goToResultsPage();
		}
	}
}

function moveActive(delta) {
	const rows = Array.from(overlayEl.querySelectorAll('.char-row'));
	if (!rows.length) return;
	rows.forEach((r) => r.classList.remove('is-active'));
	activeIndex = (activeIndex + delta + rows.length) % rows.length;
	const row = rows[activeIndex];
	row.classList.add('is-active');
	row.scrollIntoView({ block: 'nearest' });
}

/** Open whichever kind of row (range or character) is given. */
function openRow(row) {
	if (row.dataset.range) {
		selectRange(row.dataset.range);
	} else if (row.dataset.char) {
		selectChar(row.dataset.char);
	}
}

function selectChar(char) {
	closeSearchOverlay();
	navigate('char', { hex: char.replace(/^0x/i, '') });
}

function selectRange(rid) {
	closeSearchOverlay();
	navigate('explore', { rid });
}
