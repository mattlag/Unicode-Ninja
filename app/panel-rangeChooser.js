function makeRangeChooser() {
	let grouped = app.settings.selectedTab === 'Grouped';
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
	let chooserScrollArea = document.querySelector('.rangeGrid');
	chooserScrollArea.scrollTop = 0;
	redrawContent();
}

function makeChooserOptions() {
	let grouped = app.settings.selectedTab === 'Grouped';
	let con = '';
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
	let con = '<h2>Basic Multilingual Plane</h2>';
	for (let rid in unicodeBlocks) {
		if (unicodeBlocks[rid].begin === 0x10000) con += '<h2>Supplementary Multilingual Plane</h2>';
		if (unicodeBlocks[rid].begin === 0x20000) con += '<h2>Supplementary Ideographic Plane</h2>';
		if (unicodeBlocks[rid].begin === 0x30000) con += '<h2>Tertiary Ideographic Plane</h2>';
		if (unicodeBlocks.hasOwnProperty(rid)) {
			con += makeSingleRangeRow(rid, unicodeBlocks[rid].name, '');
		}
	}

	return con;
}

function makeGroupedChooser() {
	function makeArea(area) {
		// console.log(area);
		let con = '';
		let sub, multiSelect;
		for (let section in area) {
			if (area.hasOwnProperty(section)) {
				con += `<h3>${section}</h3>`;
				for (let group in area[section]) {
					if (area[section].hasOwnProperty(group)) {
						if (typeof area[section][group] === 'string') {
							con += makeSingleRangeRow(area[section][group], group);
						} else {
							sub = '';
							multiSelect = [];
							for (let block in area[section][group]) {
								if (area[section][group].hasOwnProperty(block)) {
									sub += makeSingleRangeRow(area[section][group][block], block, '&emsp;');
									multiSelect.push(area[section][group][block]);
								}
							}
							con += makeSingleRangeRow(multiSelect.join('_'), group, undefined, true);
							con += sub;
						}
					}
				}

				con += '<div class="skipRow">&nbsp;</div>';
			}
		}
		return con;
	}

	return `
		<h2>Scripts</h2>
		${makeArea(organizedScriptsV2)}
		<h2>Symbols</h2>
		${makeArea(organizedSymbolsV2)}
	`;
}

function makeSingleRangeRow(rid, name, indent, group) {
	// console.log('makeSingleRow');
	// console.log(`\t rid: ${typeof rid} ${rid}`);

	let checkboxID = `checkbox_${group ? 'g_' : ''}${name.replace(/ /gi, '_')}`;
	let range = getRange(rid) || false;

	let labelName = name;
	labelName = labelName.replace(/Extended/gi, 'Ext.');
	labelName = labelName.replace(/Miscellaneous/gi, 'Misc.');
	labelName = labelName.replace(/Mathematical/gi, 'Math.');
	labelName = labelName.replace(/Punctuation/gi, 'Punct.');
	labelName = labelName.replace(/Supplemental/gi, 'Supp.');
	labelName = labelName.replace(/Supplement/gi, 'Supp.');
	labelName = labelName.replace(/Unified/gi, 'Uni.');
	labelName = labelName.replace(/Characters/gi, 'Chars.');
	labelName = labelName.replace(/Combining/gi, 'Combo.');
	labelName = labelName.replace(/Canadian/gi, 'Can.');
	labelName = nbsp(labelName);

	function makeCheckbox() {
		return `<input 
			type="checkbox" 
			id="${checkboxID}" 
			title="${name}" 
			data-range="${rid}" 
			onchange='checkboxOnChange(this);'  
			${isRangeSelected(rid) ? 'checked' : ''}
		/>`;
	}

	let nonstandardNote = '<div class="note" title="Default sans-serif font may not\nbe able to display this range">⊘</div>';
	let noGlyphsNote = '<div class="note" title="Range contains no characters\nwith visible shapes.">⊝</div>';
	let subRangeNote = '<div class="note" title="This is a sub-group of a larger Unicode Range.\nThe larger / parent Unicode Range will be shown.">⬙</div>';

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
			${indent !== undefined ? `<div style="grid-column: 1;">${indent}</div>` : ''}
			
			${makeCheckbox()}
			
			<label 
				for="${checkboxID}" 
				title="${name}" 
				${indent || indent === '' ? '' : 'class="spanTwo" '}
			>${labelName}</label>

			<div class="count" title="Character count">
				${range && range.nonstandard ? nonstandardNote : ''}
				${range && range.noGlyphs ? noGlyphsNote : ''}
				${rid.startsWith('s-') ? subRangeNote : ''}
				${range ? parseInt(range.end) - parseInt(range.begin) + 1 : ''}
			</div>

			<pre title="Character range">${rid.substring(2)}</pre>
		`;
	}
}

function checkboxOnChange(elem) {
	const rangeID = elem.dataset.range;
	if (elem.checked) {
		selectRange(rangeID);
	} else {
		deselectRange(rangeID);
	}

	if (!app.settings.responsiveChooserIsOpen && !isDialogOpen()) {
		if (app.settings.selectedPage !== 'Ranges') navigate('Ranges');
	}
}
