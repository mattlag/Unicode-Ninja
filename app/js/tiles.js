/**
 * tiles.js — character tile + list-row rendering, shared across views.
 */

import { decToHex, getRangeForChar, getUnicodeName, isControl, isWhitespace } from './data.js';
import { esc, nbsp } from './dom.js';
import { tileFontFamily } from './font.js';
import { isFavorite } from './state.js';

/**
 * A single glyph tile.
 * @param {string} char  canonical char id, e.g. '0x0041'
 * @param {'sm'|'md'|'lg'} size
 */
export function tile(char, size = 'md') {
	const name = getUnicodeName(char);
	const cp = char.replace('0x', 'U+');

	if (name === '{{no name found}}') {
		return `<div class="tile tile--${size} tile--empty" title="No character encoded${'\n'}at ${cp}"></div>`;
	}

	const control = isControl(char);
	let display = `&#${char.substring(1)};`;
	if (isWhitespace(char)) display = '&nbsp;';

	const title = `${esc(name)}\n${cp}`;
	const cls = `tile tile--${size}${control ? ' tile--control' : ''}`;
	return `<button type="button" class="${cls}" data-action="open-char" data-char="${char}" title="${title}" style="font-family:${tileFontFamily()}">${display}</button>`;
}

/** Star / favorite toggle button. */
export function favoriteButton(char, compact = false) {
	const fav = isFavorite(char);
	const label = fav ? 'Favorited' : 'Add to favorites';
	return `<button type="button" class="fav-btn${fav ? ' is-active' : ''}" data-action="toggle-favorite" data-char="${char}" data-compact="${compact}" title="${label}" aria-pressed="${fav}">${fav ? '★' : '☆'}${compact ? '' : `<span>${fav ? 'Favorited' : 'Favorite'}</span>`}</button>`;
}

/**
 * A scrollable list of characters (used by search + favorites).
 * @param {Array<string|{char:string,html?:string}>} items
 */
export function charList(items, emptyMessage = 'Nothing to show yet.') {
	if (!items || items.length === 0) {
		return `<div class="empty-state"><p>${esc(emptyMessage)}</p></div>`;
	}

	const rows = items
		.map((item) => {
			const char = typeof item === 'object' ? item.char : item;
			const nameHtml = typeof item === 'object' && item.html ? item.html : nbsp(esc(getUnicodeName(char)));
			const range = getRangeForChar(char);
			const cp = char.replace('0x', 'U+');
			return `
			<div class="char-row" data-action="open-char" data-char="${char}">
				${tile(char, 'sm')}
				<div class="char-row__name">${nameHtml}</div>
				<code class="char-row__cp">${cp}</code>
				<div class="char-row__range">${range ? nbsp(esc(range.name)) : ''}</div>
				<div class="char-row__fav" data-stop>${favoriteButton(char, true)}</div>
			</div>`;
		})
		.join('');

	return `<div class="char-list">${rows}</div>`;
}

export { decToHex };
