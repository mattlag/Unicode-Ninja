function makePageRanges() {
	let con = `

		<div id="rangesChooser">
			${makeRangeChooser()}
		</div>
		<div id="rangesDisplay">
			${makeRangesDisplay()}
		</div>

	`;

	return con;
}

function makeRangesDisplay() {
	con = `
		<button id="responsiveRangeChooserToggle" onClick="toggleResponsiveRangeChooser();">
			Show range chooser
		</button>
	`;

	if (app.settings.selectedRanges.length === 0) {
		con += nbsp("<i>Select ranges to view them here</i>");
	}

	for (let s = 0; s < app.settings.selectedRanges.length; s++) {
		con += getRangeBlock(app.settings.selectedRanges[s]);
	}

	return con;
}

function getRangeBlock(rid) {
	if (!app.rangeCache[rid]) app.rangeCache[rid] = makeRangeBlock(rid);
	return app.rangeCache[rid];
}

function makeRangeBlock(rid) {
	let range = getRange(rid);

	let rangeBeginBase = decToHex(range.begin).substring(2);
	if (rangeBeginBase === "0020") rangeBeginBase = "0000";

	let wikiHREF = `https://www.wikipedia.org/wiki/`;
	wikiHREF += `${range.name.replace(/ /gi, "_")}_(Unicode_block)`;
	let unicodeHREF = `https://www.unicode.org/charts/PDF/U${rangeBeginBase}.pdf`;
	let con = `
		<div class="contentCharBlock" id="${rid}">
			<h3 class="title">
				${range.name}
				<a href="${wikiHREF}" target="_new" title="Wikipedia Link" class="titleLink">Wikipedia</a>
				<a href="${unicodeHREF}" target="_new" title="Unicode Link" class="titleLink">Unicode</a>
			</h3>
			<div class="actions">
				${makeCloseButton(`clickRangeClose('${rid}');`)}
			</div>

			<div class="hex">&nbsp;</div>
			<div class="hex">0</div>
			<div class="hex">1</div>
			<div class="hex">2</div>
			<div class="hex">3</div>
			<div class="hex">4</div>
			<div class="hex">5</div>
			<div class="hex">6</div>
			<div class="hex">7</div>
			<div class="hex">8</div>
			<div class="hex">9</div>
			<div class="hex">A</div>
			<div class="hex">B</div>
			<div class="hex">C</div>
			<div class="hex">D</div>
			<div class="hex">E</div>
			<div class="hex">F</div>
	`;

	for (let c = range.begin * 1; c <= range.end * 1; c++) {
		if (c % 16 === 0) {
			let prefix = decToHex(c);
			prefix = prefix.substring(2, prefix.length - 1);
			con += `
				<div class="hex"><span>${prefix}-</span></div>
			`;
		}

		con += makeTile(decToHex(c));
	}

	con += `</div>`;

	return con;
}

function clickRangeClose(rid) {
	deselectRange(rid);
	redrawContent();
}

function makeTile(char, size) {
	size = size || "medium";
	let name = getUnicodeName(char);
	let con = `<div class="charTile ${size} noChar" title="No character encoded\nat this code point">&nbsp;</div>`;

	if (name !== "{{no name found}}") {
		con = `
			<div 
				class="charTile ${size}" 
				style="font-family: ${app.settings.genericFontFamily};${name === "<control>" ? ' color: #EEE;"' : '"'} 
				title="${getUnicodeName(char)}\n${char.replace("0x", "U+")}"
				${size === "medium" ? `onClick="tileClick('${char}');"` : ""}
			>&#${char.substring(1)};</div>
		`;
	}

	return con;
}

