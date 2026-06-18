/**
 * explorer.js — the ranges + members view (the heart of the app).
 *
 * Left rail: a filterable navigator of every Unicode block (grouped or sorted).
 * Right stack: the selected ranges rendered as character grids (grid or flow).
 */

/* global organizedScriptsV2, organizedSymbolsV2 */

import { blocks, decToHex, getRange, rangeSize } from './data.js';
import { esc, nbsp } from './dom.js';
import { app, isRangeSelected, settings } from './state.js';
import { tile } from './tiles.js';

let railFilter = '';

export function getRailFilter() {
	return railFilter;
}
export function setRailFilter(value) {
	railFilter = value;
}

/* ------------------------------------------------------------------ *
 * Top-level layout
 * ------------------------------------------------------------------ */

export function renderExplorer() {
	return `
	<div class="explorer" data-grid="${settings.gridMode}">
		<div class="rail-backdrop" data-action="close-rail"></div>
		<aside class="range-rail" id="rangeRail">
			${renderRail()}
		</aside>
		<section class="range-stack" id="rangeStack">
			${renderStackSection()}
		</section>
	</div>`;
}

/** Inner markup of the navigator aside (head + list + foot). */
export function renderRail() {
	return `${renderRailHead()}<div class="rail-list" id="railList">${renderRailList()}</div>${renderRailFoot()}`;
}

/** Toolbar + cards container (re-rendered together on layout changes). */
export function renderStackSection() {
	return `${renderToolbar()}<div class="stack-cards" id="stackCards">${renderStack()}</div>`;
}

function renderRailHead() {
	const grouped = settings.chooserTab === 'Grouped';
	return `
	<div class="rail-head">
		<div class="rail-search">
			<span class="rail-search__icon" aria-hidden="true">⌕</span>
			<input id="rangeFilter" type="search" placeholder="Filter ranges…" autocomplete="off"
				value="${esc(railFilter)}" data-action="filter-ranges" aria-label="Filter ranges" />
		</div>
		<div class="seg" role="tablist" aria-label="Range list mode">
			<button type="button" class="seg__btn${grouped ? ' is-active' : ''}" data-action="chooser-tab" data-tab="Grouped" role="tab" aria-selected="${grouped}">Grouped</button>
			<button type="button" class="seg__btn${grouped ? '' : ' is-active'}" data-action="chooser-tab" data-tab="Sorted" role="tab" aria-selected="${!grouped}">Sorted</button>
		</div>
	</div>`;
}

export function renderRailFoot() {
	const n = settings.selectedRanges.length;
	return `
	<div class="rail-foot" id="railFoot">
		<span class="rail-foot__count">${n} range${n === 1 ? '' : 's'} shown</span>
		${n ? `<button type="button" class="link-btn" data-action="clear-ranges">Clear all</button>` : ''}
	</div>`;
}

/* ------------------------------------------------------------------ *
 * Rail list (navigator)
 * ------------------------------------------------------------------ */

export function renderRailList() {
	if (railFilter.trim()) return renderFilteredList(railFilter.trim());
	return settings.chooserTab === 'Grouped' ? renderGroupedList() : renderSortedList();
}

function renderFilteredList(term) {
	const t = term.toUpperCase();
	let rows = '';
	let count = 0;
	for (const rid in blocks) {
		if (blocks[rid].name.toUpperCase().includes(t)) {
			rows += rangeRow(rid, blocks[rid].name);
			count++;
		}
	}
	if (!count) return `<div class="empty-state"><p>No ranges match “${esc(term)}”.</p></div>`;
	return rows;
}

function renderSortedList() {
	let con = `<h2 class="rail-plane">Basic Multilingual Plane</h2>`;
	for (const rid in blocks) {
		if (blocks[rid].begin === 0x10000) con += `<h2 class="rail-plane">Supplementary Multilingual Plane</h2>`;
		if (blocks[rid].begin === 0x20000) con += `<h2 class="rail-plane">Supplementary Ideographic Plane</h2>`;
		if (blocks[rid].begin === 0x30000) con += `<h2 class="rail-plane">Tertiary Ideographic Plane</h2>`;
		con += rangeRow(rid, blocks[rid].name);
	}
	return con;
}

