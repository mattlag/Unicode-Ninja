function makePageWelcome() {
	return `
		<div class="welcome">
			<h1>Welcome to unicode.ninja!</h1>
			<div>
				A tool to help explore the Unicode Basic Multilinqual Plane <pre>U+0000</pre> to <pre>U+FFFF</pre>. 
				Roughly 137,374 characters of excitement! Probably useful for typeface designers, or regular humans 
				looking for those funky characters that you saw on the internet that one time.
			</div>

			<h2>Getting started</h2>
			<ul>
				<li><b>Select a character range</b> using the checkboxes on the left to view characters across ranges.
				<li><b>Search for characters by name</b> using the search bar at the top.
				<li><b>Select a character</b> to see detailed info on that character.</li>
				<li><b>Favorite a character</b> so you can get back to them later.</li>
			</ul>

			<h2>Contact</h2>
			<div>
				Have any questions, or ideas for features / improvements? Send me an email, I'd be happy to chat.
				<br>
				<a href="mailto:matt@mattlag.com">matt@mattlag.com</a>
				<br><br>
				Or, if you are developer-inclined, you can check out the GitHub project page:
				<br>
				<a href="https://github.com/mattlag/UnicodeNinja" target="_new">github.com/mattlag/UnicodeNinja</a>
			</div>
		</div>
	`;	
}