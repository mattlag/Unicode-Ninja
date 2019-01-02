	let UI = {
		rangeCache: {},
		selectedRanges: []
	};

	function init(){
		document.getElementById('content').innerHTML = getNamedCharsTable();
		document.getElementById('leftbar').innerHTML = makeRangeChooser();
	}

	function makeRangeChooser() {
		let con = '<table>';

		for(let r=0; r<unicodeBlocks.length; r++){
			con += 
			`<tr>
				<td><input type="checkbox"/></td>
				<td>${unicodeBlocks[r].name}</td>
				<td><pre>${decToHex(unicodeBlocks[r].begin)}</pre></td>
				<td>to</td>
				<td><pre>${decToHex(unicodeBlocks[r].end)}</pre></td>
			</tr>`;
		}

		con += '</table>';
		return con;
	}

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

	function makeTile(glyph) {
		return `<div class="charTile">&${glyph};</div>`;
	}

	function decToHex(d) { 
		let dr = Number(d).toString(16);
		while(dr.length < 4) { dr = '0'+dr; }
		return '0x' + dr.toUpperCase();
	}

	function getUnicodeName(c) {
		c = c.replace('#','0');
		if(c.charAt(0) === '0'){
			return fullUnicodeNameList[c] || '<not a character>';
		} else {
			return c;
		}
	}




	// Big letiables
