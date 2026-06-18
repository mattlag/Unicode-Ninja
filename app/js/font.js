/**
 * font.js — character preview font handling.
 *
 * Three layers, in priority order, decide the font used to render glyph tiles:
 *   1. A font file dropped/uploaded this session (FontFace API, not persisted).
 *   2. A locally-installed font family name typed by the user (persisted).
 *   3. The generic family selector (serif / sans-serif / monospace / ...).
 */

import { app, clearRangeCache, settings } from './state.js';

const SESSION_FAMILY = 'UN_CustomPreviewFont';

/** The CSS font-family stack to use for glyph tiles right now. */
export function tileFontFamily() {
	if (app.customFontLoaded) {
		return `'${SESSION_FAMILY}', ${settings.genericFontFamily}`;
	}
	if (settings.customFontFamily && settings.customFontFamily.trim()) {
		return `'${settings.customFontFamily.trim().replace(/'/g, '')}', ${settings.genericFontFamily}`;
	}
	return settings.genericFontFamily;
}

/** Load a user-provided font file for this session. Returns the file name. */
export async function loadFontFile(file) {
	const buffer = await file.arrayBuffer();
	// Remove a previously loaded session font.
	removeSessionFont();
	const face = new FontFace(SESSION_FAMILY, buffer);
	await face.load();
	document.fonts.add(face);
	app.customFontLoaded = true;
	app.customFontName = file.name;
	clearRangeCache();
	return file.name;
}

export function removeSessionFont() {
	for (const face of document.fonts) {
		if (face.family === SESSION_FAMILY) document.fonts.delete(face);
	}
	app.customFontLoaded = false;
	app.customFontName = '';
	clearRangeCache();
}
