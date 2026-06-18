/**
 * data.js — read-only access to the Unicode reference data.
 *
 * The reference-*.js files are loaded as classic scripts before this module,
 * declaring these top-level `const` globals (shared via the realm's global
 * lexical environment, so modules can read them directly):
 *   unicodeBlocks, organizedScriptsV2, organizedSymbolsV2,
 *   unicodeNamesListBMP, unicodeNamesListSMP, htmlEntityNameList
 */

/* global unicodeBlocks, unicodeNamesListBMP, unicodeNamesListSMP, htmlEntityNameList */

export const blocks = unicodeBlocks;
export const entityNames = htmlEntityNameList;

/* ------------------------------------------------------------------ *
 * Code-point id helpers
 * A canonical char id looks like '0x0041' (uppercase, min 4 hex digits).
 * ------------------------------------------------------------------ */

export function decToHex(d) {
	let dr = Number(d).toString(16);
	while (dr.length < 4) dr = '0' + dr;
	return '0x' + dr.toUpperCase();
}

/** '0x0041' -> 65 */
export function charIdToDec(charId) {
	return parseInt(charId, 16);
}

/** route hex like '41', '1f600' -> canonical '0x0041' / '0x1F600' */
export function hexToCharId(hex) {
	hex = String(hex)
		.replace(/^(0x|u\+)/i, '')
		.toUpperCase();
	while (hex.length < 4) hex = '0' + hex;
	return '0x' + hex;
}

/** canonical char id -> bare hex for URLs, e.g. '0x0041' -> '0041' */
export function charIdToHex(charId) {
	return charId.replace(/^0x/i, '');
}

/* ------------------------------------------------------------------ *
 * Character names
 * ------------------------------------------------------------------ */

export function getUnicodeName(codePoint) {
	const codePointSuffix = codePoint.substr(2);
	const chn = codePoint * 1;
	let name;

	if ((chn >= 0x4e00 && chn < 0xa000) || (chn >= 0x20000 && chn < 0x323af)) {
		name = `CJK Unified Ideograph ${codePointSuffix}`;
	} else if (chn < 0xffff) {
		name = unicodeNamesListBMP[codePoint] || '{{no name found}}';
	} else if (chn >= 0x18b00 && chn <= 0x18cd5) {
		name = `Khitan Small Script Character ${codePointSuffix}`;
	} else if (chn >= 0x18800 && chn <= 0x18aff) {
		name = `Tangut Component ${chn - 0x18800 + 1}`;
	} else if (chn >= 0x1b170 && chn <= 0x1b2fb) {
		name = `Nushu Character ${codePointSuffix}`;
	} else if (chn < 0x1fbf9) {
		name = unicodeNamesListSMP[codePoint] || '{{no name found}}';
	} else if (chn < 0x1ffff) {
		const block = getParentRange(codePoint);
		name = block ? `${block.name} ${codePointSuffix}` : '{{no name found}}';
	} else {
		name = '{{no name found}}';
	}

	return name;
}

export function hasGlyph(charId) {
	return getUnicodeName(charId) !== '{{no name found}}';
}

export function getEntityName(charId) {
	return entityNames[charId];
}

/* ------------------------------------------------------------------ *
 * Ranges / blocks
 * ------------------------------------------------------------------ */

export function getParentRange(char) {
	for (const blockID in unicodeBlocks) {
		if (char <= unicodeBlocks[blockID].end && char >= unicodeBlocks[blockID].begin) {
			const block = { ...unicodeBlocks[blockID], id: blockID };
			return block;
		}
	}
	return false;
}

/** Resolve a range id (including sub-ranges like 's-FB13-FB17') to a block. */
export function getRange(rid) {
	if (unicodeBlocks[rid]) {
		return { ...unicodeBlocks[rid], id: rid };
	}
	// Sub-range: map to its parent block.
	const subBegin = rid.split('-')[1];
	const charDec = parseInt(`0x${subBegin}`, 16);
	return getParentRange(charDec);
}

/** Find the block a character belongs to. `hex` is a canonical char id. */
export function getRangeForChar(hex) {
	const dec = parseInt(hex, 16);
	for (const r in unicodeBlocks) {
		if (dec >= unicodeBlocks[r].begin && dec <= unicodeBlocks[r].end) {
			return { ...unicodeBlocks[r], id: r };
		}
	}
	return false;
}

/** Number of code points in a block. */
export function rangeSize(range) {
	return parseInt(range.end) - parseInt(range.begin) + 1;
}

/* ------------------------------------------------------------------ *
 * Whitespace / control detection
 * ------------------------------------------------------------------ */

export const whitespaceCharacters = ['0x0009', '0x000A', '0x000B', '0x000C', '0x000D', '0x0020', '0x0085', '0x00A0', '0x00AD', '0x1680', '0x2000', '0x2001', '0x2002', '0x2003', '0x2004', '0x2005', '0x2006', '0x2007', '0x2008', '0x2009', '0x200A', '0x2028', '0x2029', '0x202F', '0x205F', '0x3000', '0x180E', '0x200B', '0x200C', '0x200D', '0x2060', '0xFEFF'];

export function isWhitespace(charId) {
	return whitespaceCharacters.indexOf(charId) > -1;
}

export function isControl(charId) {
	return getUnicodeName(charId) === '<control>';
}
