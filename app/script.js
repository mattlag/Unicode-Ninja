let app = {
    version: '2.2.0',
    releaseDate: 1547090000000,
    selectedRanges: [],
    selectedTab: 'Grouped',
    fontFamily: 'sans-serif',
    rangeCache: {},
};

function init(){
    selectRange('r-0020-007F');

    let con = `
        <div id="tabs">${makeTabs()}</div>
        <div id="header">
            <h1 id="logo"></h1>
            <div id="tools">
                <button class="actionButton" onclick="openSettingsDialog();">⛭</button>
                <button class="actionButton" onclick="openInfoDialog();">?</button>
            </div>
        </div>
        <div id="chooser">${makeChooser()}</div>
        <div id="content">${makeContent()}</div>
        <div id="dialog" onclick="closeDialog();">
            <div id="dialogContent" onclick="nothing(event);"></div>
        </div>
    `;

    document.getElementById('wrapper').innerHTML = con;
    animateLogo();
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

/*
    Range and Character data
*/

function getRange(rid) {
    // if(!unicodeBlocks[rid]) console.warn(`Unknown range: ${rid}`);
    return unicodeBlocks[rid];
}

function getRangeForChar(hex) {
    hex = parseInt(hex, 16);
    for(let r in unicodeBlocks) {
        if(unicodeBlocks.hasOwnProperty(r)) {
            if(hex >= unicodeBlocks[r].begin && hex <= unicodeBlocks[r].end)
                return unicodeBlocks[r];
    }}

    return false;
}

function getDataForChar(hex) {
    hex = ''+hex;
}

function isRangeSelected(rid) {
    return app.selectedRanges.includes(rid);
}

function selectRange(rid) {
    // if(typeof rid === 'string') rid = [rid];
    rid = rid.split('_');
    
    rid.forEach(id => {
        if(!isRangeSelected(id)) app.selectedRanges.push(id);
    });

    sortSelectedRanges();
}

function deselectRange(rid) {
    // if(typeof rid === 'string') rid = [rid];
    rid = rid.split('_');

    rid.forEach(id => {
        let i = app.selectedRanges.indexOf(id);
        if(i > -1) app.selectedRanges.splice(i, 1);
    });

    sortSelectedRanges();
}

function deselectAllRanges() {
    app.selectedRanges = [];
    redraw();
}

function sortSelectedRanges() {
    app.selectedRanges.sort(function (a, b) {
        return parseInt(a.substr(2, 4), 16) - parseInt(b.substr(2, 4), 16);
    });        
}


/*
    Making UI Content
*/

function redraw(onlyContent) {
    !onlyContent? document.getElementById('tabs').innerHTML = makeTabs() : false;
    !onlyContent? document.getElementById('chooser').innerHTML = makeChooser() : false;
    document.getElementById('content').innerHTML = makeContent();
}

function makeTabs() {
    let grouped = app.selectedTab === 'Grouped';

    return `
        <button class="${grouped? 'selected' : ''}" onclick="selectTab('Grouped');">
            Grouped
        </button>
        <button class="${grouped? '' : 'selected'}" onclick="selectTab('Sorted');">
            Sorted
        </button>
    `;
}

function selectTab(tab) {
    app.selectedTab = tab;
    redraw();
}

function makeChooser() {
    let con = app.selectedTab === 'Grouped'? makeGroupedChooser() : makeFlatChooser();

    if(app.selectedRanges.length) con += '<button class="dark" onClick="deselectAllRanges();">de-select all ranges</button><br><br>';

    return con;
}

function makeFlatChooser() {
    let con = '<h2>Unicode</h2><table>';

    for(let rid in unicodeBlocks){
    if(unicodeBlocks.hasOwnProperty(rid)) {
        con += makeSingleRangeRow(rid, unicodeBlocks[rid].name);
    }}

    con += '</table><br><br>';
    return con;
}

function makeGroupedChooser() {
    function makeArea(area){
        let con = '<table>';
        let subcon, multisel;
        for(let section in area){
        if(area.hasOwnProperty(section)) {
            con += `<tr><td colspan="4"><h3>${section}</h3></td></tr>`;
            for(let group in area[section]){
            if(area[section].hasOwnProperty(group)) {
                if(typeof area[section][group] === 'string') {
                    con += makeSingleRangeRow(area[section][group], group);
                } else {
                    subcon = '';
                    multisel = [];
                    for(let block in area[section][group]){
                    if(area[section][group].hasOwnProperty(block)) {
                        subcon += makeSingleRangeRow(area[section][group][block], block, true);
                        multisel.push(area[section][group][block]);
                    }}
                    con += makeSingleRangeRow(multisel.join('_'), group, false, true);
                    con += subcon;
                }
            }}
        }}
        con += '</table><br><br>';
        return con;
    }

    return `
        <h2>Unicode Scripts</h2>
        ${makeArea(organizedScripts)}
        <h2>Unicode Symbols</h2>
        ${makeArea(organizedSymbols)}
    `;
}

function makeSingleRangeRow(rid, name, indent, group) {
    // console.log('makeSingleRow');
    // console.log(`\t rid: ${typeof rid} ${rid}`);
    
    let cbid = `checkbox_${group? 'g_' : ''}${name.replace(/ /gi, '_')}`;
    let range = getRange(rid) || false;

    return `<tr>
        ${indent? '<td>&emsp;</td><td>' : '<td>'}
            <input 
                type="checkbox" 
                id="${cbid}" 
                data-range="${rid}" 
                onchange='checkboxOnChange(this);'  
                ${isRangeSelected(rid)? 'checked' : ''}
            />
        </td>
        <td${indent? '': ' colspan="2"'}>
            <label for="${cbid}"${group? ' class="group"' : ''}>
                ${name.replace(/Extended/gi, 'Ext').replace(/Unified/gi, '')}
            </label>
            ${(range && range.noglyphs)? '<span class="note" title="Range contains no characters\nwith visible shapes.">⊝</span>' : ''}
            ${(range && range.nonstandard)? '<span class="note" title="Default sans-serif font may not\nbe able to display this range">⊘</span>' : ''}
            &emsp;
        </td>
        ${app.selectedTab === 'Sorted'? '<td>&emsp;&ensp;</td>' : ''}
        <td class="count" title="Character count">
            ${range? (parseInt(range.end) - parseInt(range.begin)) : ''}
        </td>
        <td>
            ${group? '' : `<pre title="Character range">${rid.substr(2)}</pre>`}
        </td>
    </tr>`;
}

function makeContent() {
    let con = '';

    for(let s=0; s<app.selectedRanges.length; s++){
        con += getRangeContent(app.selectedRanges[s]);
    }
    
    con += '<i class="light">add or remove ranges using the checkboxes on the left</i>';
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
        <table class="rangeTable">
            <tr>
                <td>
                    <h3>
                        ${range.name}
                        <a href="https://www.wikipedia.org/wiki/${range.name.replace(/ /gi, '_')}_(Unicode_block)" 
                            target="_new" 
                            title="Wikipedia Link"
                            class="wiki">
                            Wikipedia
                        </a>
                    </h3>
                </td><td style="text-align: right;">
                    ${makeCloseButton(`clickRangeClose('${rid}');`)}
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <table>
                        <thead>
                            <td class="hex"></td>
                            <td class="hex">0</td>
                            <td class="hex">1</td>
                            <td class="hex">2</td>
                            <td class="hex">3</td>
                            <td class="hex">4</td>
                            <td class="hex">5</td>
                            <td class="hex">6</td>
                            <td class="hex">7</td>
                            <td class="hex">8</td>
                            <td class="hex">9</td>
                            <td class="hex">A</td>
                            <td class="hex">B</td>
                            <td class="hex">C</td>
                            <td class="hex">D</td>
                            <td class="hex">E</td>
                            <td class="hex">F</td>
                        </thead>
                        <tbody>
                        <tr>
    `;

    for(let c=(range.begin*1); c<=(range.end*1); c++){
        if(c%16===0) {
            con += `
                </tr>
                <tr>
                    <td class="hex">${decToHex(c).substr(2, 3)}-</td>
            `;
        }

        con += `<td>${makeTile(decToHex(c))}</td>`;
    }

    con += `
            </tr>
            </tbody>
            </table>
        </td>
        </tr>
        </table>
    `;

    return con;
}

function clickRangeClose(rid) {
    deselectRange(rid);
    redraw();
}

function makeTile(char) {
    let name = getUnicodeName(char);
    let con = `<div class="charTile noChar" title="No character encoded\nat this code point">&nbsp;</div>`;

    if(name !== '{{no name found}}'){
        con = `
            <div 
                class="charTile" 
                style="font-family: ${app.fontFamily};${name === '<control>'? ' color: #EEE;"' : '"'} 
                title="${getUnicodeName(char)}\n${char}"
                onClick="tileClick('${char}');"
            >&#${char.substring(1)};</div>
        `;
    }

    return con;
}

function makeCharDetail(char) {
    // console.log(`makeCharDetail: ${typeof char} ${char}`);

    let range = getRangeForChar(char);
    // console.log(`range: ${range}`);
    
    let unicodeName = getUnicodeName(char).replace('<', '&lt;');
    // console.log(`name: ${name}`);

    let entityName = htmlEntityNameList[char];

    let base = char.substr(2);

    let con = `
        <h2>${unicodeName}</h2>
        <span 
            class="bigCharTile"
            style="font-family: ${app.fontFamily};${unicodeName === '&lt;control>'? ' color: #EEE;"' : '"'} 
        >&#x${base};</span>
        <br><br>
        <h3>Related information</h3>
        <div class="keyvalue">
            <span class="key light">Unicode&nbsp;code&nbsp;point:</span>
            <span class="value"><pre>U+${base}</pre></span>

            <span class="key light">HTML&nbsp;hex&nbsp;entity:</span>
            <span class="value"><pre>&amp;#x${parseInt(base, 16).toString(16)};</pre></span>

            <span class="key light">HTML&nbsp;decimal&nbsp;entity:</span>
            <span class="value"><pre>&amp;#x${parseInt(base, 16)};</pre></span>

            ${entityName?
                `<span class="key light">HTML&nbsp;named&nbsp;entity:</span>
                <span class="value"><pre>&amp;${entityName};</pre></span>`
                : ''
            }

            <span class="key light">Member&nbsp;of&nbsp;range:</span>
            <span class="value">${range.name}&emsp;<pre>U+${decToHex(range.begin).substr(2)} - U+${decToHex(range.end).substr(2)}</pre></span>
        </div>
    `;

    return con;
}

function openSettingsDialog() {
    openDialog(`
        <h2>Settings</h2>
        <div class="keyvalue">
            <span class="key">Character&nbsp;tile&nbsp;font&nbsp;family:</span>
            <span class="value">
                <select onchange="updateTileFontFamily(this.value);" style="width: 200px;">
                    <option value="sans-serif">sans-serif</option>
                    <option value="serif">serif</option>
                </select>
            </span>
        </div>
    `);
}

function updateTileFontFamily(value) {
    app.fontFamily = value;
    app.rangeCache = [];
    redraw(true);
}

function openInfoDialog() {
    openDialog(`
        <h2>unicode.ninja</h2>
        A tool to help explore the Unicode® Basic Multilingual Plane <pre>0000-ffff</pre>. 
        Unicode is a registered trademark of Unicode, Inc.  More information can be found at 
        <a href="https://www.unicode.org/" target="_new">unicode.org</a>.

        <br><br>

        <h3>Created by Matt LaGrandeur</h3>
        Questions or comments? Email <a href="mailto:matt@mattlag.com">matt@mattlag.com</a>. 
        This app is an open source project - more information about the project can be found 
        on the <a href="https://github.com/mattlag/UnicodeNinja" target="_new">unicode.ninja GitHub page</a>.
        
        <br><br>

        <h3>App Information</h3>
        <div class="keyvalue">
            <span class="key light">App&nbsp;Version:</span>
            <span class="value">${app.version}</span>
            
            <span class="key light">App&nbsp;released&nbsp;on:</span>
            <span class="value">${new Date(app.releaseDate).toLocaleDateString()}</span>
            
            <span class="key light">Unicode&nbsp;data&nbsp;version:</span>
            <span class="value">v11.0.0 - 2018 June 5th</span>
        </div>
    `);
}

function openDialog(content) {
    document.getElementById('dialogContent').innerHTML = makeCloseButton('closeDialog();') + content;
    document.getElementById('dialog').style.display = 'block';
    window.setTimeout(function () {
        document.getElementById('dialog').style.opacity = '1';
        document.getElementById('dialogContent').style.opacity = '1';
    }, 10);
}

function nothing(event) {
    console.log(event);
    event.stopPropagation();
}

function makeCloseButton(func) {
    return `<button onclick="${func}" class="actionButton" title="Close">⨉</button>`;
}

function closeDialog() {
    document.getElementById('dialogContent').style.opacity = '0';

    window.setTimeout(function () {
        document.getElementById('dialog').style.opacity = '0';

        window.setTimeout(function () {
            document.getElementById('dialog').style.display = 'none';
            document.getElementById('dialogContent').innerHTML = '';
        }, 150);

    }, 350);
}

function animateLogo() {
    let delta = 0;
    let delay = 50;

    // let fancy = {
    //     car: 'unicode.ninja'.split(''),
    //     jay: ['j', 'ĵ', 'ǰ', 'ɉ'],
    //     sub: ['̥', '̪', '͈', '̬', '̯', '͙', '̭', '', '̺', '͓', '̮', '͈', '͚']
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
        document.getElementById('logo').innerHTML = makeLogo(delta);
        if(delta < fancy.car.length) {
            delta++;
            delay *= 1.05;
            window.setTimeout(updateLogo, delay);
        }
    }
    
    updateLogo();
}


/*
    Event Handlers
*/

function checkboxOnChange(elem){
    // console.log('checkboxOnChange');
    // console.log(elem.dataset.range);
    // let selected = document.getElementById('checkbox_'+range.name).checked;

    if(elem.checked) {
        // console.log('is selected');
        selectRange(elem.dataset.range);
    } else {
        // console.log('is NOT selected');
        deselectRange(elem.dataset.range)
    }

    redraw();

    document.getElementById(elem.id).checked = elem.checked;

}

function tileClick(char) {
    openDialog(makeCharDetail(char));
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

function getShipDate(){
    let time = '' + (new Date().getTime());
    let prefix = parseInt(time.substr(0, 5)) * 100000000;
    let day = (parseInt(time.charAt(5)) + 1) * 10000000;
    return prefix + day;
}
