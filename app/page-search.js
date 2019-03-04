function makeCharSearchBar() {
	return `
		<div class="charSearchInputGroup">
			<span class="searchIcon">⚲</span>
			<input 
				type="text" 
				id="searchInput" 
				value="${app.settings.charSearch}" 
				onkeyup="updateCharSearch(this.value);"
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
	redraw();
}

function makeCharSearchResults() {
	// console.time('makeCharSearchResults');
	let results = searchCharNames(app.settings.charSearch);
	let isMaxed = results.length === parseInt(app.settings.maxSearchResults);
	
	let updateCharSearchStatus = function() {
		document.getElementById('charSearchStatus').innerHTML = `
			${isMaxed? 'Showing the first ' : ''}
			${results.length} result${results.length === 1? '' : 's'}
			<button onclick="clearSearch();">clear</button>
		`;
	};

	let con = '';
	con += `
		<div class="charSearchResults">
			<div class="columnHeader">&nbsp;</div>
			<div class="columnHeader">${nbsp('character name')}</div>
			<div class="columnHeader">${nbsp('code point')}</div>
			<div class="columnHeader">${nbsp('range name')}</div>
			<div class="columnHeader">${nbsp('favorites')}</div>
	`;

	results.map(function(value) {
		con += `
		<div class="rowWrapper" onclick="tileClick('${decToHex(value.char)}');">
			${makeTile(value.char, 'small')}
			<div class="charName">${value.result}</div>
			<div class="codePoint"><pre>${value.char.replace('0x', 'U+')}</pre></div>
			<div class="rangeName">${nbsp(getRangeForChar(value.char).name)}</div>
		</div>
		<div class="rowWrapper">
			<div class="charFavorite" id="row_fav_${value.char}">${makeFavoriteButton(value.char)}</div>
		</div>
		`;
	});
	con += '</div>';

	setTimeout(updateCharSearchStatus, 20);

	// console.timeEnd('makeCharSearchResults');
	return con;
}

function updateCharSearch(term) {
	app.settings.charSearch = term;
	saveSettings();
	redraw();
}

function searchCharNames(term) {
	term = term.toUpperCase();
	let count = 0;
	let currName;
	let currPos;
	let results = [];
	let currResult;

	// console.time('charNameSearch');
	for(let point in fullUnicodeNameList) {
		if(count < app.settings.maxSearchResults) {
			if(fullUnicodeNameList.hasOwnProperty(point)) {
				currName = fullUnicodeNameList[point];
				currPos = currName.indexOf(term);

				if(currPos > -1) {
					currResult = `<span>${nbsp(currName.substring(0, currPos))}</span>`;
					currResult += `<span class="highlight">${nbsp(term)}</span>`;
					currResult += `<span>${nbsp(currName.substring(currPos + term.length))}</span>`;
					
					results.push({char: point, result: currResult});
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
