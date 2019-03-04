function makePageSettings() {
	return `
		<h1>Settings</h1>
		<div class="twoColumn">
			<span class="key">${nbsp('Remember app settings:')}</span>
			<span class="value">
				<input 
					type="checkbox" 
					${app.settings.rememberSettings? 'checked' : ''} 
					onchange="updateSetting('rememberSettings', this.checked);"
				/>
			</span>
		
			<span class="key">${nbsp('Generic character tile font family:')}</span>
			<span class="value">
				<select onchange="updateSetting('genericFontFamily', this.value);" style="width: 200px;">
					<option value="serif">serif</option>
					<option value="sans-serif">sans-serif</option>
					<option value="monospace">monospace</option>
					<option value="system-ui">system-ui</option>
					<option value="cursive">cursive</option>
					<option value="fantasy">fantasy</option>
				</select>
			</span>

			<span class="key">${nbsp('Maximum search results:')}</span>
			<span class="value">
				<input type="number" value="${app.settings.maxSearchResults}" onchange="updateSetting('maxSearchResults', this.value);"/>
			</span>

		</div>

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
		<div class="twoColumn">
			<span class="key light">${nbsp('App version:')}</span>
			<span class="value">${app.version}</span>
			
			<span class="key light">${nbsp('App updated on:')}</span>
			<span class="value">${new Date(app.releaseDate).toLocaleDateString()}</span>
			
			<span class="key light">${nbsp('Unicode data version:')}</span>
			<span class="value">v11.0.0 - 2018 June 5th</span>
		</div>
	`;
}

function updateSetting(key, value) {
	// console.log(`Setting ${key} to ${value}`);
	app.settings[key] = value;

	if(key === 'genericFontFamily') {
		app.rangeCache = [];
		redraw(true);
	} if(key === 'rememberSettings' && !value) {
		window.localStorage.removeItem('unicode.ninja');
		window.localStorage.clear();
		// console.log('cleared local storage');
	}

	saveSettings();
}