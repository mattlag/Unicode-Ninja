app.menu = {
	Ranges: 'Unicode ranges',
	Search: 'Search results',
	Favorites: 'Favorites',
	Settings: 'Settings',
};

function makePageContent() {
	let con = '';

	let selectedPage = app.settings.selectedPage;
	if (selectedPage === 'Search') con += makePageSearch();
	else if (selectedPage === 'Ranges') con += makePageRanges();
	else if (selectedPage === 'Favorites') con += makePageFavorites();
	else if (selectedPage === 'Settings') con += makePageSettings();

	con += '<br><br>';

	return con;
}

function toggleMenu() {
	let popup = document.getElementById('menu');

	if (popup) {
		document.body.removeChild(popup);
		return;
	}

	let entryPoint = document.getElementById('menuButton');

	popup = document.createElement('div');
	popup.setAttribute('id', 'menu');
	popup.style.top = entryPoint.offsetTop + entryPoint.offsetHeight + 'px';
	popup.style.left = entryPoint.offsetLeft + 'px';
	popup.style.display = 'block';

	function makePageButton(page) {
		return `<button onclick="navigate('${page}');">${nbsp(app.menu[page])}</button>`;
	}

	popup.innerHTML = `
		${makePageButton('Ranges')}
		${makePageButton('Search')}
		${makePageButton('Favorites')}
		${makePageButton('Settings')}
	`;

	popup.addEventListener('mouseleave', toggleMenu);
	document.body.appendChild(popup);
}

function hideMenu() {
	let popup = document.getElementById('menu');

	if (popup) document.body.removeChild(popup);
}

function navigate(pageName) {
	app.settings.selectedPage = pageName;
	hideMenu();
	if (pageName !== 'Search') clearSearch();
	redrawContent();
	saveSettings();
}

/*
	Making UI Content
*/

function redrawContent() {
	if (app.redrawTimeout) clearTimeout(app.redrawTimeout);
	const onRanges = app.settings.selectedPage === 'Ranges';

	let chooserScrollTop = 0;
	if (onRanges) {
		let chooserScrollArea = document.querySelector('.rangeGrid');
		if (chooserScrollArea) chooserScrollTop = chooserScrollArea.scrollTop;
	}

	app.redrawTimeout = setTimeout(function () {
		document.getElementById('content').innerHTML = makePageContent();

		if (chooserScrollTop) {
			let chooserScrollArea = document.querySelector('.rangeGrid');
			chooserScrollArea.scrollTop = chooserScrollTop;
		}

		if (app.focusID) {
			let elem = document.getElementById(app.focusID);
			let value = elem.value;
			elem.focus();
			elem.value = '';
			elem.value = value;
		}
	}, 10);
}

function redrawRangesDisplay() {
	const rangesArea = document.getElementById('rangesDisplay');
	rangesArea.innerHTML = makeRangesDisplay();
}

function appFocus(id) {
	app.focusID = id;
}
