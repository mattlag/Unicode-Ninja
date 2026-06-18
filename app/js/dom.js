/**
 * dom.js — tiny DOM/HTML helpers.
 */

export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export function on(target, event, handler, opts) {
	target.addEventListener(event, handler, opts);
	return () => target.removeEventListener(event, handler, opts);
}

/** Escape a string for safe insertion into HTML text/attributes. */
export function esc(str) {
	return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** Replace spaces and hyphens with non-breaking equivalents. */
export function nbsp(text) {
	return String(text).replace(/ /g, '\u00A0').replace(/-/g, '\u2011');
}

/** Tagged template that escapes interpolated values; use html`...${value}...`. */
export function html(strings, ...values) {
	return strings.reduce((out, str, i) => {
		let v = values[i - 1];
		if (Array.isArray(v)) v = v.join('');
		return out + (v === undefined || v === null ? '' : v) + str;
	});
}

let toastTimer;
export function toast(message) {
	let el = qs('#toast');
	if (!el) {
		el = document.createElement('div');
		el.id = 'toast';
		document.body.appendChild(el);
	}
	el.textContent = message;
	el.classList.add('is-visible');
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => el.classList.remove('is-visible'), 1800);
}

export async function copyText(text) {
	try {
		await navigator.clipboard.writeText(text);
		toast(`Copied: ${text}`);
	} catch {
		// Fallback for non-secure contexts.
		const ta = document.createElement('textarea');
		ta.value = text;
		ta.style.position = 'fixed';
		ta.style.opacity = '0';
		document.body.appendChild(ta);
		ta.select();
		try {
			document.execCommand('copy');
			toast(`Copied: ${text}`);
		} catch {
			toast('Copy failed');
		}
		document.body.removeChild(ta);
	}
}
