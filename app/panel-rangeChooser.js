function makeRangeChooser() {
	let grouped = app.settings.selectedTab === "Grouped";
	let con = `
		<div class="rangeGrid">
		${grouped ? makeGroupedChooser() : makeFlatChooser()}
		<br>
		</div>
		<div class="chooserOptions">
			${makeChooserOptions()}
		</div>
	`;
	return con;
}

function selectRangeTab(tab) {
	app.settings.selectedTab = tab;
	redrawContent();
}

function makeChooserOptions() {
	let grouped = app.settings.selectedTab === "Grouped";
	let con = "";
	if (grouped) con += `<button onclick="selectRangeTab('Sorted');">grouped list</button>`;
	else con += `<button onclick="selectRangeTab('Grouped');">sorted list</button>`;

	con += `
		<button onClick="deselectAllRanges();">
			de-select all ranges
		</button>
	`;

	return con;
}

function makeFlatChooser() {
	let con = "<h2>Unicode</h2>";

	for (let rid in unicodeBlocks) {
		if (unicodeBlocks.hasOwnProperty(rid)) {
			con += makeSingleRangeRow(rid, unicodeBlocks[rid].name, "");
		}
	}

	return con;
}

function makeGroupedChooser() {
	function makeArea(area) {
		console.log(area);
		let con = "";
		let sub, multiSelect;
		for (let section in area) {
			if (area.hasOwnProperty(section)) {
				con += `<h3>${section}</h3>`;
				for (let group in area[section]) {
					if (area[section].hasOwnProperty(group)) {
						if (typeof area[section][group] === "string") {
							con += makeSingleRangeRow(area[section][group], group);
						} else {
							sub = "";
							multiSelect = [];
							for (let block in area[section][group]) {
								if (area[section][group].hasOwnProperty(block)) {
									sub += makeSingleRangeRow(area[section][group][block], block, "&emsp;");
									multiSelect.push(area[section][group][block]);
								}
							}
							con += makeSingleRangeRow(multiSelect.join("_"), group, undefined, true);
							con += sub;
						}
					}
				}

				con += '<div class="skipRow">&nbsp;</div>';
			}
		}
		con += "<br><br>";
		return con;
	}

	return `
		<h2>Unicode Scripts</h2>
		${makeArea(organizedScriptsV2)}
		<div class="skipRow">&nbsp;</div>
		<div class="skipRow">&nbsp;</div>
		<h2>Unicode Symbols</h2>
		${makeArea(organizedSymbolsV2)}
	`;
}

function makeSingleRangeRow(rid, name, indent, group) {
	console.log('makeSingleRow');
	console.log(`\t rid: ${typeof rid} ${rid}`);

	let checkboxID = `checkbox_${group ? "g_" : ""}${name.replace(/ /gi, "_")}`;
	let range = getRange(rid) || false;

	let labelName = name;
	labelName = labelName.replace(/Extended/gi, "Ext.");
	labelName = labelName.replace(/Miscellaneous/gi, "Misc.");
	labelName = labelName.replace(/Mathematical/gi, "Math.");
	labelName = labelName.replace(/Punctuation/gi, "Punct.");
	labelName = labelName.replace(/Supplemental/gi, "Supp.");
	labelName = labelName.replace(/Supplement/gi, "Supp.");
	labelName = labelName.replace(/Unified/gi, "Uni.");
	labelName = labelName.replace(/Characters/gi, "Chars.");
	labelName = labelName.replace(/Combining/gi, "Combo.");
	labelName = labelName.replace(/Canadian/gi, "Can.");
	labelName = nbsp(labelName);

	function makeCheckbox() {
		return `<input 
			type="checkbox" 
			id="${checkboxID}" 
			title="${name}" 
			data-range="${rid}" 
			onchange='checkboxOnChange(this);'  
			${isRangeSelected(rid) ? "checked" : ""}
		/>`;
	}

	let nonstandardNote = '<div class="note" title="Default sans-serif font may not\nbe able to display this range">⊘</div>';
	let noGlyphsNote = '<div class="note" title="Range contains no characters\nwith visible shapes.">⊝</div>';
	if (group) {
		return `
			${makeCheckbox()}
			<label 
				for="${checkboxID}" 
				title="${name}"  
				class="group"
			>${labelName}</label>
		`;
	} else {
		return `
			${indent !== undefined ? `<div style="grid-column: 1;">${indent}</div>` : ""}
			
			${makeCheckbox()}
			
			<label 
				for="${checkboxID}" 
				title="${name}" 
				${indent || indent === "" ? "" : 'class="spanTwo" '}
			>${labelName}</label>

			<div class="count" title="Character count">
				${range && range.nonstandard ? nonstandardNote : ""}
				${range && range.noGlyphs ? noGlyphsNote : ""}
				${range ? parseInt(range.end) - parseInt(range.begin) + 1 : ""}
			</div>

			<pre title="Character range">${rid.substring(2)}</pre>
		`;
	}
}

function checkboxOnChange(elem) {
	// console.log('checkboxOnChange');
	const rangeID = elem.dataset.range;
	// console.log(rangeID);
	if (elem.checked) {
		selectRange(rangeID);
	} else {
		deselectRange(rangeID);
	}

	if (!app.settings.responsiveChooserIsOpen) {
		if (app.settings.selectedPage !== "Ranges") navigate("Ranges");
	}
}
