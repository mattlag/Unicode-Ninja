let app = {
    version: '2.0',
    releaseDate: 1546820000000,
    selectedRanges: [],
    selectedTab: 'Grouped',
    rangeCache: {},
};

function init(){
    selectRange('r-0000-007F');

    let con = `
        <div id="tabs">${makeTabs()}</div>
        <div id="header">
            <h1>u͈n͈i͈c͈o͈d͈e͈.n͈i͈n͈ĵa͈</h1>
            <div id="tools">
                <button class="actionButton" onclick="openDialog('{{info}}');">?</button>
            </div>
        </div>
        <div id="chooser">${makeChooser()}</div>
        <div id="content">${makeContent()}</div>
        <div id="dialog" onclick="closeDialog();">
            <div id="dialogContent"></div>
        </div>
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

function sortSelectedRanges() {
    app.selectedRanges.sort(function (a, b) {
        return parseInt(a.substr(0, 4), 16) - parseInt(b.substr(0, 4), 16);
    });        
}


/*
    Making UI Content
*/

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
    document.getElementById('tabs').innerHTML = makeTabs();
    document.getElementById('chooser').innerHTML = makeChooser();
}

function makeChooser() {
    return app.selectedTab === 'Grouped'? makeGroupedChooser() : makeFlatChooser();
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
    console.log('makeSingleRow');
    console.log(`\t rid: ${typeof rid} ${rid}`);
    
    let cbid = `checkbox_${group? 'g_' : ''}${name.replace(/ /gi, '_')}`;

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
                ${name.replace(/Extended/gi, 'Ext').replace(/Unified/gi, '')}&ensp;
            </label>
        </td>
        ${app.selectedTab === 'Sorted'? '<td>&emsp;&ensp;</td>' : ''}
        <td>
            ${group? '' : `<pre>${rid.substr(2)}</pre>`}
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
    `;

    return con;
}

function makeTile(glyph) {
    return `
        <div 
            class="charTile allNoto" 
            title="${getUnicodeName(glyph)}\n${glyph}"
            onClick="tileClick('${glyph}');"
        >&#${glyph.substring(1)};</div>
    `;
}

function openDialog(content) {
    if(content === '{{info}}') {
        content = `
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
                <span class="key light">App Version:</span>
                <span class="value">${app.version}</span>
                
                <span class="key light">App released on:</span>
                <span class="value">${new Date(app.releaseDate).toLocaleDateString()}</span>
                
                <span class="key light">Unicode data version:</span>
                <span class="value">v11.0.0 - 2018 June 5th</span>
            </div>
        `;
    }

    let closeButton = '<div onclick="closeDialog();" class="actionButton">✖</div>';

    document.getElementById('dialogContent').innerHTML = closeButton + content;
    document.getElementById('dialog').style.display = 'block';
}

function closeDialog() {
    document.getElementById('dialogContent').innerHTML = '';
    document.getElementById('dialog').style.display = 'none';
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

function checkboxOnChange(elem){
    console.log('checkboxOnChange');
    console.log(elem.dataset.range);
    // let selected = document.getElementById('checkbox_'+range.name).checked;

    if(elem.checked) {
        // console.log('is selected');
        selectRange(elem.dataset.range);
    } else {
        // console.log('is NOT selected');
        deselectRange(elem.dataset.range)
    }

    document.getElementById('content').innerHTML = makeContent();
    document.getElementById('chooser').innerHTML = makeChooser();

    document.getElementById(elem.id).checked = elem.checked;

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
