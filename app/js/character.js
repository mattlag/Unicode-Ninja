/**
 * character.js — the single-character detail view (route #/char/<hex>).
 */

import { charIdToDec, charIdToHex, decToHex, getEntityName, getRangeForChar, getUnicodeName, hasGlyph, hexToCharId, isControl, isWhitespace } from './data.js';
import { esc, nbsp } from './dom.js';
import { tileFontFamily } from './font.js';
import { favoriteButton, tile } from './tiles.js';

const MAX_CP = 0x10ffff;

export function renderCharacter(hex) {
	const char = hexToCharId(hex);
	const dec = charIdToDec(char);

	if (!Number.isFinite(dec) || dec < 0 || dec > MAX_CP || !hasGlyph(char)) {
		return `
		<div class="char-page">
			<div class="empty-state empty-state--lg">
				<div class="empty-state__glyph">∅</div>
				<h2>No character here</h2>
				<p>There’s no encoded character at <code>U+${esc(charIdToHex(char))}</code>.</p>
				<button type="button" class="btn btn--primary" data-action="nav" data-route="explore">Back to explorer</button>
			</div>
		</div>`;
	}

	const name = getUnicodeName(char);
	const range = getRangeForChar(char);
	const base = char.substring(2);
	const codepointDec = parseInt(base, 16);

	const glyphChar = isWhitespace(char) ? '\u00A0' : `&#${char.substring(1)};`;
	const hexEntity = `&#x${codepointDec.toString(16)};`;
	const decEntity = `&#${codepointDec.toString(10)};`;
	const entityName = getEntityName(char);
	const rawChar = isControl(char) || isWhitespace(char) ? '' : String.fromCodePoint(codepointDec);

	const prev = dec > 0 ? dec - 1 : null;
	const next = dec < MAX_CP ? dec + 1 : null;

	let beginBase = decToHex(range ? range.begin : 0).substring(2);
	if (beginBase === '0020') beginBase = '0000';
	const wikiName = range ? range.name.replace(/ /g, '_') : '';

	return `
	<div class="char-page">
		<nav class="char-page__bar">
			<button type="button" class="btn btn--ghost" data-action="back">← Back</button>
			<div class="char-page__nav">
				<button type="button" class="icon-btn"${prev === null ? ' disabled' : ''} data-action="nav-char" data-hex="${prev !== null ? charIdToHex(decToHex(prev)) : ''}" title="Previous code point" aria-label="Previous code point">‹</button>
				<button type="button" class="icon-btn"${next === null ? ' disabled' : ''} data-action="nav-char" data-hex="${next !== null ? charIdToHex(decToHex(next)) : ''}" title="Next code point" aria-label="Next code point">›</button>
			</div>
		</nav>

		<div class="char-hero">
			<div class="char-hero__glyph-wrap">
				<div class="char-hero__glyph" style="font-family:${tileFontFamily()}">${glyphChar}</div>
				<div class="char-hero__cp"><code>U+${esc(base)}</code></div>
			</div>
			<div class="char-hero__meta">
				<h1 class="char-hero__name">${esc(name)}</h1>
				<div class="char-hero__sub">
					${range ? `<button type="button" class="chip chip--link" data-action="show-range" data-range="${range.id}" title="Show this range in the explorer">${esc(range.name)}</button>` : ''}
					${favoriteButton(char)}
				</div>
				<div class="char-hero__copy">
					${rawChar ? `<button type="button" class="btn btn--primary" data-action="copy" data-copy="${esc(rawChar)}">Copy character</button>` : ''}
					<button type="button" class="btn" data-action="copy" data-copy="${esc(hexEntity)}">Copy hex entity</button>
					<button type="button" class="btn" data-action="copy" data-copy="${esc(decEntity)}">Copy decimal entity</button>
					${entityName ? `<button type="button" class="btn" data-action="copy" data-copy="${esc(`&${entityName};`)}">Copy named entity</button>` : ''}
				</div>
			</div>
		</div>

		<div class="char-details">
			<section class="detail-card">
				<h3>HTML &amp; encoding</h3>
				<dl class="kv">
					<dt>HTML hex entity</dt><dd><code class="copyable" data-action="copy" data-copy="${esc(hexEntity)}">${esc(hexEntity)}</code></dd>
					<dt>HTML decimal entity</dt><dd><code class="copyable" data-action="copy" data-copy="${esc(decEntity)}">${esc(decEntity)}</code></dd>
					${entityName ? `<dt>HTML named entity</dt><dd><code class="copyable" data-action="copy" data-copy="${esc(`&${entityName};`)}">${esc(`&${entityName};`)}</code></dd>` : ''}
					<dt>Code point</dt><dd><code>U+${esc(base)}</code></dd>
					<dt>Decimal</dt><dd><code>${codepointDec}</code></dd>
				</dl>
			</section>

			<section class="detail-card">
				<h3>Unicode</h3>
				<dl class="kv">
					<dt>Name</dt><dd>${esc(name)}</dd>
					${range ? `<dt>Block</dt><dd>${esc(range.name)}<br><code>U+${decToHex(range.begin).substring(2)} – U+${decToHex(range.end).substring(2)}</code></dd>` : ''}
					${
						range
							? `<dt>Reference</dt><dd>
						<a href="https://www.wikipedia.org/wiki/${wikiName}_(Unicode_block)" target="_blank" rel="noopener">Wikipedia ↗</a><br>
						<a href="https://www.unicode.org/charts/PDF/U${beginBase}.pdf" target="_blank" rel="noopener">Official chart (PDF) ↗</a>
					</dd>`
							: ''
					}
				</dl>
				${range ? `<button type="button" class="btn btn--ghost" data-action="show-range" data-range="${range.id}">View whole block in explorer →</button>` : ''}
			</section>
		</div>

		${range ? renderNeighbors(char, range) : ''}
	</div>`;
}

function renderNeighbors(char, range) {
	const dec = charIdToDec(char);
	const span = 8;
	let start = dec - span;
	let end = dec + span;
	if (start < range.begin) start = range.begin;
	if (end > range.end) end = range.end;

	let tiles = '';
	for (let c = start; c <= end; c++) {
		const id = decToHex(c);
		tiles += `<div class="neighbor${c === dec ? ' is-current' : ''}">${tile(id, 'md')}</div>`;
	}

	return `
	<section class="char-neighbors">
		<h3>Nearby in ${esc(range.name)}</h3>
		<div class="neighbor-strip">${tiles}</div>
	</section>`;
}

export { nbsp };
