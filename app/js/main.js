/**
 * main.js — application entry point: shell, routing, and event delegation.
 */

import { renderCharacter } from './character.js';
import { copyText, on, qs } from './dom.js';
import { renderExplorer, renderRail, renderRailList, renderStackSection, setRailFilter } from './explorer.js';
import { renderFavorites } from './favorites.js';
import { tileFontFamily } from './font.js';
import { mountLanding, renderLanding } from './landing.js';
import { applyAccent, applyTheme, cycleTheme, renderBottomNav, renderTopNav, setActiveNav } from './nav.js';
import { navigate, path, startRouter } from './router.js';
import { closeSearchOverlay, isSearchOverlayOpen, mountSearchPage, openSearchOverlay, renderSearchPage, searchInline } from './search.js';
import { mountSettings, renderSettings } from './settings.js';
import { clearRangeCache, deselectAllRanges, deselectRange, isRangeSelected, loadSettings, saveSettings, selectRange, settings, toggleFavorite, updateSetting } from './state.js';
import { favoriteButton } from './tiles.js';

let view;

function init() {
	loadSettings();
	applyTheme();
	applyAccent();

	const root = qs('#app');
	root.innerHTML = `${renderTopNav()}<main id="view" class="view"></main>${renderBottomNav()}`;
	view = qs('#view');

	on(root, 'click', onClick);
	on(root, 'input', onInput);
	on(root, 'change', onChange);
	on(document, 'keydown', onKeydown);

	startRouter(renderRoute);
}

/* ------------------------------------------------------------------ *
 * Routing / view rendering
 * ------------------------------------------------------------------ */

function renderRoute(route) {
	if (isSearchOverlayOpen()) closeSearchOverlay();
	setActiveNav(route.name);
	document.body.classList.toggle('view--explore', route.name === 'explore');

	switch (route.name) {
		case 'landing':
			view.innerHTML = renderLanding();
			mountLanding();
			scrollTop();
			break;
		case 'explore':
			view.innerHTML = renderExplorer();
			afterExplore(route.params.rid);
			break;
		case 'char':
			view.innerHTML = renderCharacter(route.params.hex);
			scrollTop();
			break;
		case 'search':
			view.innerHTML = renderSearchPage(route.params.query);
			mountSearchPage(route.params.query);
			scrollTop();
			break;
		case 'favorites':
			view.innerHTML = renderFavorites();
			scrollTop();
			break;
		case 'settings':
			view.innerHTML = renderSettings();
			mountSettings(rerenderSettings);
			scrollTop();
			break;
		default:
			view.innerHTML = renderLanding();
			mountLanding();
	}
}

function afterExplore(rid) {
	if (rid) {
		if (!isRangeSelected(rid)) {
			selectRange(rid);
			refreshRail();
			refreshStack();
		}
		scrollToCard(rid);
	} else {
		scrollTop();
	}
}

function rerenderSettings() {
	view.innerHTML = renderSettings();
	mountSettings(rerenderSettings);
}

function scrollTop() {
	window.scrollTo({ top: 0 });
}

function scrollToCard(rid) {
	setTimeout(() => {
		const el = document.getElementById(rid);
		if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}, 60);
}

/* ------------------------------------------------------------------ *
 * Explorer surgical refreshes
 * ------------------------------------------------------------------ */

function refreshRail() {
	const rail = qs('#rangeRail');
	if (rail) rail.innerHTML = renderRail();
}
function refreshRailList() {
	const list = qs('#railList');
	if (list) list.innerHTML = renderRailList();
}
function refreshStack() {
	const stack = qs('#rangeStack');
	if (stack) stack.innerHTML = renderStackSection();
}

/* ------------------------------------------------------------------ *
 * Favorites button refresh
 * ------------------------------------------------------------------ */

function refreshFavButtons(char) {
	document.querySelectorAll(`.fav-btn[data-char="${char}"]`).forEach((btn) => {
		const compact = btn.dataset.compact === 'true';
		btn.outerHTML = favoriteButton(char, compact);
	});
}

/* ------------------------------------------------------------------ *
 * Click delegation
 * ------------------------------------------------------------------ */

