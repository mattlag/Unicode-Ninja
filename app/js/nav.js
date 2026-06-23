/**
 * nav.js — persistent top bar, mobile bottom bar, and theme application.
 */

import { settings, updateSetting } from './state.js';

const PRIMARY = [
	{ route: 'explore', label: 'Explore', icon: '▦' },
	{ route: 'favorites', label: 'Favorites', icon: '★' },
	{ route: 'settings', label: 'Settings', icon: '⚙' },
];

const THEME_CYCLE = { system: 'light', light: 'dark', dark: 'system' };
const THEME_ICON = { system: '◐', light: '☀', dark: '☾' };
const THEME_LABEL = { system: 'System theme', light: 'Light theme', dark: 'Dark theme' };

export const ACCENTS = [
	{ id: 'rose', label: 'Rose' },
	{ id: 'orange', label: 'Orange' },
	{ id: 'teal', label: 'Teal' },
	{ id: 'indigo', label: 'Indigo' },
];

export function applyTheme() {
	const root = document.documentElement;
	if (settings.theme === 'system') root.removeAttribute('data-theme');
	else root.setAttribute('data-theme', settings.theme);
	updateThemeButton();
}

export function applyAccent() {
	document.documentElement.setAttribute('data-accent', settings.accent || 'indigo');
	updateFavicon();
}

/**
 * Draw a gradient circle in the accent color and use it as the favicon.
 * Reads the resolved --accent custom property and builds a well-differentiated
 * light-to-dark diagonal gradient from its hue, so it always matches the
 * active accent (and theme).
 */
function updateFavicon() {
	const cs = getComputedStyle(document.documentElement);
	const accent = cs.getPropertyValue('--accent').trim() || 'hsl(245 90% 72%)';
	const hsl = parseHsl(accent);

	// Build two strongly contrasting stops from the accent hue.
	const c1 = hsl ? hslStr(hsl.h, Math.min(hsl.s + 6, 100), Math.min(hsl.l + 22, 92)) : accent;
	const c2 = hsl ? hslStr(hsl.h, Math.min(hsl.s + 10, 100), Math.max(hsl.l - 26, 14)) : accent;

	const size = 64;
	const canvas = document.createElement('canvas');
	canvas.width = canvas.height = size;
	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	const r = size / 2;
	ctx.beginPath();
	ctx.arc(r, r, r, 0, Math.PI * 2);
	ctx.closePath();
	ctx.clip();

	const grad = ctx.createLinearGradient(0, 0, size, size);
	grad.addColorStop(0, c1);
	grad.addColorStop(1, c2);
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, size, size);

	const href = canvas.toDataURL('image/png');
	let link = document.querySelector('link[rel="icon"]');
	if (!link) {
		link = document.createElement('link');
		link.rel = 'icon';
		document.head.appendChild(link);
	}
	link.type = 'image/png';
	link.href = href;
}

/** Parse an `hsl(h s% l%)` or `hsl(h, s%, l%)` string into {h,s,l} numbers. */
function parseHsl(str) {
	const m = str.match(/hsl\(\s*([\d.]+)[\s,]+([\d.]+)%[\s,]+([\d.]+)%/i);
	if (!m) return null;
	return { h: +m[1], s: +m[2], l: +m[3] };
}

function hslStr(h, s, l) {
	return `hsl(${h} ${s}% ${l}%)`;
}

export function cycleTheme() {
	updateSetting('theme', THEME_CYCLE[settings.theme] || 'system');
	applyTheme();
}

function updateThemeButton() {
	document.querySelectorAll('[data-action="cycle-theme"]').forEach((btn) => {
		btn.textContent = THEME_ICON[settings.theme];
		btn.title = THEME_LABEL[settings.theme];
		btn.setAttribute('aria-label', THEME_LABEL[settings.theme]);
	});
}

export function renderTopNav() {
	return `
	<header class="topbar">
		<div class="topbar__inner">
			<button type="button" class="wordmark" data-action="nav" data-route="landing" aria-label="unicode ninja home">
				unicode<span class="wordmark__dot">.</span>ninja
			</button>
			<nav class="topnav" aria-label="Primary">
				${PRIMARY.map((i) => `<button type="button" class="topnav__item" data-action="nav" data-route="${i.route}" data-nav="${i.route}">${i.label}</button>`).join('')}
			</nav>
			<div class="topbar__tools">
				<button type="button" class="searchtrigger" data-action="open-search" aria-label="Search characters">
					<span class="searchtrigger__icon" aria-hidden="true">⌕</span>
					<span class="searchtrigger__text">Search</span>
					<kbd class="searchtrigger__kbd">/</kbd>
				</button>
				<button type="button" class="icon-btn theme-btn" data-action="cycle-theme">${THEME_ICON[settings.theme]}</button>
			</div>
		</div>
	</header>`;
}

export function renderBottomNav() {
	const items = [
		{ route: 'explore', label: 'Explore', icon: '▦' },
		{ route: 'search', label: 'Search', icon: '⌕', action: 'open-search' },
		{ route: 'favorites', label: 'Favorites', icon: '★' },
		{ route: 'settings', label: 'Settings', icon: '⚙' },
	];
	return `
	<nav class="bottomnav" aria-label="Primary mobile">
		${items
			.map(
				(i) => `<button type="button" class="bottomnav__item" data-action="${i.action || 'nav'}"${i.action ? '' : ` data-route="${i.route}"`} data-nav="${i.route}">
					<span class="bottomnav__icon" aria-hidden="true">${i.icon}</span>
					<span class="bottomnav__label">${i.label}</span>
				</button>`,
			)
			.join('')}
	</nav>`;
}

/** Highlight the nav item matching the active route. */
export function setActiveNav(routeName) {
	const active = routeName === 'char' ? 'explore' : routeName;
	document.querySelectorAll('[data-nav]').forEach((el) => {
		el.classList.toggle('is-active', el.dataset.nav === active);
	});
}
