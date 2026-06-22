/**
 * state.js — application state + settings persistence.
 */

const STORAGE_KEY = 'unicode.ninja';

export const APP_VERSION = '4.3.4';
export const RELEASE_DATE = new Date(2026, 5, 22).getTime();
export const UNICODE_DATA_VERSION = 'v15.1.0 published 2023-09-06';

const defaults = {
	rememberSettings: false,
	maxSearchResults: 1000,
	chooserTab: 'Grouped', // 'Grouped' | 'Sorted'
	selectedRanges: ['r-0020-007F'],
	genericFontFamily: 'sans-serif',
	customFontFamily: '', // user-typed, locally installed font name (persists)
	gridMode: 'grid', // 'grid' | 'flow'
	theme: 'system', // 'system' | 'light' | 'dark'
	accent: 'indigo', // 'indigo' | 'rose' | 'orange' | 'teal'
	tileSize: 'md', // 'sm' | 'md' | 'lg'
	favorites: [],
};

export const settings = { ...defaults };

/** Non-persisted, in-memory app state. */
export const app = {
	rangeCache: {}, // rid -> rendered HTML (invalidated on font/grid changes)
	customFontLoaded: false, // a font file was dropped this session
	customFontName: '', // FontFace family name for the dropped font
};

export function loadSettings() {
	let saved;
	try {
		saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
	} catch {
		saved = null;
	}
	if (saved) {
		for (const key of Object.keys(defaults)) {
			if (saved[key] !== undefined) settings[key] = saved[key];
		}
	}
}

export function saveSettings() {
	if (!settings.rememberSettings) return;
	const toSave = {};
	for (const key of Object.keys(defaults)) toSave[key] = settings[key];
	window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

export function updateSetting(key, value) {
	settings[key] = value;
	if (key === 'rememberSettings' && !value) {
		window.localStorage.removeItem(STORAGE_KEY);
	}
	saveSettings();
}

export function clearRangeCache() {
	app.rangeCache = {};
}

/* ------------------------------------------------------------------ *
 * Selected ranges
 * ------------------------------------------------------------------ */

export function isRangeSelected(rid) {
	return settings.selectedRanges.includes(rid);
}

export function sortSelectedRanges() {
	settings.selectedRanges.sort((a, b) => parseInt(a.substring(2), 16) - parseInt(b.substring(2), 16));
}

/** Accepts a single rid or '_'-joined group of rids. Returns the last id added. */
export function selectRange(rid) {
	const ids = rid.split('_');
	for (const id of ids) {
		if (!isRangeSelected(id)) settings.selectedRanges.push(id);
	}
	sortSelectedRanges();
	saveSettings();
	return ids.at(-1);
}

export function deselectRange(rid) {
	const ids = rid.split('_');
	for (const id of ids) {
		const i = settings.selectedRanges.indexOf(id);
		if (i > -1) settings.selectedRanges.splice(i, 1);
	}
	sortSelectedRanges();
	saveSettings();
}

export function deselectAllRanges() {
	settings.selectedRanges = [];
	saveSettings();
}

/* ------------------------------------------------------------------ *
 * Favorites
 * ------------------------------------------------------------------ */

export function isFavorite(cid) {
	return settings.favorites.includes(cid);
}

export function toggleFavorite(cid) {
	if (isFavorite(cid)) {
		settings.favorites.splice(settings.favorites.indexOf(cid), 1);
	} else {
		settings.favorites.push(cid);
		settings.favorites.sort((a, b) => parseInt(a, 16) - parseInt(b, 16));
		// Favoriting implies the user wants persistence.
		settings.rememberSettings = true;
	}
	saveSettings();
	return isFavorite(cid);
}
