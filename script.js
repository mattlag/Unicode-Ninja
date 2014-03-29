
	var nametable = false;
	var numtable = false;
	var numrow = "";

	function init(){
		tab(true);
		clickSymbol('amp');

		numrow = "<td class='label'>&nbsp;</td>";
		for(var r=0; r<16; r++){ numrow += "<td class='label'>"+decToHex(r).charAt(3)+"</td>"; }
	}

	function popNameTab(){
		if(!nametable){
			nametable = "<table id='symboltable'><tr>";
			for(s=0; s<namearr.length; s++){
				if(s%16===0){ nametable += "</tr><tr>"; }
				nametable += "<td>"+makeOneSquare(namearr[s])+"</td>";
			}
		}
		document.getElementById('content').innerHTML = nametable;
	}

	function popNumericTab(){
		document.getElementById('content').innerHTML = "<div style='width:100%'>Loading 65,535 character codes...</div>";
		if(numtable){
			document.getElementById('content').innerHTML = numtable;
		} else {
			var makeNumericTable = function(){
				numtable = "<table id='symboltable'><tr>";

				for(var n=0x0000; n<=0x0FFF; n++){
					if(n%0x100===0) numtable += "</tr><tr>"+numrow;
					if(n%0x10===0) numtable += "</tr><tr><td class='label'>x"+decToHex(n)+"</td>";
					numtable += "<td>"+makeOneSquare("#x"+decToHex(n))+"</td>";
				}

				numtable += "</tr></table>";
				document.getElementById('content').innerHTML = numtable;
			};

			setTimeout(makeNumericTable,50);
		}
	}

	function decToHex(d) { var dr = Number(d).toString(16); while(dr.length < 4) { dr = "0"+dr; } return dr.toUpperCase(); }

	function makeOneSquare(txt){
		var re = "<div class='symbol' onclick='clickSymbol(\""+txt+"\");'>&"+txt+";</div>";
		return re;
	}

	function tab(t){
		if(t){
			popNameTab();
			document.getElementById("nametab").style.backgroundColor = "white";
			document.getElementById("numerictab").style.backgroundColor = "rgb(230,230,230)";
		} else {
			popNumericTab();
			document.getElementById("nametab").style.backgroundColor = "rgb(230,230,230)";
			document.getElementById("numerictab").style.backgroundColor = "white";
		}
	}

	function clickSymbol(sym){
		var re = "<table><tr><td class='showclickleft'>&"+sym+";</td><td class='showclickright'><input type='text' value='&amp;"+sym+";'></td></tr></table>";
		document.getElementById("showclick").innerHTML = re;
	}

	function changeFontSize(val){
		document.getElementById('symboltable').style.fontSize = parseInt(val)+'px';
	}

	function changeFontFamily(val){
		document.getElementById('symboltable').style.fontFamily = val;
	}

	var namearr = [
	"quot","amp","apos","lt","gt","nbsp","iexcl","cent","pound","curren","yen","brvbar","sect","uml","copy","ordf","laquo","not","shy","reg","macr","deg","plusmn","sup2","sup3","acute","micro","para","middot","cedil","sup1","ordm","raquo","frac14","frac12","frac34","iquest","Agrave","Aacute","Acirc","Atilde","Auml","Aring","AElig","Ccedil","Egrave","Eacute","Ecirc","Euml","Igrave","Iacute","Icirc","Iuml","ETH","Ntilde","Ograve","Oacute","Ocirc","Otilde","Ouml","times","Oslash","Ugrave","Uacute","Ucirc","Uuml","Yacute","THORN","szlig","agrave","aacute","acirc","atilde","auml","aring","aelig","ccedil","egrave","eacute","ecirc","euml","igrave","iacute","icirc","iuml","eth","ntilde","ograve","oacute","ocirc","otilde","ouml","divide","oslash","ugrave","uacute","ucirc","uuml","yacute","thorn","yuml","OElig","oelig","Scaron","scaron","Yuml","fnof","circ","tilde","Alpha","Beta","Gamma","Delta","Epsilon","Zeta","Eta","Theta","Iota","Kappa","Lambda","Mu","Nu","Xi","Omicron","Pi","Rho","Sigma","Tau","Upsilon","Phi","Chi","Psi","Omega","alpha","beta","gamma","delta","epsilon","zeta","eta","theta","iota","kappa","lambda","mu","nu","xi","omicron","pi","rho","sigmaf","sigma","tau","upsilon","phi","chi","psi","omega","thetasym","upsih","piv","ensp","emsp","thinsp","zwnj","zwj","lrm","rlm","ndash","mdash","lsquo","rsquo","sbquo","ldquo","rdquo","bdquo","dagger","Dagger","bull","hellip","permil","prime","Prime","lsaquo","rsaquo","oline","frasl","euro","image","weierp","real","trade","alefsym","larr","uarr","rarr","darr","harr","crarr","lArr","uArr","rArr","dArr","hArr","forall","part","exist","empty","nabla","isin","notin","ni","prod","sum","minus","lowast","radic","prop","infin","ang","and","or","cap","cup","int","there4","sim","cong","asymp","ne","equiv","le","ge","sub","sup","nsub","sube","supe","oplus","otimes","perp","sdot","lceil","rceil","lfloor","rfloor","lang","rang","loz","spades","clubs","hearts","diams"
	];
