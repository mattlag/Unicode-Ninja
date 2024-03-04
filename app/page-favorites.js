function makePageFavorites() {
	return makeGridView(app.settings.favorites);
}

function addToFavorites(cid) {
	if (!isFavorite(cid)) {
		app.settings.favorites.push(cid);
		app.settings.favorites.sort(function (a, b) {
			return parseInt(a, 16) - parseInt(b, 16);
		});
	}
}

function removeFromFavorites(cid) {
	let pos = app.settings.favorites.indexOf(cid);

	if (pos > -1) {
		app.settings.favorites.splice(pos, 1);
	}
}

function isFavorite(cid) {
	return app.settings.favorites.indexOf(cid) > -1;
}

function makeFavoriteButton(cid) {
	if (isFavorite(cid)) return makeCurrentFavoriteButton(cid);
	else return makeAddFavoriteButton(cid);
}

function makeAddFavoriteButton(cid) {
	return `
		<button 
			class="addFavorite" 
			onClick="clickAddFavorite('${cid}');"
			title="Click to add to favorites" 
			>
			☆&nbsp;add&nbsp;to&nbsp;favorites
		</button>
	`;
}

function clickAddFavorite(cid) {
	addToFavorites(cid);
	app.settings.rememberSettings = true;

	// Update buttons
	let fav = document.getElementById(`fav_${cid}`);
	let row = document.getElementById(`row_fav_${cid}`);
	if (fav) fav.innerHTML = makeFavoriteButton(cid);
	if (row) row.innerHTML = makeFavoriteButton(cid);
}

function makeCurrentFavoriteButton(cid) {
	return `<button 
		class="favorite" 
		onClick="clickRemoveFavorite('${cid}');"
		title="Favorited\nClick to un-favorite" 
		>
		★&nbsp;favorite
	</button>`;
}

function clickRemoveFavorite(cid) {
	removeFromFavorites(cid);
	app.settings.rememberSettings = true;

	// Update buttons
	let fav = document.getElementById(`fav_${cid}`);
	let row = document.getElementById(`row_fav_${cid}`);
	if (fav) fav.innerHTML = makeFavoriteButton(cid);
	if (row) row.innerHTML = makeFavoriteButton(cid);
}
