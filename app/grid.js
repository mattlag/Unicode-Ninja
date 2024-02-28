function makeGridView(results) {
	let char;
	let name;
	let con = "";
	con += `
		<div class="gridContents">
			<div class="columnHeader">&nbsp;</div>
			<div class="columnHeader">${nbsp("character name")}</div>
			<div class="columnHeader">${nbsp("code point")}</div>
			<div class="columnHeader">${nbsp("range name")}</div>
			<div class="columnHeader">${nbsp("favorites")}</div>
	`;

	if (results.length) {
		results.map(function (value) {
			if (typeof value === "object") {
				char = value.char;
				name = value.result || nbsp(getUnicodeName(char));
			} else {
				char = value;
				name = nbsp(getUnicodeName(char));
			}

			con += `
			<div class="rowWrapper" onclick="tileClick('${decToHex(char)}');">
				${makeTile(char, "small")}
				<div class="charName">${name}</div>
				<div class="codePoint"><pre>${char.replace("0x", "U+")}</pre></div>
				<div class="rangeName">${nbsp(getRangeForChar(char).name)}</div>
			</div>
			<div class="rowWrapper">
				<div class="charFavorite" id="row_fav_${char}">${makeFavoriteButton(char)}</div>
			</div>
			`;
		});
	} else {
		con += `
			<div style="grid-row: 2; grid-column: 1 / -1;">
				<br>
				<i class="light" style="grid-row: 2; grid-column: 2;">
					${nbsp("No characters to show.")}
				</i>
				<br>
			</div>
			`;
	}

	con += "</div>";

	return con;
}
