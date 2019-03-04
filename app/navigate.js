
app.pageTabs = {
	'Welcome' : '☺ Welcome!',
	'Ranges' : '▦ Selected ranges',
	'Favorites' : '★ Favorites',
	'Search' :  '<span class="searchIcon">⚲</span> Search results',
	'Settings' : '⛭ Settings',
};

function makeContent() {
	let con = '';

	if(app.settings.charSearch) con += makeCharSearchResults();	
	else if (app.settings.selectedPage === 'Welcome') con += makePageWelcome();
	else if (app.settings.selectedPage === 'Ranges') con += makePageRanges();
	else if (app.settings.selectedPage === 'Favorites') con += makePageFavorites();
	else if (app.settings.selectedPage === 'Settings') con += makePageSettings();

	con += '<br><br>';

	return con;
}

function makeTabs() {
	return makeRangeTabs() + makePageTab();
}

function makePageTab() {
	return `<button id="pageTab">${app.pageTabs[app.settings.selectedPage]}</button>`;
}

function showPageChooser() {
	let entryPoint = document.getElementById('pageTab');

	let popup = document.createElement('div');
	popup.setAttribute('id', 'pageChooser');

	popup.innerHTML = `
	`;
}