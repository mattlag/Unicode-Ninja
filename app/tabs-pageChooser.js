function makePageTab() {
	let tabContent;

	if(app.settings.selectedPage === 'Welcome') tabContent = '☺ Welcome!';
	if(app.settings.selectedPage === 'Ranges') tabContent = '▦ Selected ranges';
	if(app.settings.selectedPage === 'Favorites') tabContent = '★ Favorites';
	if(app.settings.selectedPage === 'Search') tabContent = '<span class="searchIcon">⚲</span> Search results';

	return `<button class="contentTab">${tabContent}</button>`;
}