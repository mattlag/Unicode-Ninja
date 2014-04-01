
	var tabcontent = [false,false,false,false,false];
	var tablestyle = {
		"size": 24,
		"family": "sans-serif"
	};

	function init(){

		// Make Name Table
		tabcontent[0] = "<table id='symboltable'><tr>";
		for(s=0; s<namearr.length; s++){
			if(s%16===0){ tabcontent[0] += "</tr><tr>"; }
			tabcontent[0] += "<td>"+makeOneSquare(namearr[s])+"</td>";
		}

		// Navigate
		tab(0);
		clickSymbol('amp');

		// Make other tables later
		setTimeout(makeNumericTables, 50);
	}

	function tab(t){
		document.getElementById('content').innerHTML = "<div style='width:100%; font-family:arial;'>Loading character codes...</div>";
		document.getElementById('tab0').style.backgroundColor = "rgb(225,234,240)";
		document.getElementById('tab1').style.backgroundColor = "rgb(225,234,240)";
		document.getElementById('tab2').style.backgroundColor = "rgb(225,234,240)";
		document.getElementById('tab3').style.backgroundColor = "rgb(225,234,240)";
		document.getElementById('tab4').style.backgroundColor = "rgb(225,234,240)";
		document.getElementById('tab'+t).style.backgroundColor = 'white';


		var seltab = parseInt(t);

		var updateContent = function(){
			console.log("loading tab " + seltab);
			if(tabcontent[seltab]){
				document.getElementById('content').innerHTML = tabcontent[seltab];	
				changeFontSize(tablestyle.size);
				changeFontFamily(tablestyle.family);
			} else {
				setTimeout(updateContent, 500);
			}
		};

		setTimeout(updateContent, 50);
	}

	function makeNumericTables(){
		var temptable = "";

		// Make numrow variable
		var numrow = "<td class='label'>&nbsp;</td>";
		for(var r=0; r<16; r++){ numrow += "<td class='label'>"+decToHex(r).charAt(3)+"</td>"; }

		// 0000 - 3FFF
		temptable = "<table id='symboltable'><tr>";
		for(var n=0x0000; n<(0x4000); n++){
			if(n%0x100===0) temptable += "</tr><tr>"+numrow;
			if(n%0x10===0) temptable += "</tr><tr><td class='label'>x"+decToHex(n)+"</td>";
			temptable += "<td>"+makeOneSquare("#x"+decToHex(n))+"</td>";
		}
		temptable += "</tr></table>";
		tabcontent[1] = temptable;


		// 4000 - 7FFF
		temptable = "<table id='symboltable'><tr>";
		for(var m=0x4000; m<(0x8000); m++){
			if(m%0x100===0) temptable += "</tr><tr>"+numrow;
			if(m%0x10===0) temptable += "</tr><tr><td class='label'>x"+decToHex(m)+"</td>";
			temptable += "<td>"+makeOneSquare("#x"+decToHex(m))+"</td>";
		}
		temptable += "</tr></table>";
		tabcontent[2] = temptable;


		// 8000 - BFFF
		temptable = "<table id='symboltable'><tr>";
		for(var p=0x8000; p<(0xC000); p++){
			if(p%0x100===0) temptable += "</tr><tr>"+numrow;
			if(p%0x10===0) temptable += "</tr><tr><td class='label'>x"+decToHex(p)+"</td>";
			temptable += "<td>"+makeOneSquare("#x"+decToHex(p))+"</td>";
		}
		temptable += "</tr></table>";
		tabcontent[3] = temptable;


		// C000 - FFFF
		temptable = "<table id='symboltable'><tr>";
		for(var q=0xC000; q<=(0xFFFF); q++){
			if(q%0x100===0) temptable += "</tr><tr>"+numrow;
			if(q%0x10===0) temptable += "</tr><tr><td class='label'>x"+decToHex(q)+"</td>";
			temptable += "<td>"+makeOneSquare("#x"+decToHex(q))+"</td>";
		}
		temptable += "</tr></table>";
		tabcontent[4] = temptable;
	}

	function decToHex(d) { var dr = Number(d).toString(16); while(dr.length < 4) { dr = "0"+dr; } return dr.toUpperCase(); }

	function makeOneSquare(txt){
		var re = "<div class='symbol' onclick='clickSymbol(\""+txt+"\");'>&"+txt+";</div>";
		return re;
	}

	function clickSymbol(sym){
		var re = "<input class='showclickleft' value='&"+sym+";'><input class='showclickright' type='text' value='&amp;"+sym+";'>";
		document.getElementById("showclick").innerHTML = re;
	}

	function changeFontSize(val){
		tablestyle.size = val;
		document.getElementById('symboltable').style.fontSize = parseInt(val)+'px';
	}

	function changeFontFamily(val){
		tablestyle.family = val;
		if(val.indexOf(' ')>-1) val = ("'"+val+"'");
		document.getElementById('symboltable').style.fontFamily = val;
	}

	var namearr = [
	"quot","amp","apos","lt","gt","nbsp","iexcl","cent","pound","curren","yen","brvbar","sect","uml","copy","ordf","laquo","not","shy","reg","macr","deg","plusmn","sup2","sup3","acute","micro","para","middot","cedil","sup1","ordm","raquo","frac14","frac12","frac34","iquest","Agrave","Aacute","Acirc","Atilde","Auml","Aring","AElig","Ccedil","Egrave","Eacute","Ecirc","Euml","Igrave","Iacute","Icirc","Iuml","ETH","Ntilde","Ograve","Oacute","Ocirc","Otilde","Ouml","times","Oslash","Ugrave","Uacute","Ucirc","Uuml","Yacute","THORN","szlig","agrave","aacute","acirc","atilde","auml","aring","aelig","ccedil","egrave","eacute","ecirc","euml","igrave","iacute","icirc","iuml","eth","ntilde","ograve","oacute","ocirc","otilde","ouml","divide","oslash","ugrave","uacute","ucirc","uuml","yacute","thorn","yuml","OElig","oelig","Scaron","scaron","Yuml","fnof","circ","tilde","Alpha","Beta","Gamma","Delta","Epsilon","Zeta","Eta","Theta","Iota","Kappa","Lambda","Mu","Nu","Xi","Omicron","Pi","Rho","Sigma","Tau","Upsilon","Phi","Chi","Psi","Omega","alpha","beta","gamma","delta","epsilon","zeta","eta","theta","iota","kappa","lambda","mu","nu","xi","omicron","pi","rho","sigmaf","sigma","tau","upsilon","phi","chi","psi","omega","thetasym","upsih","piv","ensp","emsp","thinsp","zwnj","zwj","lrm","rlm","ndash","mdash","lsquo","rsquo","sbquo","ldquo","rdquo","bdquo","dagger","Dagger","bull","hellip","permil","prime","Prime","lsaquo","rsaquo","oline","frasl","euro","image","weierp","real","trade","alefsym","larr","uarr","rarr","darr","harr","crarr","lArr","uArr","rArr","dArr","hArr","forall","part","exist","empty","nabla","isin","notin","ni","prod","sum","minus","lowast","radic","prop","infin","ang","and","or","cap","cup","int","there4","sim","cong","asymp","ne","equiv","le","ge","sub","sup","nsub","sube","supe","oplus","otimes","perp","sdot","lceil","rceil","lfloor","rfloor","lang","rang","loz","spades","clubs","hearts","diams"
	];
