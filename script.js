	let app = {
		rangeCache: {},
		selectedRanges: []
	};

	function init(){
        selectRange('0000-007F');
        selectRange('0080-00FF');
        // selectRange('0800-083F');

        // app.selectedRanges = unicodeBlocks;

		document.getElementById('chooser').innerHTML = makeChooser();
		document.getElementById('content').innerHTML = makeContent();
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
		let con = '<h1>Unicode Explorer</h1><table>';
		let name;

		for(let rid in unicodeBlocks){ if(unicodeBlocks.hasOwnProperty(rid)) {
            name = unicodeBlocks[rid].name;
			con += 
			`<tr>
                <td><input 
                    type="checkbox" 
                    id="checkbox_${name}" 
                    onchange="checkboxOnChange(\'${rid}\');" 
                    ${isRangeSelected(rid)? 'checked' : ''}
                /></td>
				<td><label for="checkbox_${name}">${name.replace(/Extended/gi, 'Ext').replace(/Unified/gi, '')}&ensp;</td>
                <td><pre>${rid}</pre></td>
			</tr>`;
		}}

		con += '</table><br><br>';
		return con;
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
            <h3>${range.name}</h3>
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
