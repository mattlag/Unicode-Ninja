
app.pageTabs = {
	'Welcome' : '☺ Welcome!',
	'Ranges' : '▦ Selected ranges',
	'Favorites' : '★ Favorites',
	'Search' :  '⌕ Search results',
	'Settings' : '⛭ Settings and info',
};

function makeContent() {
	let con = '';

	if (app.settings.selectedPage === 'Search') con += makePageSearch();
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
	return `<button id="pageTab" onclick="togglePageChooser();">${app.pageTabs[app.settings.selectedPage]}</button>`;
}

function togglePageChooser() {
	let popup = document.getElementById('pageChooser');

	if(popup) {
		document.body.removeChild(popup);
		return;
	}

	let entryPoint = document.getElementById('pageTab');

	popup = document.createElement('div');
	popup.setAttribute('id', 'pageChooser');
	popup.style.top = entryPoint.offsetTop + 'px';
	popup.style.left = entryPoint.offsetLeft + entryPoint.offsetWidth + 'px';
	popup.style.display = 'block';

	function makePageChooserButton(page) {
		return `<button onclick="navigate('${page}');">${app.pageTabs[page]}</button>`;
	}

	popup.innerHTML = `
		${makePageChooserButton('Welcome')}
		${makePageChooserButton('Ranges')}
		${makePageChooserButton('Favorites')}
		${makePageChooserButton('Search')}
		${makePageChooserButton('Settings')}
	`;

	document.body.appendChild(popup);
}

function hidePageChooser() {
	let popup = document.getElementById('pageChooser');

	if(popup) document.body.removeChild(popup);
}

function navigate(pageName) {
	app.settings.selectedPage = pageName;
	hidePageChooser();
	redrawContent();
	saveSettings();
}


/*
	Making UI Content
*/

function redrawContent(onlyContent) {
	if(app.redrawTimeout) clearTimeout(app.redrawTimeout);

	app.redrawTimeout = setTimeout(function () {
		!onlyContent? document.getElementById('tabs').innerHTML = makeTabs() : false;
		!onlyContent? document.getElementById('chooser').innerHTML = makeRangeChooser() : false;
		document.getElementById('content').innerHTML = makeContent();
		
		if(app.focusID){
			let elem = document.getElementById(app.focusID);
			let value = elem.value;
			elem.focus();
			elem.value = '';
			elem.value = value;
		}		
	}, 10);
}

function appFocus(id) {
	app.focusID = id;
	// console.log(`Focused on ${app.focusID}`);
}