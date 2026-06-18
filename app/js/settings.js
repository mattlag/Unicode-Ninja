/**
 * settings.js — the settings view (route #/settings).
 */

import { esc, on, qs, qsa, toast } from './dom.js';
import { loadFontFile, removeSessionFont, tileFontFamily } from './font.js';
import { ACCENTS } from './nav.js';
import { app, APP_VERSION, clearRangeCache, RELEASE_DATE, settings, UNICODE_DATA_VERSION, updateSetting } from './state.js';

const GENERIC_FAMILIES = [
	['sans-serif', 'Sans-serif'],
	['serif', 'Serif'],
	['monospace', 'Monospace'],
	['system-ui', 'System UI'],
	['cursive', 'Cursive'],
	['fantasy', 'Fantasy'],
];

const THEMES = [
	['system', 'System'],
	['light', 'Light'],
	['dark', 'Dark'],
];

export function renderSettings() {
	const gff = settings.genericFontFamily;
	return `
	<div class="settings-page">
		<header class="page-head"><h1>Settings</h1></header>

		<section class="settings-card">
			<h2>Appearance</h2>
			<div class="setting-row">
				<div class="setting-row__label"><span>Theme</span><small>Light, dark, or follow your system.</small></div>
				<div class="seg">
					${THEMES.map(([v, l]) => `<button type="button" class="seg__btn${settings.theme === v ? ' is-active' : ''}" data-action="set-theme" data-theme="${v}">${l}</button>`).join('')}
				</div>
			</div>
			<div class="setting-row">
				<div class="setting-row__label"><span>Accent color</span><small>Tint buttons, links, and highlights.</small></div>
				<div class="accent-swatches" role="group" aria-label="Accent color">
					${ACCENTS.map((a) => `<button type="button" class="accent-swatch${settings.accent === a.id ? ' is-active' : ''}" data-accent="${a.id}" data-action="set-accent" title="${a.label}" aria-label="${a.label}" aria-pressed="${settings.accent === a.id}"><span class="accent-swatch__dot"></span></button>`).join('')}
				</div>
			</div>
		</section>

		<section class="settings-card">
			<h2>Character preview font</h2>
			<p class="settings-card__intro">Preview every glyph in the typeface you’re working with.</p>

			<div class="setting-row">
				<div class="setting-row__label"><span>Generic family</span><small>Fallback used when no custom font applies.</small></div>
				<select class="select" data-action="set-generic-font" aria-label="Generic font family">
					${GENERIC_FAMILIES.map(([v, l]) => `<option value="${v}"${gff === v ? ' selected' : ''}>${l}</option>`).join('')}
				</select>
			</div>

			<div class="setting-row">
				<div class="setting-row__label"><span>Installed font</span><small>Type the exact name of a font installed on this device.</small></div>
				<input class="input" type="text" id="installedFontInput" placeholder="e.g. Helvetica Neue" value="${esc(settings.customFontFamily)}" data-action="set-installed-font" />
			</div>

			<div class="font-drop" id="fontDrop">
				<input type="file" id="fontFile" accept=".ttf,.otf,.woff,.woff2,font/*" hidden />
				<div class="font-drop__inner">
					${app.customFontLoaded ? `<p><strong>${esc(app.customFontName)}</strong> is loaded for this session.</p><button type="button" class="btn btn--ghost" data-action="remove-font">Remove font</button>` : `<p>Drop a font file here, or <button type="button" class="link-btn" data-action="pick-font">browse…</button></p><small>.ttf · .otf · .woff · .woff2 — used for this session only.</small>`}
				</div>
				<div class="font-drop__preview" style="font-family:${tileFontFamily()}">Aa Bb Cc 123 €¥ ✶</div>
			</div>
		</section>

		<section class="settings-card">
			<h2>Search</h2>
			<div class="setting-row">
				<div class="setting-row__label"><span>Maximum results</span><small>Caps how many matches are gathered per search.</small></div>
				<input class="input input--num" type="number" min="1" step="100" value="${esc(settings.maxSearchResults)}" data-action="set-max-results" aria-label="Maximum search results" />
			</div>
		</section>

		<section class="settings-card">
			<h2>Data</h2>
			<div class="setting-row">
				<div class="setting-row__label"><span>Remember settings</span><small>Save preferences &amp; favorites in this browser.</small></div>
				<label class="switch">
					<input type="checkbox" ${settings.rememberSettings ? 'checked' : ''} data-action="set-remember" />
					<span class="switch__track"></span>
				</label>
			</div>
		</section>

		<section class="settings-card settings-card--about">
			<h2>About</h2>
			<p><strong>unicode.ninja</strong> — a tool to explore Unicode® characters and ranges. Unicode is a registered trademark of Unicode, Inc. Learn more at <a href="https://www.unicode.org/" target="_blank" rel="noopener">unicode.org ↗</a>.</p>
			<p>Created by Matt LaGrandeur. Unicode Ninja is part of the Glyphr Studio family of products. If you have any questions or feedback, please email <a href="mailto:mail@glyphrstudio.com">mail@glyphrstudio.com</a>. Open source on <a href="https://github.com/mattlag/UnicodeNinja" target="_blank" rel="noopener">GitHub ↗</a>.</p>
			<dl class="kv kv--about">
				<dt>App version</dt><dd>v${esc(APP_VERSION)}</dd>
				<dt>Updated</dt><dd>${new Date(RELEASE_DATE).toLocaleDateString()}</dd>
				<dt>Unicode data</dt><dd>${esc(UNICODE_DATA_VERSION)}</dd>
			</dl>
		</section>
	</div>`;
}

/** Wire up settings interactions that need direct listeners (file/drag). */
export function mountSettings(rerender) {
	const drop = qs('#fontDrop');
	const fileInput = qs('#fontFile');
	if (!drop || !fileInput) return;

	const handleFile = async (file) => {
		if (!file) return;
		try {
			await loadFontFile(file);
			toast(`Loaded ${file.name}`);
			rerender();
		} catch {
			toast('Could not load that font file');
		}
	};

	on(fileInput, 'change', () => handleFile(fileInput.files[0]));

	['dragenter', 'dragover'].forEach((evt) =>
		on(drop, evt, (e) => {
			e.preventDefault();
			drop.classList.add('is-dragover');
		}),
	);
	['dragleave', 'drop'].forEach((evt) =>
		on(drop, evt, (e) => {
			e.preventDefault();
			drop.classList.remove('is-dragover');
		}),
	);
	on(drop, 'drop', (e) => handleFile(e.dataTransfer.files[0]));

	// Range/select/number/checkbox inputs use delegated handlers in main.js,
	// except the file picker trigger:
	qsa('[data-action="pick-font"]', drop).forEach((btn) => on(btn, 'click', () => fileInput.click()));
	qsa('[data-action="remove-font"]', drop).forEach((btn) =>
		on(btn, 'click', () => {
			removeSessionFont();
			rerender();
		}),
	);
}

export { clearRangeCache, updateSetting };
