function makeContent() {
	let con = '';

	if(app.settings.charSearch) con += makeCharSearchResults();	
	else if (app.settings.selectedPage === 'Welcome') con += makePageWelcome();
	else if (app.settings.selectedPage === 'Ranges') con += makePageRanges();
	else if (app.settings.selectedPage === 'Favorites') con += makePageFavorites();

	con += '<br><br>';

	return con;
}

function makeTabs() {
	return makeRangeTabs() + makePageTab();
}