function makeCharDetail(char) {
	// console.log(`makeCharDetail: ${typeof char} ${char}`);

	let range = getRangeForChar(char);
	if (range.begin === 32) range.begin = 0x0000;
	// console.log(`range: ${JSON.stringify(range)}`);

	let rangeBeginBase = decToHex(range.begin).substring(2);
	// console.log(`rangeBeginBase: ${rangeBeginBase}`);

	let unicodeName = getUnicodeName(char).replace("<", "&lt;");
	// console.log(`name: ${name}`);

	let entityName = htmlEntityNameList[char];
	// console.log(`entityName: ${entityName}`);

	let charBase = char.substring(2);
	let charChar = String.fromCharCode(parseInt(charBase, 16));
	let charHex = `&amp;#x${parseInt(charBase, 16).toString(16)};`;
	let charDec = `&amp;#${parseInt(charBase, 16).toString(10)};`;

	let namedEntity = "";
	if (entityName) {
		namedEntity = `
			<span class="key light">
				${nbsp("HTML named entity:")}
			</span>
			<span class="value">
				<span class="copyCode">&amp;${entityName};</span>
			</span>
		`;
	}
	let con = `
	<h2>${unicodeName}</h2>
	<span id="fav_${char}">
		${makeFavoriteButton(char)}
	</span>
	<button class="copyButton" onclick="copyText('${charChar}');">Copy character</button>
	<button class="copyButton" onclick="copyText('${charHex}');">Copy HTML Hex entity</button>
	<button class="copyButton" onclick="copyText('${charDec}');">Copy HTML Decimal entity</button>
	<br><br><br>
	<div class="twoColumn">
			<div class="colOne">
				${makeTile(char, "large")}
			</div>
			<div class="colTwo">
				<div class="twoColumn">
					<span class="key light">${nbsp("HTML hex entity:")}</span>
					<span class="value"><span class="copyCode">${charHex}</span></span>

					<span class="key light">${nbsp("HTML decimal entity:")}</span>
					<span class="value"><span class="copyCode">${charDec}</span></span>

					${namedEntity}
				</div>
			</div>
		</div>
		<br><br>
		<h3>Unicode information</h3>
		<div class="twoColumn">
			<span class="key light">${nbsp("Unicode code point:")}</span>
			<span class="value"><pre>U+${charBase}</pre></span>

			<span class="key light">${nbsp("Member of range:")}</span>
			<span class="value">
				<pre>U+${decToHex(range.begin).substring(2)} - U+${decToHex(range.end).substring(2)}</pre>
				<span style="vertical-align: bottom; margin:2px; 0px 0px 10px;">
					${range.name}
				</span>
			</span>

			<span class="key light">${nbsp("More Info from Wikipedia:")}</span>
			<span class="value">
				<a
					href="https://www.wikipedia.org/wiki/${range.name.replace(/ /gi, "_")}_(Unicode_block)" 
					target="_new" 
					title="Wikipedia Link">
					wikipedia.org/wiki/${range.name.replace(/ /gi, "_")}_(Unicode_block)
				</a>
			</span>

			<span class="key light">${nbsp("More Info from Unicode:")}</span>
			<span class="value">
				<a href="https://www.unicode.org/charts/PDF/U${rangeBeginBase}.pdf" 
					target="_new" 
					title="Wikipedia Link">
					unicode.org/charts/PDF/U${rangeBeginBase}.pdf
				</a>
			</span>
		</div>
	`;

	return con;
}

function tileClick(char) {
	openDialog(makeCharDetail(char));
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
	for (let r in unicodeBlocks) {
		if (unicodeBlocks.hasOwnProperty(r)) {
			if (hex >= unicodeBlocks[r].begin && hex <= unicodeBlocks[r].end) return unicodeBlocks[r];
		}
	}

	return false;
}

function getDataForChar(hex) {
	hex = "" + hex;
}

function isRangeSelected(rid) {
	return app.settings.selectedRanges.includes(rid);
}

function selectRange(rid) {
	// if(typeof rid === 'string') rid = [rid];
	console.log(`selectRange: ${rid}`);
	rid = rid.split("_");

	rid.forEach((id) => {
		if (!isRangeSelected(id)) app.settings.selectedRanges.push(id);
	});

	sortSelectedRanges();
	saveSettings();
}

function selectAllRanges() {
	Object.keys(unicodeBlocks).forEach((id) => {
		if (!isRangeSelected(id)) app.settings.selectedRanges.push(id);
	});

	redrawContent();
}

function deselectRange(rid) {
	// if(typeof rid === 'string') rid = [rid];
	rid = rid.split("_");

	rid.forEach((id) => {
		let i = app.settings.selectedRanges.indexOf(id);
		if (i > -1) app.settings.selectedRanges.splice(i, 1);
	});

	sortSelectedRanges();
	saveSettings();
}

function deselectAllRanges() {
	app.settings.selectedRanges = [];
	redrawContent();
	saveSettings();
}

function sortSelectedRanges() {
	app.settings.selectedRanges.sort(function (a, b) {
		return parseInt(a.substring(2), 16) - parseInt(b.substring(2), 16);
	});
}

function toggleResponsiveRangeChooser() {
	let main = document.getElementById("content");
	let button = document.getElementById("responsiveRangeChooserToggle");

	if (button.innerText === "Show range chooser") {
		main.innerHTML = `
			<button id="responsiveRangeChooserToggle" onClick="toggleResponsiveRangeChooser();">
				Show selected ranges
			</button>
			<div class="responsiveRangesWrapper">
				<div class="responsiveRangesChooser">
					${makeRangeChooser()}
				</div>
				<div class="responsiveChooserOptions">
					${makeChooserOptions()}
				</div>
			</div>
		`;
		app.settings.responsiveChooserIsOpen = true;
	} else {
		app.settings.responsiveChooserIsOpen = false;
		navigate("Ranges");
	}
}
