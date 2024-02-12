function openDialog(content = '') {
	let dialogID = getNewDialogID();

	let dialogHTML = `
		<div class="dialogContent" onclick="event.stopPropagation();">
			<div style="width: 100%; text-align: right;">
				<button class="actionButton">⨉</button>
			</div>
			${content}
		</div>
	`;

	let dialogElement = document.createElement('div');
	dialogElement.setAttribute('class', 'dialog');
	dialogElement.setAttribute('id', dialogID);
	dialogElement.innerHTML = dialogHTML;

	app.dialogCloseFunctions[dialogID] = function () {
		let dialog = document.getElementById(dialogID);
		delete app.dialogCloseFunctions[dialogID];
		dialog.style.opacity = '0';
		window.setTimeout(function () {
			dialog.parentElement.removeChild(dialog);
		}, 100);
	};

	document.body.appendChild(dialogElement);

	let closeButtons = dialogElement.querySelectorAll('.actionButton');
	closeButtons.forEach(
		(element) => (element.onclick = app.dialogCloseFunctions[dialogID])
	);

	dialogElement.onclick = app.dialogCloseFunctions[dialogID];

	window.setTimeout(function () {
		dialogElement.setAttribute('style', 'opacity: 1; display: grid;');
		window.setTimeout(function () {
			dialogElement
				.querySelector('.dialogContent')
				.setAttribute('style', 'opacity: 1; display: block;');
		}, 110);
	}, 100);
}

function getNewDialogID() {
	let suffix = 1;

	while (true) {
		if (!document.getElementById('dialog-' + suffix)) return 'dialog-' + suffix;
		suffix++;
	}
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