function renderGroupedList() {
	function renderArea(area) {
		let con = '';
		for (const section in area) {
			con += `<h3 class="rail-section">${esc(section)}</h3>`;
			for (const group in area[section]) {
				const entry = area[section][group];
				if (typeof entry === 'string') {
					con += rangeRow(entry, group);
				} else {
					const childIds = Object.values(entry);
					con += groupRow(childIds, group);
					for (const block in entry) {
						con += rangeRow(entry[block], block, true);
					}
				}
			}
		}
		return con;
	}

	return `
		<h2 class="rail-plane">Scripts</h2>
		${renderArea(organizedScriptsV2)}
		<h2 class="rail-plane">Symbols</h2>
		${renderArea(organizedSymbolsV2)}`;
}

const NOTE_NONSTANDARD = '<span class="rail-note" title="Default fonts may not display this range">⊘</span>';
const NOTE_NOGLYPHS = '<span class="rail-note" title="This range has no visible glyphs">⊝</span>';
const NOTE_SUBRANGE = '<span class="rail-note" title="A sub-group of a larger Unicode range; the parent range is shown">⬙</span>';

function shorten(name) {
	return name
		.replace(/Extended/gi, 'Ext.')
		.replace(/Miscellaneous/gi, 'Misc.')
		.replace(/Mathematical/gi, 'Math.')
		.replace(/Punctuation/gi, 'Punct.')
		.replace(/Supplemental/gi, 'Supp.')
		.replace(/Supplement/gi, 'Supp.')
		.replace(/Unified/gi, 'Uni.')
		.replace(/Characters/gi, 'Chars.')
		.replace(/Combining/gi, 'Combo.')
		.replace(/Canadian/gi, 'Can.');
}

function rangeRow(rid, name, indent = false) {
	const range = getRange(rid);
	const selected = isRangeSelected(rid);
	const notes = `${range && range.nonstandard ? NOTE_NONSTANDARD : ''}${range && range.noGlyphs ? NOTE_NOGLYPHS : ''}${rid.startsWith('s-') ? NOTE_SUBRANGE : ''}`;
	return `
	<button type="button" class="range-item${selected ? ' is-selected' : ''}${indent ? ' is-indented' : ''}"
		data-action="toggle-range" data-range="${rid}" data-scroll="${rid}" title="${esc(name)}" aria-pressed="${selected}">
		<span class="range-item__check" aria-hidden="true"></span>
		<span class="range-item__name">${nbsp(esc(shorten(name)))}</span>
		<span class="range-item__notes">${notes}</span>
		<span class="range-item__count">${range ? rangeSize(range) : ''}</span>
		<code class="range-item__hex">${rid.substring(2)}</code>
	</button>`;
}

function groupRow(childIds, name) {
	const joined = childIds.join('_');
	const allSelected = childIds.every((id) => isRangeSelected(id));
	const someSelected = childIds.some((id) => isRangeSelected(id));
	return `
	<button type="button" class="range-group${allSelected ? ' is-selected' : someSelected ? ' is-partial' : ''}"
		data-action="toggle-range" data-range="${joined}" title="${esc(name)}" aria-pressed="${allSelected}">
		<span class="range-item__check" aria-hidden="true"></span>
		<span class="range-group__name">${nbsp(esc(name))}</span>
	</button>`;
}

/* ------------------------------------------------------------------ *
 * Toolbar
 * ------------------------------------------------------------------ */

function renderToolbar() {
	const grid = settings.gridMode === 'grid';
	return `
	<div class="explorer-toolbar">
		<button type="button" class="btn btn--ghost rail-toggle" data-action="open-rail" aria-label="Show range navigator">
			<span aria-hidden="true">☰</span> Ranges
		</button>
		<div class="toolbar-spacer"></div>
		<div class="seg" role="group" aria-label="Layout mode">
			<button type="button" class="seg__btn${grid ? ' is-active' : ''}" data-action="grid-mode" data-mode="grid" title="Rigid hex grid (16 wide)">Grid</button>
			<button type="button" class="seg__btn${grid ? '' : ' is-active'}" data-action="grid-mode" data-mode="flow" title="Flowing layout — fills the width">Flow</button>
		</div>
		<div class="seg" role="group" aria-label="Tile size">
			<button type="button" class="seg__btn${settings.tileSize === 'sm' ? ' is-active' : ''}" data-action="tile-size" data-size="sm" title="Small tiles">S</button>
			<button type="button" class="seg__btn${settings.tileSize === 'md' ? ' is-active' : ''}" data-action="tile-size" data-size="md" title="Medium tiles">M</button>
			<button type="button" class="seg__btn${settings.tileSize === 'lg' ? ' is-active' : ''}" data-action="tile-size" data-size="lg" title="Large tiles">L</button>
		</div>
	</div>`;
}

