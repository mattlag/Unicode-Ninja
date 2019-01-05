	let app = {
		rangeCache: {},
        selectedRanges: [],
        groupChooser: true,
	};

	function init(){
        selectRange('0000-007F');
        selectRange('0080-00FF');
        // selectRange('0800-083F');

        let con = `
            <div id="tabs">tabs!</div>
            <div id="header"><h1>unicode.ninja</h1></div>
            <div id="chooser">${makeChooser()}</div>
            <div id="content">${makeContent()}</div>
        `;

		document.getElementById('wrapper').innerHTML = con;
	}

    /*
        Range Selection
    */

    function getRange(rid) {
        if(!unicodeBlocks[rid]) console.warn(`Unknown range: ${rid}`);
        return unicodeBlocks[rid];
    }

    function isRangeSelected(rid) {
        return app.selectedRanges.includes(rid);
    }

    function selectRange(rid) {
        if(!isRangeSelected(rid)) app.selectedRanges.push(rid);
    }
    
    function deselectRange(rid) {
        let i = app.selectedRanges.indexOf(rid);
        if(i > -1) app.selectedRanges.splice(i, 1);
    }
    
    function sortSelectedRanges() {
        app.selectedRanges.sort(function (a, b) {
            return parseInt(a.substr(0, 4), 16) - parseInt(b.substr(0, 4), 16);
        });        
    }


    /*
        Making UI Content
    */

	function makeChooser() {
        return app.groupChooser? makeGroupedChooser() : makeFlatChooser();
    }

    function makeFlatChooser() {
		let con = '<h1>Unicode Explorer</h1><table>';

		for(let rid in unicodeBlocks){ if(unicodeBlocks.hasOwnProperty(rid)) {
			con += makeSingleRangeRow(rid, unicodeBlocks[rid].nam);
		}}

		con += '</table><br><br>';
		return con;
	}

    function makeGroupedChooser() {
        function makeArea(area){
            let con = '<table>';
            for(let section in area){
            if(area.hasOwnProperty(section)) {
                con += `<tr><td colspan="4"><h2>${section}</h2></td></tr>`;
                for(let group in area[section]){
                if(area[section].hasOwnProperty(group)) {
                    if(typeof area[section][group] === 'string') {
                        con += makeSingleRangeRow(area[section][group], group);
                    } else {
                        con += makeSingleRangeRow('', group, false, true);
                        for(let block in area[section][group]){
                        if(area[section][group].hasOwnProperty(block)) {
                            con += makeSingleRangeRow(area[section][group][block], block, true);
                        }}
                    }
                }}
            }}
            con += '</table><br><br>';
            return con;
        }

        return `
            <h1>Unicode Scripts</h1>
            ${makeArea(organizedScripts)}
            <h1>Unicode Symbols</h1>
            ${makeArea(organizedSymbols)}
        `;
    }

    function makeSingleRangeRow(rid, name, indent, big) {
        if(big) console.log('big for ', name);

        return `<tr>
            ${indent? '<td>&emsp;</td><td>' : '<td>'}
                <input 
                    type="checkbox" 
                    id="checkbox_${name}" 
                    onchange="checkboxOnChange(\'${rid}\');" 
                    ${isRangeSelected(rid)? 'checked' : ''}
                />
            </td>
            <td${indent? '': ' colspan="2"'}>
                <label for="checkbox_${name}"${big? ' class="group"' : ''}>
                    ${name.replace(/Extended/gi, 'Ext').replace(/Unified/gi, '')}&ensp;
                </label>
            </td>
            <td>
                <pre>${rid}</pre>
            </td>
        </tr>`;
    }

    function makeContent() {
        let con = '';

        for(let s=0; s<app.selectedRanges.length; s++){
            con += getRangeContent(app.selectedRanges[s]);
        }

        if (con === '') con = 'no ranges selected';

        con += '<br><br>';

        return con;
    }

    function getRangeContent(rid) {
        if (!app.rangeCache[rid]) app.rangeCache[rid] = makeRangeContent(rid);
        return app.rangeCache[rid];
    }

    function makeRangeContent(rid) {
        let range = getRange(rid);
        let con = `
            <h3>
                ${range.name}
                <a href="https://www.wikipedia.org/wiki/${range.name.replace(/ /gi, '_')}_(Unicode_block)" 
                    target="_new" 
                    title="Wikipedia Link"
                    class="wiki">
                        Wikipedia
                </a>
            </h3>
            <table class="rangeTable">
                <thead>
                    <td></td>
                    <td><pre>0</pre></td>
                    <td><pre>1</pre></td>
                    <td><pre>2</pre></td>
                    <td><pre>3</pre></td>
                    <td><pre>4</pre></td>
                    <td><pre>5</pre></td>
                    <td><pre>6</pre></td>
                    <td><pre>7</pre></td>
                    <td><pre>8</pre></td>
                    <td><pre>9</pre></td>
                    <td><pre>A</pre></td>
                    <td><pre>B</pre></td>
                    <td><pre>C</pre></td>
                    <td><pre>D</pre></td>
                    <td><pre>E</pre></td>
                    <td><pre>F</pre></td>
                </thead>
                <tbody>
                <tr>
        `;

        for(let c=(range.begin*1); c<=(range.end*1); c++){
            if(c%16===0) {
                con += `
                    </tr>
                    <tr>
                        <td><pre>${decToHex(c).substr(2, 3)}-</pre></td>
                `;
            }

            con += `<td>${makeTile(decToHex(c))}</td>`;
        }

        con += `
            </tr>
            </tbody>
            </table>
        `;

        return con;
    }

    function makeTile(glyph) {
        return `<div 
            class="charTile allNoto" 
            title="${getUnicodeName(glyph)}\n${glyph}"
            onClick="tileClick('${glyph}');"
            >
                &#${glyph.substring(1)};
            </div>
        `;
    }

    function getNamedCharsTable() {
        if(app.rangeCache.namedChars) return app.rangeCache.namedChars;

        let con = '<table><tr>';
        for(let c=0; c<htmlNamedChars.length; c++){
            if(c%16===0 && c!==0) con += '</tr><tr>';
            con += `<td>${makeTile(htmlNamedChars[c])}</td>`;
        }
        con += '</tr></table>';
        app.rangeCache.namedChars = con;
        return con;
    }


    /*
        Event Handlers
    */

	function checkboxOnChange(rid){
        // console.log('checkboxOnChange');
        // console.log(rid);
        let range = getRange(rid);
        let selected = document.getElementById('checkbox_'+range.name).checked;

        if(selected) {
            // console.log('is selected');
            selectRange(rid);
        } else {
            // console.log('is NOT selected');
            deselectRange(rid)
        }

		document.getElementById('content').innerHTML = makeContent();

    }

    function tileClick(glyph) {

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
		c = c.replace('#','0');
		if(c.charAt(0) === '0'){
            return fullUnicodeNameList[c] || '<no name found>';
		} else {
            return c;
		}
	}
