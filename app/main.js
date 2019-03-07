let app = {
	version: '2.4.2',
	releaseDate: 1548190000000,
	rangeCache: {},
	focusID: false,
	dialogCloseFunctions: {},
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
	navigate('Welcome');
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