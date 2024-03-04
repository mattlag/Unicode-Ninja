function makePageSettings() {
	let gff = app.settings.genericFontFamily;
	return `
		<div class="settings">
			<h1>Settings</h1>
			<div class="twoColumn">
				<span class="key">${nbsp('Remember app settings:')}</span>
				<span class="value">
					<input 
						type="checkbox" 
						${app.settings.rememberSettings ? 'checked' : ''} 
						onchange="updateSetting('rememberSettings', this.checked);"
					/>
				</span>
			
				<span class="key">${nbsp('Generic character tile font family:')}</span>
				<span class="value">
					<select onchange="updateSetting('genericFontFamily', this.value);">
						<option ${gff === 'serif' ? 'selected' : ''} value="serif">Serif</option>
						<option ${gff === 'sans-serif' ? 'selected' : ''} value="sans-serif">Sans-serif</option>
						<option ${gff === 'monospace' ? 'selected' : ''} value="monospace">Monospace</option>
						<option ${gff === 'system-ui' ? 'selected' : ''} value="system-ui">System UI</option>
						<option ${gff === 'cursive' ? 'selected' : ''} value="cursive">Cursive</option>
						<option ${gff === 'fantasy' ? 'selected' : ''} value="fantasy">Fantasy</option>
					</select>
				</span>

				<span class="key">${nbsp('Maximum search results:')}</span>
				<span class="value">
					<input type="number" value="${app.settings.maxSearchResults}" onchange="updateSetting('maxSearchResults', this.value);"/>
				</span>

			</div>

			<br><br><br>
			<h1>Info</h1>
			<h2>unicode.ninja</h2>
			A tool to help explore Unicode® characters and ranges. 
			Unicode is a registered trademark of Unicode, Inc.  More information can be found at 
			<a href="https://www.unicode.org/" target="_new">unicode.org</a>.

			<br><br>

			<h3>Created by Matt LaGrandeur</h3>
			Questions or comments? Email <a href="mailto:matt@mattlag.com">matt@mattlag.com</a>. 
			This app is an open source project - more information about the project can be found 
			on the <a href="https://github.com/mattlag/UnicodeNinja" target="_new">unicode.ninja GitHub page</a>.
			
			<br><br>

			<h3>App Information</h3>
			<div class="twoColumn">
				<span class="key light">${nbsp('App version:')}</span>
				<span class="value">${app.version}</span>
				
				<span class="key light">${nbsp('App updated on:')}</span>
				<span class="value">${new Date(app.releaseDate).toLocaleDateString()}</span>
				
				<span class="key light">${nbsp('Unicode data version:')}</span>
				<span class="value">v15.1.0 published 2023-09-06</span>
			</div>
			<br>
		</div>
	`;
}

function updateSetting(key, value) {
	// console.log(`Setting ${key} to ${value}`);
	app.settings[key] = value;

	if (key === 'genericFontFamily') {
		app.rangeCache = [];
		redrawContent();
	}
	if (key === 'rememberSettings' && !value) {
		window.localStorage.removeItem('unicode.ninja');
		window.localStorage.clear();
	}

	saveSettings();
}
