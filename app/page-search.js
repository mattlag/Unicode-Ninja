function makeCharSearchBar() {
	return `
		<div class="charSearchInputGroup">
			<span class="searchIcon">⌕</span>
			<input 
				type="text" 
				id="searchInput" 
				value="${app.settings.charSearch}" 
				onkeyup="charSearchBarOnChange(this.value);"
				onfocus="appFocus('searchInput');"
				onblur="appFocus(false);"
			/>
			${makeCloseButton('clearSearch();')}
		</div>
		<div id="charSearchStatus"></div>
	`;
}

function makeCloseButton(func) {
	return `<button onclick="${func}" class="actionButton" title="Close">⨉</button>`;
}

function clearSearch() {
	app.settings.charSearch = '';
	document.getElementById('searchInput').value = '';
	document.getElementById('charSearchStatus').innerHTML = '';
	saveSettings();
	redrawContent();
}

function makePageSearch() {
	// console.time('makePageSearch');
	let results = searchCharNames(app.settings.charSearch);
	let isMaxed = results.length === parseInt(app.settings.maxSearchResults);

	let updateCharSearchStatus = function () {
		document.getElementById('charSearchStatus').innerHTML = `
			${isMaxed ? 'Showing the first ' : ''}
			${results.length} result${results.length === 1 ? '' : 's'}
			<button onclick="clearSearch();navigate('Ranges');">Back to Unicode ranges</button>
		`;
	};

	setTimeout(updateCharSearchStatus, 20);

	// console.timeEnd('makePageSearch');
	return makeGridView(results);
}

function charSearchBarOnChange(term) {
	app.settings.charSearch = term;
	saveSettings();

	if (app.settings.selectedPage === 'Search') redrawContent();
	else navigate('Search');
}

function searchCharNames(term) {
	if (!term) return [];

	term = term.toUpperCase();
	let count = 0;
	let currName;
	let currPos;
	let results = [];
	let currResult;

	// console.time('charNameSearch');
	for (let point in unicodeNamesListBMP) {
		if (count < app.settings.maxSearchResults) {
			if (unicodeNamesListBMP.hasOwnProperty(point)) {
				currName = unicodeNamesListBMP[point];
				currPos = currName.indexOf(term);

				if (currPos > -1) {
					currResult = `<span>${nbsp(currName.substring(0, currPos))}</span>`;
					currResult += `<span class="highlight">${nbsp(term)}</span>`;
					currResult += `<span>${nbsp(currName.substring(currPos + term.length))}</span>`;

					results.push({ char: point, result: currResult });
					count++;
				}
			}
		} else {
			// console.timeEnd('charNameSearch');
			return results;
		}
	}
	// console.timeEnd('charNameSearch');
	return results;
}
