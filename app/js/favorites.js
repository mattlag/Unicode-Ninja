/**
 * favorites.js — the favorites view (route #/favorites).
 */

import { settings } from './state.js';
import { charList } from './tiles.js';

export function renderFavorites() {
	const count = settings.favorites.length;
	return `
	<div class="list-page">
		<header class="page-head">
			<h1>Favorites</h1>
			<p class="page-head__sub">${count ? `${count} saved character${count === 1 ? '' : 's'}.` : 'Star characters anywhere to collect them here.'}</p>
		</header>
		${charList(settings.favorites, 'No favorites yet. Tap the ☆ on any character to save it.')}
	</div>`;
}
