
function makeContent() {
    let con = '';

    con += makeCharSearchBar();

    if(app.settings.charSearch) {
        con += makeCharSearchResults();
    
    } else {
        // closing div for searchStatus area
        con += '</div>';

        for(let s=0; s<app.settings.selectedRanges.length; s++){
            con += getRangeContent(app.settings.selectedRanges[s]);
        }
        
        con += '<i class="light">add or remove ranges using the checkboxes on the left</i>';
    }

    con += '<br><br>';

    return con;
}

function getRangeContent(rid) {
    if (!app.rangeCache[rid]) app.rangeCache[rid] = makeRangeContent(rid);
    return app.rangeCache[rid];
}

function makeRangeContent(rid) {
    let range = getRange(rid);

    let rangeBeginBase = decToHex(range.begin).substr(2);
    if(rangeBeginBase === '0020') rangeBeginBase = '0000';

    let con = `
        <div class="contentCharBlock">
            <h3 class="title">
                ${range.name}
                <a href="https://www.wikipedia.org/wiki/${range.name.replace(/ /gi, '_')}_(Unicode_block)" 
                    target="_new" 
                    title="Wikipedia Link"
                    class="titleLink"
                >Wikipedia</a>
                <a href="https://www.unicode.org/charts/PDF/U${rangeBeginBase}.pdf" 
                    target="_new" 
                    title="Unicode Link" 
                    class="titleLink"
                >Unicode</a>
            </h3>
            <div class="actions">
                ${makeCloseButton(`clickRangeClose('${rid}');`)}
            </div>

            <div class="hex">&ensp;</div>
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

    for(let c=(range.begin*1); c<=(range.end*1); c++){
        if(c%16===0) {
            con += `
                <div class="hex"><span>${decToHex(c).substr(2, 3)}-</span></div>
            `;
        }

        con += makeTile(decToHex(c));
    }

    con += `</div>`;

    return con;
}

function clickRangeClose(rid) {
    deselectRange(rid);
    redraw();
}

function makeTile(char, size) {
    size = size || 'medium';
    let name = getUnicodeName(char);
    let con = `<div class="charTile ${size} noChar" title="No character encoded\nat this code point">&nbsp;</div>`;

    if(name !== '{{no name found}}'){
        con = `
            <div 
                class="charTile ${size}" 
                style="font-family: ${app.settings.genericFontFamily};${name === '<control>'? ' color: #EEE;"' : '"'} 
                title="${getUnicodeName(char)}\n${char.replace('0x', 'U+')}"
                ${size !== 'large'? `onClick="tileClick('${char}');"` : ''}
            >&#${char.substring(1)};</div>
        `;
    }

    return con;
}

function makeCharDetail(char) {
    // console.log(`makeCharDetail: ${typeof char} ${char}`);

    let range = getRangeForChar(char);
    if(range.begin === 32) range.begin = 0x0000;
    // console.log(`range: ${JSON.stringify(range)}`);

    let rangeBeginBase = decToHex(range.begin).substr(2);
    // console.log(`rangeBeginBase: ${rangeBeginBase}`);
    
    let unicodeName = getUnicodeName(char).replace('<', '&lt;');
    // console.log(`name: ${name}`);

    let entityName = htmlEntityNameList[char];

    let charBase = char.substr(2);

    // <span id="fav_${char}">
    //     ${makeFavoriteButton(char)}
    // </span>
    // <br><br>
    let con = `
        <h2>${unicodeName}</h2>
        <div class="twoColumn">
            <div class="colOne">
                ${makeTile(char, 'large')}
            </div>
            <div class="colTwo">
                <div class="twoColumn">
                    <span class="key light">${nbsp('HTML hex entity:')}</span>
                    <span class="value"><span class="copyCode">&amp;#x${parseInt(charBase, 16).toString(16)};</span></span>

                    <span class="key light">${nbsp('HTML decimal entity:')}</span>
                    <span class="value"><span class="copyCode">&amp;#${parseInt(charBase, 16)};</span></span>

                    ${entityName?
                        `<span class="key light">${nbsp('HTML named entity:')}</span>
                        <span class="value"><span class="copyCode">&amp;${entityName};</span></span>`
                        : ''
                    }
                </div>
            </div>
        </div>
        <br><br>
        <h3>Unicode information</h3>
        <div class="twoColumn">
            <span class="key light">${nbsp('Unicode code point:')}</span>
            <span class="value"><pre>U+${charBase}</pre></span>

            <span class="key light">${nbsp('Member of range:')}</span>
            <span class="value">
                <pre>U+${decToHex(range.begin).substr(2)} - U+${decToHex(range.end).substr(2)}</pre>
                <span style="vertical-align: bottom; margin:2px; 0px 0px 10px;">${range.name}</span>
            </span>

            <span class="key light">${nbsp('More Info from Wikipedia:')}</span>
            <span class="value">
                <a href="https://www.wikipedia.org/wiki/${range.name.replace(/ /gi, '_')}_(Unicode_block)" 
                    target="_new" 
                    title="Wikipedia Link">
                    wikipedia.org/wiki/${range.name.replace(/ /gi, '_')}_(Unicode_block)
                </a>
            </span>

            <span class="key light">${nbsp('More Info from Unicode:')}</span>
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


//
//  Char Name Search
//

function makeCharSearchBar() {
    // leave charSearchBar div open for searchStatus div in the grid
    return `
    <div class="charSearchBar">
        <div class="charSearchInputGroup">
            <span class="searchIcon">⚲</span>
            <input 
                type="text" 
                id="searchInput" 
                value="${app.settings.charSearch}" 
                onkeyup="updateCharSearch(this.value);"
                onfocus="appFocus('searchInput');"
                onblur="appFocus(false);"
            />
            ${makeCloseButton('clearSearch();')}
        </div>
    `;
}

function clearSearch() {
    app.settings.charSearch = '';
    document.getElementById('searchInput').value = '';
    redraw();
}

function makeCharSearchResults() {
    // console.time('makeCharSearchResults');
    let results = searchCharNames(app.settings.charSearch);
    let con = '';
    let isMaxed = results.length === parseInt(app.settings.maxSearchResults);
    
    // Close extra div from charSearchBar grid
    con += 
        `<div class="charSearchStatus">
            ${isMaxed? 'Showing the first ' : ''}
            ${results.length} result${results.length === 1? '' : 's'}
            <button onclick="clearSearch();">clear</button>
        </div>
    </div>`;

    con += `
        <div class="charSearchResults">
            <div class="columnHeader">&nbsp;</div>
            <div class="columnHeader">${nbsp('character name')}</div>
            <div class="columnHeader">${nbsp('code point')}</div>
            <div class="columnHeader">${nbsp('range name')}</div>
            `;
            // <div class="columnHeader">${nbsp('favorites')}</div>
    results.map(function(value) {
        con += `
        <div class="rowWrapper" onclick="tileClick('${decToHex(value.char)}');">
            ${makeTile(value.char, 'small')}
            <div class="charName">${value.result}</div>
            <div class="codePoint"><pre>${value.char.replace('0x', 'U+')}</pre></div>
            <div class="rangeName">${nbsp(getRangeForChar(value.char).name)}</div>
        </div>
        `;
        // <div class="rowWrapper">
        //     <div class="charFavorite" id="row_fav_${value.char}">${makeFavoriteButton(value.char)}</div>
        // </div>
    });
    con += '</div>';
    // console.timeEnd('makeCharSearchResults');
    return con;
}

function updateCharSearch(term) {
    app.settings.charSearch = term;
    saveSettings();
    redraw();
}

function searchCharNames(term) {
    term = term.toUpperCase();
    let count = 0;
    let currName;
    let currPos;
    let results = [];
    let currResult;

    // console.time('charNameSearch');
    for(let point in fullUnicodeNameList) {
        if(count < app.settings.maxSearchResults) {
            if(fullUnicodeNameList.hasOwnProperty(point)) {
                currName = fullUnicodeNameList[point];
                currPos = currName.indexOf(term);

                if(currPos > -1) {
                    currResult = `<span>${nbsp(currName.substring(0, currPos))}</span>`;
                    currResult += `<span class="highlight">${nbsp(term)}</span>`;
                    currResult += `<span>${nbsp(currName.substring(currPos + term.length))}</span>`;
                    
                    results.push({char: point, result: currResult});
                    count++;
                }
            }
        } else {
            // console.timeEnd('charNameSearch');
            return results;
        }
    }
    // console.timeEnd('charNameSearch');
    return results;
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
            //     max = currName.length;
            //     result.push({length: max, char: point, name: currName});
            // }
        }
    }
    // console.timeEnd('name');

    return result;
}