function openDialog(content = '') {
	let dialogHTML = `
		<div onclick="event.stopPropagation();">
			<div style="width: 100%; text-align: right;">
				<button class="actionButton">⨉</button>
			</div>
			${content}
		</div>
	`;

	let dialogElement = document.createElement('dialog');
	dialogElement.innerHTML = dialogHTML;
	document.body.appendChild(dialogElement);

	let closeButton = dialogElement.querySelector('.actionButton');
	closeButton.addEventListener('click', () => {
		dialogElement.close();
	});
	dialogElement.addEventListener('click', () => {
		dialogElement.close();
	});

	dialogElement.showModal();
}


function isDialogOpen() {
	return !!document.querySelector('dialog');
}

function copyText(text) {
	navigator.clipboard.writeText(text).then(
		() => {
			// console.log(`Copied to the clipboard: ${text}`);
		},
		() => {
			// console.warn(`Copy to clipboard failed`);
		}
	);
}