/* ------------------------------------------------------------------ *
 * Range stack (right side)
 * ------------------------------------------------------------------ */

export function renderStack() {
	if (settings.selectedRanges.length === 0) {
		return `
		<div class="empty-state empty-state--lg">
			<div class="empty-state__glyph">✶</div>
			<h2>Pick a range to explore</h2>
			<p>Choose one or more Unicode ranges from the navigator to view their characters here.</p>
			<button type="button" class="btn btn--primary open-rail-cta" data-action="open-rail">Browse ranges</button>
		</div>`;
	}
	return settings.selectedRanges.map(getCardCached).join('');
}

function getCardCached(rid) {
	const key = `${rid}|${settings.gridMode}|${settings.tileSize}`;
	if (!app.rangeCache[key]) app.rangeCache[key] = renderCard(rid);
	return app.rangeCache[key];
}

function renderCard(rid) {
	const range = getRange(rid);
	if (!range) return '';

	let beginBase = decToHex(range.begin).substring(2);
	if (beginBase === '0020') beginBase = '0000';
	const wikiName = range.name.replace(/ /g, '_');
	const wikiHref = `https://www.wikipedia.org/wiki/${wikiName}_(Unicode_block)`;
	const pdfHref = `https://www.unicode.org/charts/PDF/U${beginBase}.pdf`;

	const begin = range.begin * 1;
	const end = range.end * 1;
	const body = settings.gridMode === 'grid' ? renderGridBody(begin, end) : renderFlowBody(begin, end);

	return `
	<article class="range-card" id="${rid}" data-card="${rid}">
		<header class="range-card__head">
			<div class="range-card__titles">
				<h2 class="range-card__title">${esc(range.name)}</h2>
				<code class="range-card__cp">U+${decToHex(range.begin).substring(2)} – U+${decToHex(range.end).substring(2)}</code>
			</div>
			<div class="range-card__actions">
				<a class="chip" href="${wikiHref}" target="_blank" rel="noopener" title="Wikipedia article">Wikipedia ↗</a>
				<a class="chip" href="${pdfHref}" target="_blank" rel="noopener" title="Official Unicode chart (PDF)">Chart ↗</a>
				<button type="button" class="icon-btn" data-action="deselect-range" data-range="${rid}" title="Remove this range" aria-label="Remove ${esc(range.name)}">✕</button>
			</div>
		</header>
		${body}
	</article>`;
}

function renderGridBody(begin, end) {
	const size = settings.tileSize;
	let con = `<div class="grid-card"><div class="grid-card__body grid-card__body--${size}">`;
	// Column header row.
	con += `<div class="grid-corner"></div>`;
	for (let i = 0; i < 16; i++) con += `<div class="grid-colhead">${i.toString(16).toUpperCase()}</div>`;

	const start = begin - (begin % 16);
	for (let c = start; c <= end; c++) {
		if (c % 16 === 0) {
			const prefix = decToHex(c);
			con += `<div class="grid-rowhead">${prefix.substring(2, prefix.length - 1)}</div>`;
		}
		if (c < begin) con += `<div class="tile tile--${size} tile--empty"></div>`;
		else con += tile(decToHex(c), size);
	}
	con += `</div></div>`;
	return con;
}

function renderFlowBody(begin, end) {
	const size = settings.tileSize;
	let con = `<div class="flow-card flow-card--${size}">`;
	for (let c = begin; c <= end; c++) con += tile(decToHex(c), size);
	con += `</div>`;
	return con;
}
