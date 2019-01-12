
function makeChooser() {
    let con = app.settings.selectedTab === 'Grouped'? makeGroupedChooser() : makeFlatChooser();

    if(app.settings.selectedRanges.length) con += '<button class="dark" onClick="deselectAllRanges();">de-select all ranges</button><br><br>';

    return con;
}

function makeFlatChooser() {
    let con = '<h2>Unicode</h2><div class="skiprow">&nbsp;</div>';

    for(let rid in unicodeBlocks){
    if(unicodeBlocks.hasOwnProperty(rid)) {
        con += makeSingleRangeRow(rid, unicodeBlocks[rid].name);
    }}

    return con;
}

function makeGroupedChooser() {
    function makeArea(area){
        let con = '';
        let subcon, multisel;
        for(let section in area){
        if(area.hasOwnProperty(section)) {
            con += '<div class="skiprow">&nbsp;</div>';
            con += `<h3>${section}</h3>`;
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
        con += '<br><br>';
        return con;
    }

    return `
        <h2>Unicode Scripts</h2>
        ${makeArea(organizedScripts)}
        <div class="skiprow">&nbsp;</div>
        <div class="skiprow">&nbsp;</div>
        <div class="skiprow">&nbsp;</div>
        <div class="skiprow">&nbsp;</div>
        <h2>Unicode Symbols</h2>
        ${makeArea(organizedSymbols)}
    `;
}

function makeSingleRangeRow(rid, name, indent, group) {
    // console.log('makeSingleRow');
    // console.log(`\t rid: ${typeof rid} ${rid}`);
    
    let cbid = `checkbox_${group? 'g_' : ''}${name.replace(/ /gi, '_')}`;
    let range = getRange(rid) || false;
    let labelName = name.replace(/Extended/gi, 'Ext').replace(/Unified/gi, '').replace(/ /gi, '&nbsp;')

    function makeCheckbox() {
        return `<input 
            type="checkbox" 
            id="${cbid}" 
            data-range="${rid}" 
            onchange='checkboxOnChange(this);'  
            ${isRangeSelected(rid)? 'checked' : ''}
        />`;
    }

    if(group) {
        return `
            ${makeCheckbox()}
            <label for="${cbid}" class="group">
                ${labelName}
            </label>
        `;
    } else {
        return `
            ${indent? '<div style="grid-column: 1;">&emsp;</div>' : ''}
            
            ${makeCheckbox()}
            
            <label for="${cbid}" ${indent? '': ' class="spantwo"'}>
                ${labelName}
            </label>

            <div class="count" title="Character count">
                ${(range && range.nonstandard)? '<div class="note" title="Default sans-serif font may not\nbe able to display this range">⊘</div>' : ''}
                ${(range && range.noglyphs)? '<div class="note" title="Range contains no characters\nwith visible shapes.">⊝</div>' : ''}
                ${range? (parseInt(range.end) - parseInt(range.begin)) : ''}
            </div>

            <pre title="Character range">${rid.substr(2)}</pre>
        `;
    }
}

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