	let UI = {
		rangeCache: {},
		selectedRanges: []
	};

	function init(){
        UI.selectedRanges.push({begin: 0x0000, end: 0x007F, name: 'Basic Latin'});
        UI.selectedRanges.push({begin: 0x0080, end: 0x00FF, name: 'Latin-1 Supplement'});
        // UI.selectedRanges.push({begin: 0x0800, end: 0x083F, name: 'Samaritan', noto: ''});

        // UI.selectedRanges = unicodeBlocks;

		document.getElementById('chooser').innerHTML = makeChooser();
		document.getElementById('content').innerHTML = makeContent();
	}

	function makeChooser() {
		let con = '<h1>Unicode Range Explorer</h1><table>';
		let name;

		for(let r=0; r<unicodeBlocks.length; r++){
			name = unicodeBlocks[r].name;
			con += 
			`<tr>
                <td><input 
                    type="checkbox" 
                    id="checkbox_${name}" 
                    onchange='checkboxOnChange(${JSON.stringify(unicodeBlocks[r])});' 
                    ${isRangeSelected(unicodeBlocks[r])? 'checked' : ''}
                /></td>
				<td><label for="checkbox_${name}">${name.replace(/Extended/gi, 'Ext').replace(/Unified/gi, '')}&ensp;</td>
				<td><pre>${decToHex(unicodeBlocks[r].begin)}</pre></td>
				<td>&ensp;to&ensp;</td>
				<td><pre>${decToHex(unicodeBlocks[r].end)}</pre></td>
			</tr>`;
		}

		con += '</table><br><br>';
		return con;
	}

    function isRangeSelected(range) {
        for(let r=0; r<UI.selectedRanges.length; r++) {
            if(range.name === UI.selectedRanges[r].name) return true;
        }

        return false;
    }

    function makeContent() {
        let con = '';

        for(let s=0; s<UI.selectedRanges.length; s++){
            con += getRangeContent(UI.selectedRanges[s]);
        }

        if (con === '') con = 'no ranges selected';

        con += '<br><br>';

        return con;
    }

    function getRangeContent(range) {
        if (!UI.rangeCache[range.name]) UI.rangeCache[range.name] = makeRangeContent(range);
        return UI.rangeCache[range.name];
    }

    function makeRangeContent(range) {
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
                        <td><pre>${decToHex(c).substring(0, 5)}-</pre></td>
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

	function checkboxOnChange(range){
        // console.log('checkboxOnChange');
        // console.log(range);

        let selected = document.getElementById('checkbox_'+range.name).checked;

        if(selected) {
            // console.log('is selected');
            UI.selectedRanges.push(range);
            UI.selectedRanges.sort(function (a, b) {
                return a.begin - b.begin;
            });
        } else {
            // console.log('is NOT selected');
            for(let r=0; r<UI.selectedRanges.length; r++) {
                if(range.name === UI.selectedRanges[r].name) {
                    // console.log('... and being removed');
                    UI.selectedRanges.splice(r, 1);
                }
            }
        }

		document.getElementById('content').innerHTML = makeContent();

    }

    function tileClick(glyph) {

    }
    
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
    
    /**
     * HTML Named Characters
     */
    function getNamedCharsTable() {
        if(UI.rangeCache.namedChars) return UI.rangeCache.namedChars;

        let con = '<table><tr>';
        for(let c=0; c<htmlNamedChars.length; c++){
            if(c%16===0 && c!==0) con += '</tr><tr>';
            con += `<td>${makeTile(htmlNamedChars[c])}</td>`;
        }
        con += '</tr></table>';
        UI.rangeCache.namedChars = con;
        return con;
    }
