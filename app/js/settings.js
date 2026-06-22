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
		<p><strong>unicode.ninja</strong> — a tool to explore Unicode® characters and ranges. Unicode is a registered trademark of Unicode, Inc. Learn more at <a href="https://www.unicode.org/" target="_blank" rel="noopener">unicode.org ↗</a>.Created by Matt LaGrandeur.</p>
			<dl class="kv kv--about">
			<dt>App version</dt><dd>v${esc(APP_VERSION)}</dd>
			<dt>Updated</dt><dd>${new Date(RELEASE_DATE).toLocaleDateString()}</dd>
			<dt>Unicode data</dt><dd>${esc(UNICODE_DATA_VERSION)}</dd>
			</dl>
		</section>
		<section class="settings-card settings-card--family">
			<h2>Family</h2>
			<p>Unicode Ninja is a member of the <strong>Glyphr Studio</strong> family. You can raise issues on the <a href="https://github.com/mattlag/UnicodeNinja/issues" target="_blank" rel="noopener">GitHub page</a>, or reach out to <a href="mailto:mail@glyphrstudio.com">mail@glyphrstudio.com</a> — we always love hearing feedback and answering questions!</p>
			<div class="family-grid">
				<a href="https://www.glyphrstudio.com" target="_blank" rel="noopener" class="family-link">
					<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAEAYAAAD6+a2dAAAABGNJQ1AJEAAAOiQTaAAAAAlwSFlzAAAuIwAALiMBeKU/dgAADAlJREFUeJztnVlsVFUcxm2L0hasxWrFAiquiFvEDdk0irtoFEEIioEXI0YiJhjjmzGGkIACD4TACygqGIyK+8YWoiBRUBQQBVGpiNJFagst2vrw3V/rnM71nM7MvecW+718mbQzc+ee//mf77+cc/NKC0oLSguOyTHy8sT5+amve/USn3uu+LzzxGeeKa6oEJeXi0tLxccfL+7ZM5WPPVbcrVt6LjB+GdcR9hq0tKR//fffqfzXX6nc2Ciurxf/+ae4rk78xx/i334TV1aK9+wRb98u3rYt9X18f3Nz+uvLHN2yezs3kBvNwFx4ofj228XXXy8eOFBcXJzd90aNMEPBoDG8qNDUJP76a/FHH4nfflu8ebP48GHxkSOZflNeZh6AGXbyyeLrrhM/+KD4qqvExx2X6YV1IR0wjC++EC9YIH7nHXFNjRiPZEcHDaCwUHz55eLHHhMz06OeGV1IxaFD4o8/Fs+aJd60SdzQYPuEgsL8wvzCfNu/4dpvu008Z4542LDgY3KuIrrgAibcOeeIr7xSXF0t/uEHMZ6jPSwGwIxn4GfPFiPakgpEEjOAG/L77+mZvyO6uGGs/Sx5YaLRN7guxPP554tZEr77TtxeK4SIQH4wrv7pp8X9+mV7qdEA9f3zz+JffhGjqr/5JvXv3BgGunt3cVmZ+PTTxRdcICZq6dtX3Lu3mAkSBj4fV42KDwPimOvJFAMGiB96SEzU8cEH4jZDMAwAS0LcscYTriUFiJxvvxV//rn4zTfFa9eKmeGZgqWNgb/mGvGNN4oRu6edJkb04no/+0z800+p1x2GESPEQ4dmfs3/xqBB4vvvF3//vZj71s4A+MGoesRdUnDggHjNGvGSJeL33xdnHg6lB/H+jz+Kn39ejOq+6SbxvfeK+/cXL1wofuEFcW2t2/c98YQ4VwbAeF57rRjD5fccPmwYAGKPcC4pqh7LffFFMeHP/v3i3CVG3IAhcj1ffik+6yzxp5+KXQc+apxyihgPRtSwbZshbkjg4Np8gzWcqIMbTqbNBn4Xho2GISOJyyahUlUl3rdPjCi0gYQNnFRccYX44ovF27cHBkCGC5fvO4Gze7f42WfFL78stg08A37SSWLW1MsuExMuoZYRW4g0Bp41kngazlZT2BB1lNGnj5iMbEmJ4QFI2foCLnPRIvGrr4pdZzxRy8SJ4pEjxaj4fGvGQ8AgduwQv/ee+JVXxMx094ybcOutqddj5k9Yq6MC30eUUFERGAAuEcuIG6zhqHhutOsaesMN4scfF3Mju2VY6ygqEl96qRhxd/bZ4nnzxBs3im3ikwl2zz3iO+4QmxqL740a5HF69w5mBBbpq0hDogJXT7xuE3dkvp55RsyMz3Tgw0BVkiWS8Ji11Oa6+R1ELwx8SUkqxyW6CWvLygID8B3nM/OpctlmFAmbp54SI26iBjMUj3PffWJuqA0rV4op5tgSQ1HhxBPhwAB8pXaph69bJya8suGBB8RRr5lhIKrApQ8eLLaJZ5a0l14S5zpv4Qo8TasHoBEjbqCuifNtogp1P3myONuUabZAVSPueG0DHu/gwdxfU0dQWhoYAGFR3NiyRfzrr27/zxpP6tV3cYbvJ3NKDcF2XSSwSGHHncgCJSWBASBy4gKJF+L9jqp93zPfBDMfLWVT8ww4tQJfKC4ODICeu7jAWk9VzlUMEZblWuVnC+JrEk2u95OEky8PUEgnAKImLtAcScLFBm4o6t81oRM3KBO7xvNkHn3BmwFQJ3fNpJGfSHrnEdfp6qFcJ0BUKC+PqcvVBAPpOpPRDL5cpStoTKGMbENcmb8wtIrAuNdUMl+2jhpAVY6wKamGgLbBEGyg8cYXWkVg3AZAfZrowxY2IRIJmzpahIkaGCQbOtA4NlCU8RXO9ujhyQBwfRRXTjjB7X2vvSZ2rQ7GBRJZW7eKXcvWQ4ZEd00uKCoKDMCXuCKH75pLf+stMR03vj0B2oQiVluv3X+DzCvFLF8eoHt3z+EUvW+UoW1ilNz5tGliWrHizqmz5+/118XLl4ttDSOIXvoVevTI/bV1BHl5xubNuEFV6u67xRSlbNfDTKPb9cMPxbSD59ozMNNpply6VEy7PK1rNvD7Jk0S++65zMtLSEZt1CgxDRbUBmxiihs/Zox4/HjxnXeKqRmgMdAeVO2YkYRt5CfYUEKKmu9hxtNUSSbTBhJYNKzQm+i/lhHsDUxKWEV799Sp4p07M/scBpiNHeyUYe2lA4oZSNjGDiEaUlD11CzwBK5g4KlePvmkOO7aSzgS4gFYO994Q+xaHQwDM5kGEzhqMKOpCrJfAM2SnIEHng0Az8NGi3ffFdvq5IStvqMAwMBecol43Djx2LFitE7S0Nwc3EgGIu41iT58Dj6gQygMuHTiZ9ZmunddO4oyBYZHIotEztVXi2n2pFcwaWVrEy0tnj0AmzZ37RKHhXMY5pQp4gkTxF99JSZDiCGwhrMpErFGgoY1H8MnD8KAURxDK1DlQ1QStpLHQGMk/eQTE60G4MsDMFA2l8/A0BFELWH48FQmaiBco9xqbv/GAEgxYwDUJvh8RBzikcYPytO+VXy2aF0CCIPirrMzALaGEPOQpDAQ7uGC4S6kR1OTYQBxJyYQT7ayKKqeOJwwMS6Xy9LEUmIeLEFmkOvEo+BB0Aquxa+4cOiQZzV9xhliW3iEB2BXMAkac+sXXcO4cm40v484niWHAUUrwDRtwqaW4P1oCj6X78k3Gm34nUQFN98s9r0Hs77eswGwnZpeOsRcWMKFtR1D4MQL6urk1s0jXcxz/dAAZPwYSDSCeb4f/+fa6GFiwwYxohWPRzexr2JcQ0Nwo1wbGHINBuyWW8Tr14spr4YBsRdXgidbYDiUi+fOFXPIlq/OoNrawFX5rq9zcgWuERV+tGL1anHUeQsbqqsDA8Dl+QIagE2XnErW2eJqV7CkUGPwVYuprw8MwPUkjKiBWJo5Uzx9upjMW1LUc65AJtQXGhsDDeDawxY1GGA6hPAId90lplhE/Z+GkI4aMOEunofoATEJY3gm83fej6ciszljhpgMZxgyFZW5QqsIJMxJCjAEtMBFF4mJFh55REx8zkwyT9cmGiDcQnQiuvg7YZvJZvu6+do8DZ3vcd1n4bshpK4uuAG2IoxvcKOZaaY2YEaGraWux8RnC8JM1zU97i15JmpqAgPgvPrOCgbUt0YgQ+jaOEKRKe7rJqVeVRXMLNeeti6kR0f3BbAUuXZD5xptqezAALjw8FOlu5AODDzNqPQK2rqDObbOlwbYu1dcVRUsAYgnjj/jjNmkgVy8KfIQZ2GiznWJMNdus1ppNo/SusY5/exXCKta8v00wfoyAM4y3r/f6Afg0SRJMwB20T78sJhECi6ULttTTxVThUNkofrDniEU9kwgvgfDo7+AnP6qVWI0lC2s43ppg497RxbXx5JfWRlcABZLa9ajj4p9V6sA8T4uNmlhqw30KZDYosEkbvGHAbdplcBFMgMornCMWVLwySfijrZl+wbhKRtBOFbOdVd0rmAeSUNRql1XMDeYcitdrr6qVXimzmIAqHt2ANEWzunr9BjGDfOYfQ7mbGcAZNZo08blUpzx1TWMy/J1rp4JlkZSyKztnGHEwHN+oK8JhFhlHOG2aC9EhCB6ULeclUtbdlwgnOL7ybSZnTj0M5gPcjQftBiW6kWN03zKgJHSZQ1nBtMcyvH6tIXz2vemT7P/YNkyMV3TbbA8No6U6+jRYrY20eMWNShTo0149IqZ+zd78syjWsyuZ9Q3Ax824GZRiLZwoo2k9f3ze9k8+9xzYgygfdnf8bmBhFMcjUp/Pi4v6Yc3He3A8JnxaLgVK8Th5zA6PjeQL0A80JtnPkE07tPG/q/AoyHu0Gzz54vdj6J1NACACCOTRHxOKpTEifmQ56Se69dZgGs3U848xGrxYjHRknuPZ4bPDjZBXEv4w4YMtlChGfg7qplNk77r4r6BWEX0kqtnoplPFcfV45Ezr+HkyADafazR0EHmi/InqVoMgNd02PA+RCgGBnO4tfl/ZsMHIs2sBZhPAwdm1GDuSDIfBEk0Yh4owYYRcy8i/4d4JdpC1PI+XrMvgX6N3Hdu/QNIuHNNmLThVgAAAABJRU5ErkJggg==" alt="Glyphr Studio" class="family-link__img">
					<span class="family-link__name">Glyphr Studio</span>
				</a>
				<a href="https://www.glyphrstudio.com/fontfluxjs" target="_blank" rel="noopener" class="family-link">
					<img src="data:image/png;base64,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" alt="Font Flux JS" class="family-link__img">
					<span class="family-link__name">Font Flux JS</span>
				</a>
				<a href="https://www.glyphrstudio.com/fontdiff" target="_blank" rel="noopener" class="family-link">
					<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAEAYAAAD6+a2dAAAABGNJQ1AJEAAAOiQTaAAAAAlwSFlzAAAuIwAALiMBeKU/dgAACoFJREFUeJztnVmMVEUUhofFOBiXAZFElLC4wAOgJqgvJEriChoQ4xowmBBRXKLiEhQ1KkGFqEQwKjwQfAFcIhLAqICaKEsEN9AouIvgvgCCiQg+/PMx6UOfuff2rbv0yP/yZ3r6dldXnVvnnL9O1W3X1KGpQ1OHhpKjVy/x0KHiPn3E3bu3zmDLltb5yy/FS5eKv/46RKvrAe3KYQDt2olPPlk8fLh4xAjxSSfl254PPxQvXCh++WXxBx+I9+7Ntz3ZoSADYMAvvVT8wAPiE0/MuyXJsHGj+J57xM8/L65fg8jZAIYMEU+dKh40KNn1e/aIP/pIvHmz2E7pW7dWXnf00WLrIo49VjxwoLh9+2Ttefdd8R13iN98M9n1xSNjA+jdW/zkk+Lzz4933c6d4ldfFTMVL1ki/vXXMO0DXbuKhw0T44LOO0/cqVO8z3nlFfH114u/+ipM+7JDRgZw5pniF14QH3lk6+//7jvxffeJ588X79oVumXJwMBffrn4/vvFPXq0fh0GevHF4rfeCt+2MOjQ2L6xfWPCic/HtdeK580TH3po9ff98Yf43nvFo0eL164V794dqkXpQDsI/p5+Wvznn+JTTxU3NlZed8gh4lGjxD/9JF63Lpt21o6UBtCxo3jGDDF3iOdLn31WTDq3fLm4LAMeBdq5cqV49mwxMYXNVuiHCy4QH3WU+LXXxMQ0xSGlATzxhBifZ8EPvP128Z13ioue2kOB30GMsn27+OyzxWQ74LTTxF26iIkZikONBjBunJj0zWLbNvHIkWLu/LaOVavEZAcXXig++ODK92EIZCvFuYaEQSDB3euvi3EBgIEfPFi8fn3K9mWEvJTFL74Qoxccdljl5+BSzjpLnH+wGNMASOewbBvVM9Xj64qe2sqmLJIO0o8WZA0Elfmljx2j39LQ0JLHe+kcQkhRA192ZdEbeEC/zpwpRo/IHhEzAMrdihXV/49vHzNGnLck2taURXDLLeLp02u7Pj4cA6Dha9aIbceSxx93nPi337JqYCUOKIth2tcCxwAuu0yMImfBlD9tWugGVUdbVRYfe0zc1NT6ddkpi8YA8KWffSY+4YTKt9Ox+Na//w7VkOpAWURoslkHYEaaMqXy/Vm3Ly3QA8gajjii9feTNdxwg/iZZ9K2wPgoomY78IA7KquOZYCZ4p96qvJ1C2IQXBEzUtkHHuA68flRoB+QpAkavf6JhjEAfJUFPtRzCaFA0DN+fPX/E7TddpuY4DOvGCQrLFgg9lyUF1wTGzz+eK3fbAyAPNmC4CkrH4qy6EnKCEzoDI8+Kq7fQoxK2CDVguCPfrDAJVxzTdJvbjYAlDFPICFqDg2CO6YyC6ssFi0wZQ2vn1Eq0TlYc7DAdZ5xRtxvbDYAJFGLf/8Vky6FAukcUb31YUz1RMtllZRDg372VgkxBPrFzoD044sviqMEqH0GwAdbbNggDp0nl11ZLAq//CL2DJ5xonqZfrKwyqKPZouxix0AZSwUUO48AYeonvzYgrSQ9CkUUALJHlits+DO/OYb8aefikmb8eVp8f33YuuS7TgRC6E8UlgDmNlxtfvXLEYYAFJoWqAsItlakMeTDnnB3a23ir00tVbMmSP+/ffK70mKl14Sk8X88ENtn+P1ux0n+unmm8UsP1thiX4//fTK6/a5gKwN4JJLxJ5Wj4BT7+ncRReJP/mk8u+kiGsAgH576KHq/2eVkXFoQcQMYBdBkgJl8cEHq/8fZRHlrlYMGJDuejsDWVDJxNoIvviUU8Rjx4qRejt3Fs+dK377bfHPP8drT1IDAPTjjTeKWZwCjEPLfoZg5aDVkZeySLBaK0fFOh9/LEaDx2XcdJOYmW3TpsrrKAC5++7o3xAC6DQU21og4bfEFs0G4Fkcy561omhlMS8w5eOLLYgJohZ9QFqXHKUstoxLhAFETTlRKEpZLAqkrcws4KCDxMcfH+9z0hpAlLLYMi4ZGUBRymLRILp+//3q//f0FotQQbnXz7jmnj07tv7BNoiIi7yVRYKtuGCVcfXqsO0ABLcW0cqccMwx1V9PagBWWbQVSkOHNhsA69EWRNcoS3EVwbyVxauuSvZ+puqsDGDHjuqv26pgCyqJvKzGGycPVlm0M3KfPs0WgbRogcUkLVLMS1ksK3r2rP56VEkX/ezVEnrjFAWURYvu3Zu/iBMxOBjBwgvmPGQtLFmQf8dl8uCs0Ldv9dfZJ+DB62f2JiJBJ4Uf4xlL84KGc88Vxy1mzNsA0BHiMrFIaKAHoL1bfP559dfZTEo/W6QNmmMbAEehWNBAliGjkJWyWFYw5Xs1eosWiT0XSBGud4N54xIXvgGYdXimGo5CsRsr2P3L9u96qb1Li/79xeTXpLkEa0jBNsj75x8xJWwWDLi3x5Jx8FxzehgDII9FSrRKHQcjoDV7ZeFYnJWA0yqLReHhh5O9nxuDtQUrEQNPswecRZS29M13yU60SZDEgQ0Wd90l9tbls1IWyw72/TNjUL1rQb9NnFj9/+zBDBWs+gbglBMjHFBxYreGoWlTjWq3hmVlABSKhC4IAegDnk5Bv3z7rZgpmjuck0M8sDpK9bO3NkC/hyp6TWwA4I03xHSMreRBgKGihgqV0Moi8O6oUFi2rJJDY8IEsa3cAeT5oU8b85XFwNvDqUghSKL2z76vWzdxaEWwrEAaX7xYbE8OyWp7OMrijz+KrcA0fnzMegAaxN40e6YPH0x24AketSqL9QqyBIJpO/D0I/0aevNntLKYsCCEggg2Ilgcfrj4uefE3g9KqizWG7jj33lH7K0BsBEmq5NBopXFGiuCEDzsFA8wBG/1K6myWHZwZ5PvM9V7A0+59qxZ2bQnvrKYsiSMChjPEDwkVRbLCrIRlqPRRexUDxj4uJtBa0V8ZTHwSaHs8Yu7a5ViTJaPKcsuK+hQBBzyeC+dw8cz1Wd1xwPaR3pqsy5e79dPHLwoFNfAOXlRUT4dxzr31VeLy+IamKloFx34yCNib+D53Zz+lfXAg+TKYkkPi6ZW0B7pgm/N6kgXdh9TNJk0ViGPJ0jO67QvXBHZlzVM0vf9N4bkfFw8vs/b+hUFdAQqXCh08M7rA965fwgkpGv1dlw8sQYxiCcwsSVv//YV9MAI7pS4M0JZgAuYNEnM7uaizikg6/AW5ehnX3cpyACilEU6lCk0bjVtKJAn20fGsCxb9MEU4ZTFgp8ZxEEGaO/e0bMcjIAhZP3QqFpLr7IGrsoTmJIfPVuSh0aRPnqLPRjCFVeIay2OrFdwxyMpewIT/Rg/6wj8wIhawWnZnKdv9+dz2vaVV4r/+kvM6dxtDVZZZC+iPXUcoLtMnpz0m0piAICCCmICawh0zDnniHEFTHX1vtWMdA49BQOIqywmfwBFyQyAH8AUzwELHLFq0zQ2OjD1EZy995647E8iQV/gQAoqgMjXLfg9110n5o6v/ckjJYkBotBWjopFWUSrpxg0qlAmt6Niyw7SR6Y+bw+ixQFl0UOdGYAFMwNn4JD3xsUBZbHODQAQJHEGDkehlOWBER6KVxbbiAFYYBAEifaRMeyPzwvlVRbbqAFEgaJV1iL+r8piQ8N//YRFJMoUV3EAAAAASUVORK5CYII=" alt="FontDiff" class="family-link__img">
					<span class="family-link__name">FontDiff</span>
				</a>
				<a href="https://www.glyphrstudio.com/unicodeninja" target="_blank" rel="noopener" class="family-link">
					<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABAEAYAAAD6+a2dAAAABGNJQ1AJEAAAOiQTaAAAAAlwSFlzAAAuIwAALiMBeKU/dgAABHtJREFUeJztnEtIFVEcxvOVgg9spabgIxIigtCFaboIWwgudCMISUELpaAWiSaI9EARdOWmXElB4sJFiBIklT02KvRaZEVQiWK2ECLNRaW1+OaD7ngnZ+bOmbn3nv9v8+OOZ+b8cz7nzpw5p4TspOyk7KQ9gqYkBl2AECwSAM2RAGiOBEBzJACaIwHQHAmA5kgANEcCoDkSAM2RAGiOBEBzJACaIwHQHAmA5iRDKSlqDr+1BW9vu9s/0QhokqIZC79+hX5OSFDTz58/9tqx/4oKuLwczssL9e/f8Js38MJC6OfVVbv9GgH4+dNegU6pr4fv3XO3f1UV/OyZN/WYMZ9wt0G14vJleGAg/M8zM+GODrilBS4ujqzf2Vn47Fn47VurlvIVEAjHj8OvX8M9PXCkJ54cOwa/fAl3dcHJyeaWEgBfaWuDnz6FvTrhVqSmwv398NCQuYUEwBd4ab95E04M6PfOAB46xC0SAKXU1cG3bsGqbjLtwpvpwUFu2fGdIHjJiRNBVxAe3pzX1MgVQGsqKiQAWlNcLAEIhPfv4fPnYQ781NbCvb2weaDKa0pK5B7AV6an4aYm+Pv38O0ePYIfPoRnZtTUI1cAn7l4EbY68WYeP4bv31dSjgTALzgUzku/Uzhw5DV790oAfIFj825ZXvamjp1IAHyBb+fcsrbmTR07ifIApKcHXYE3RBoAu6+TnRPlAcjNDboCb/j2LegKrFAcgIyMyPaPlwCo+wuOFMUByM+PbP+DB72pQ7DCCICqhB4+7G6/ffvg5mbvahHCYQRgZUXN4U+dgp1eytvb4Xi5CYxejAB8/Kjm8GlpMIdAy8pg83vx/fvh4WG4u1tNPYIZ410AA1BTo6abI0fg589hDoX++AFztqtfLC7+f3thoX+1BItxBfj0yd9us7Jgv0785CRcWQlbzcXjdrabmlJbV/AYAXj3LtgyVHHtGtzYCJuHZIuKQk3YrqEBvn5dRXXRgBGAu3fhDx+CK+V/fP3qrP2dO/DVqzCfck6fhr98gXnlo7md7bjflSvw6KizOqIfIwBcGNLZGVwp4RgZgW/csNd+fR02/zv4VHH7NpyTE35/bme7S5dCf84FHOwn9jENBE1MwE+e+F/Kv4yPw62tsN1xigcPYP4lFxTAnGHjlL6+0OPwuJyoEfuYAsBf9JkzsKr30Ga4JIsniuMHXFtoF660IdXVMBdIOIX7cSWPVT+xi8VQMB+HOK35wgV4c9Pb7l+9gvn4ySVSbufCLS2FfvbqKYPjFFb9xC4Jzv63cD4fnzwJc6jXbC5A4CWTfvECHhuDuap1N0pLQ20FV8fypo4B5hw7t/A4nKJ14ADM8Y3d4OJWt+/1OZLKNX/e4TAAsQaXvc/Pw0ePOtufiys5a1f1LF3/ifL5AJHCE8Z7is+f7e3HdlzTF38nnsT5FcAM1+OfOwfzL5vMzcF87NzY8Keu4NAsAIKZOP8KEHZDAqA5EgDNkQBojgRAcyQAmiMB0BwJgOZIADRHAqA5EgDNkQBojgRAc/4CShQH3HwvetIAAAAASUVORK5CYII=" alt="Unicode Ninja" class="family-link__img">
					<span class="family-link__name">Unicode Ninja</span>
				</a>
			</div>
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