function onClick(e) {
	const el = e.target.closest('[data-action]');
	if (!el) return;
	const d = el.dataset;

	switch (d.action) {
		case 'nav':
			navigate(d.route);
			break;
		case 'open-search':
			openSearchOverlay();
			break;
		case 'cycle-theme':
			cycleTheme();
			break;
		case 'open-char':
			navigate('char', { hex: d.char.replace(/^0x/i, '') });
			break;
		case 'nav-char':
			if (d.hex) navigate('char', { hex: d.hex });
			break;
		case 'back':
			if (window.history.length > 1) window.history.back();
			else navigate('explore');
			break;
		case 'show-range':
			selectRange(d.range);
			navigate('explore', { rid: d.range });
			break;
		case 'copy':
			copyText(d.copy);
			break;
		case 'toggle-favorite': {
			toggleFavorite(d.char);
			refreshFavButtons(d.char);
			if (currentRouteName() === 'favorites') {
				view.innerHTML = renderFavorites();
			}
			break;
		}
		case 'toggle-range': {
			const ids = d.range.split('_');
			const allSelected = ids.every(isRangeSelected);
			if (allSelected) deselectRange(d.range);
			else selectRange(d.range);
			refreshRail();
			refreshStack();
			if (!allSelected && d.scroll) scrollToCard(d.scroll);
			break;
		}
		case 'deselect-range':
			deselectRange(d.range);
			refreshRail();
			refreshStack();
			break;
		case 'clear-ranges':
			deselectAllRanges();
			refreshRail();
			refreshStack();
			break;
		case 'chooser-tab':
			updateSetting('chooserTab', d.tab);
			setRailFilter('');
			refreshRail();
			break;
		case 'grid-mode':
			if (settings.gridMode !== d.mode) {
				updateSetting('gridMode', d.mode);
				clearRangeCache();
				const ex = qs('.explorer');
				if (ex) ex.dataset.grid = d.mode;
				refreshStack();
			}
			break;
		case 'tile-size':
			if (settings.tileSize !== d.size) {
				updateSetting('tileSize', d.size);
				clearRangeCache();
				refreshStack();
			}
			break;
		case 'open-rail': {
			const ex = qs('.explorer');
			if (ex) ex.classList.add('rail-open');
			const filter = qs('#rangeFilter');
			if (filter) filter.focus();
			break;
		}
		case 'close-rail': {
			const ex = qs('.explorer');
			if (ex) ex.classList.remove('rail-open');
			break;
		}
		case 'set-theme':
			updateSetting('theme', d.theme);
			applyTheme();
			rerenderSettings();
			break;
		case 'set-accent':
			updateSetting('accent', d.accent);
			applyAccent();
			rerenderSettings();
			break;
		default:
			break;
	}

	// On mobile, picking a range from the open rail dismisses it.
	if (d.action === 'toggle-range') {
		const ex = qs('.explorer');
		if (ex && window.matchMedia('(max-width: 860px)').matches) ex.classList.remove('rail-open');
	}
}

/* ------------------------------------------------------------------ *
 * Input (live) delegation
 * ------------------------------------------------------------------ */

let filterRaf;
let installedFontTimer;
let searchPageTimer;

function onInput(e) {
	const el = e.target.closest('[data-action]');
	if (!el) return;

	switch (el.dataset.action) {
		case 'filter-ranges':
			setRailFilter(el.value);
			cancelAnimationFrame(filterRaf);
			filterRaf = requestAnimationFrame(refreshRailList);
			break;
		case 'set-installed-font':
			clearTimeout(installedFontTimer);
			installedFontTimer = setTimeout(() => {
				updateSetting('customFontFamily', el.value);
				clearRangeCache();
				const preview = qs('.font-drop__preview');
				if (preview) preview.style.fontFamily = tileFontFamily();
			}, 200);
			break;
		case 'search-page-input':
			clearTimeout(searchPageTimer);
			searchPageTimer = setTimeout(() => {
				const q = el.value;
				window.history.replaceState(null, '', path('search', { query: q }));
				searchInline(q);
			}, 150);
			break;
		default:
			break;
	}
}

/* ------------------------------------------------------------------ *
 * Change delegation (selects, checkboxes, numbers)
 * ------------------------------------------------------------------ */

function onChange(e) {
	const el = e.target.closest('[data-action]');
	if (!el) return;

	switch (el.dataset.action) {
		case 'set-generic-font':
			updateSetting('genericFontFamily', el.value);
			clearRangeCache();
			rerenderSettings();
			break;
		case 'set-max-results': {
			const n = Math.max(1, parseInt(el.value) || 1000);
			updateSetting('maxSearchResults', n);
			break;
		}
		case 'set-remember':
			updateSetting('rememberSettings', el.checked);
			if (el.checked) saveSettings();
			break;
		default:
			break;
	}
}

/* ------------------------------------------------------------------ *
 * Keyboard shortcuts
 * ------------------------------------------------------------------ */

function onKeydown(e) {
	const typing = /^(input|textarea|select)$/i.test(e.target.tagName) || e.target.isContentEditable;

	if ((e.key === '/' || (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey))) && !typing) {
		e.preventDefault();
		openSearchOverlay();
		return;
	}
	if (e.key === 'Escape') {
		if (isSearchOverlayOpen()) {
			closeSearchOverlay();
			return;
		}
		const ex = qs('.explorer.rail-open');
		if (ex) ex.classList.remove('rail-open');
	}
}

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

function currentRouteName() {
	return window.location.hash.replace(/^#\/?/, '').split('/')[0] || 'landing';
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}
