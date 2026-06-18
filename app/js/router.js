/**
 * router.js — minimal hash-based router.
 *
 * Routes:
 *   #/                      landing
 *   #/explore               explorer (last/selected ranges)
 *   #/range/<rid>           explorer focused on a range, e.g. #/range/r-0020-007F
 *   #/char/<hex>            single character, e.g. #/char/1F600
 *   #/search/<query>        search results (query is URI-encoded)
 *   #/favorites             favorites
 *   #/settings              settings
 */

let routeHandler = () => {};

export function parseHash(hash = window.location.hash) {
	const clean = hash.replace(/^#\/?/, '').trim();
	const segments = clean.split('/').filter(Boolean).map(decodeURIComponent);

	if (segments.length === 0) return { name: 'landing', params: {} };

	const [head, ...rest] = segments;
	switch (head) {
		case 'explore':
			return { name: 'explore', params: {} };
		case 'range':
			return { name: 'explore', params: { rid: rest.join('/') } };
		case 'char':
			return { name: 'char', params: { hex: rest[0] || '' } };
		case 'search':
			return { name: 'search', params: { query: rest.join('/') } };
		case 'favorites':
			return { name: 'favorites', params: {} };
		case 'settings':
			return { name: 'settings', params: {} };
		default:
			return { name: 'landing', params: {} };
	}
}

/** Build a hash string for a route (use with navigate). */
export function path(name, params = {}) {
	switch (name) {
		case 'landing':
			return '#/';
		case 'explore':
			return params.rid ? `#/range/${params.rid}` : '#/explore';
		case 'char':
			return `#/char/${params.hex}`;
		case 'search':
			return `#/search/${encodeURIComponent(params.query || '')}`;
		case 'favorites':
			return '#/favorites';
		case 'settings':
			return '#/settings';
		default:
			return '#/';
	}
}

/** Navigate by setting the hash (adds a history entry). */
export function navigate(name, params = {}, { replace = false } = {}) {
	const target = path(name, params);
	if (replace) {
		window.history.replaceState(null, '', target);
		handleRoute();
	} else if (window.location.hash !== target) {
		window.location.hash = target;
	} else {
		// Same hash — re-render anyway (e.g. clicking the active nav item).
		handleRoute();
	}
}

export function getRoute() {
	return parseHash();
}

function handleRoute() {
	routeHandler(parseHash());
}

export function startRouter(handler) {
	routeHandler = handler;
	window.addEventListener('hashchange', handleRoute);
	handleRoute();
}
