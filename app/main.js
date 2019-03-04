let app = {
	version: '2.4.2',
	releaseDate: 1548190000000,
	rangeCache: {},
	focusID: false,
	settings: {
		charSearch: '',
		rememberSettings: false,
		maxSearchResults: 1000,
		selectedPage: 'Welcome',
		selectedTab: 'Grouped',
		selectedRanges: ['r-0020-007F'],
		genericFontFamily: 'sans-serif',
		favorites: [],
	}
};

function init(){
	loadSettings();
	document.getElementById('charSearchBar').innerHTML = makeCharSearchBar();
	document.getElementById('tabs').innerHTML = makeTabs();
	// document.getElementById('content').innerHTML = makeContent();
	document.getElementById('chooser').innerHTML = makeRangeChooser();
	animateLogo();
}

function loadSettings() {
	let savedSettings = window.localStorage.getItem('unicode.ninja');
	if(savedSettings) {
		savedSettings = JSON.parse(savedSettings);
		app.settings.charSearch = savedSettings.charSearch || '';
		app.settings.rememberSettings = savedSettings.rememberSettings || false;
		app.settings.maxSearchResults = savedSettings.maxSearchResults || 1000;
		app.settings.selectedPage = savedSettings.selectedPage || 'Welcome';
		app.settings.selectedTab = savedSettings.selectedTab || 'Grouped';
		app.settings.selectedRanges = savedSettings.selectedRanges || ['r-0020-007F'];
		app.settings.genericFontFamily = savedSettings.genericFontFamily || 'sans-serif';
		app.settings.favorites = savedSettings.favorites || [];
	}
}

function saveSettings() {
	if(!app.settings.rememberSettings) return;
	window.localStorage.setItem('unicode.ninja', JSON.stringify(app.settings));
}

function testNoGlyph() {
	document.getElementById('content').innerHTML +=`<br><br>
		<div class="charTile" id="testnoglyph">&#x10FFFF;</div><br>
		<textarea id="testtext"></textarea><br>
		<canvas id="testcanvas"></canvas>
	`;

	let ng = document.getElementById('testnoglyph').innerHTML;
	document.getElementById('testtext').innerHTML = ng;
	let ctx = document.getElementById('testcanvas').getContext('2d');
	ctx.font = "120px Arial";
	ctx.fillText(ng, 0, 120);
}

/*
	Range and Character data
*/

function getRange(rid) {
	// if(!unicodeBlocks[rid]) console.warn(`Unknown range: ${rid}`);
	return unicodeBlocks[rid];
}

function getRangeForChar(hex) {
	hex = parseInt(hex, 16);
	for(let r in unicodeBlocks) {
		if(unicodeBlocks.hasOwnProperty(r)) {
			if(hex >= unicodeBlocks[r].begin && hex <= unicodeBlocks[r].end)
				return unicodeBlocks[r];
	}}

	return false;
}

function getDataForChar(hex) {
	hex = ''+hex;
}

function isRangeSelected(rid) {
	return app.settings.selectedRanges.includes(rid);
}

function selectRange(rid) {
	// if(typeof rid === 'string') rid = [rid];
	rid = rid.split('_');
	
	rid.forEach(id => {
		if(!isRangeSelected(id)) app.settings.selectedRanges.push(id);
	});

	sortSelectedRanges();
	saveSettings();
}

function deselectRange(rid) {
	// if(typeof rid === 'string') rid = [rid];
	rid = rid.split('_');

	rid.forEach(id => {
		let i = app.settings.selectedRanges.indexOf(id);
		if(i > -1) app.settings.selectedRanges.splice(i, 1);
	});

	sortSelectedRanges();
	saveSettings();
}

function deselectAllRanges() {
	app.settings.selectedRanges = [];
	redraw();
	saveSettings();
}

function sortSelectedRanges() {
	app.settings.selectedRanges.sort(function (a, b) {
		return parseInt(a.substr(2, 4), 16) - parseInt(b.substr(2, 4), 16);
	});		
}


/*
	Making UI Content
*/

function redraw(onlyContent) {
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

function animateLogo() {
	let delta = 0;
	let delay = 50;

	// let fancy = {
	//	 car: 'unicode.ninja'.split(''),
	//	 jay: ['j', 'ĵ', 'ǰ', 'ɉ'],
	//	 sub: ['̥', '̪', '͈', '̬', '̯', '͙', '̭', '', '̺', '͓', '̮', '͈', '͚']
	// };

	let fancy = {
		car: 'unicode.ninja'.split(''),
		jay: ['j', 'ĵ', 'ǰ', 'ɉ'],
		sub: ['̥', '̪', '͈', '̬', '̯', '͙', '̭', '', '̺', '͓', '̮', '͈', '͚', '','','','','','','','','','','','','',]
	};

	function makeLogo(delta) {
		let mod = fancy.car.length;
		re = '';
	
		for(let c=0; c<mod; c++) {
			if(c === 7) {
				re += '.';
			
			} else if (c === 11) {
				re += fancy.jay[(c+delta) % fancy.jay.length];
			
			} else {
				re += fancy.car[c];
				re += fancy.sub[(c+delta) % fancy.sub.length];
			}
		}
	
		return re;
	}

	function updateLogo() {
		var logo = makeLogo(delta);
		document.getElementById('logo').innerHTML = logo;
		document.title = logo;
		if(delta < fancy.car.length) {
			delta++;
			delay *= 1.05;
			window.setTimeout(updateLogo, delay);
		}
	}
	
	updateLogo();
}


/*
	Helper Functions
*/

function decToHex(d) { 
	let dr = Number(d).toString(16);
	while(dr.length < 4) { dr = '0'+dr; }
	return '0x' + dr.toUpperCase();
}

function getUnicodeName(c) {
	if(c.charAt(0) === '0'){
		return fullUnicodeNameList[c] || '{{no name found}}';
	} else {
		return c;
	}
}

function nbsp(text) {
	text = text.replace(/ /gi, '&nbsp;'); // Non-breaking space
	text = text.replace(/-/gi, '&#8209;'); // Non-breaking hyphen
	return text;
}

function getShipDate(){
	let time = '' + (new Date().getTime());
	let prefix = parseInt(time.substr(0, 5)) * 100000000;
	let day = (parseInt(time.charAt(5)) + 1) * 10000000;
	return prefix + day;
}

function findLongestName() {
	let max = 0;
	let result = [];
	let currName = '';

	// console.time('name');
	for(let point in fullUnicodeNameList) {
		if(fullUnicodeNameList.hasOwnProperty(point)) {
			currName = fullUnicodeNameList[point];
			if(!result[currName.length]) result[currName.length] = 1;
			else result[currName.length]++

			// if(currName.length > max) {
			//	 max = currName.length;
			//	 result.push({length: max, char: point, name: currName});
			// }
		}
	}
	// console.timeEnd('name');

	return result;
}