function log(msg) {
	console.log("[InjectDialog] "+msg);
}

log("Just injected");

// #1 insert HTML directly to document passing string
//document.body.insertAdjacentHTML("beforeend", "<div id='dictionaryField' style='position: fixed; width: 400px; height: 400px; left: 50%; top: 50%; margin-top: -200px; margin-left: -200px; background-color: yellow'><input type='text' style='width: 200px' /></div>");


// #2 insert HTML directly to document passing external file
/*
var xmlHttp = null;

xmlHttp = new XMLHttpRequest();
xmlHttp.open( "GET", chrome.extension.getURL ("dialog.html"), true );
xmlHttp.onreadystatechange = function() {
	if (xmlHttp.readyState == 4) {
		document.body.insertAdjacentHTML("beforeend", xmlHttp.response);
		
		document.head.insertAdjacentHTML("beforeend", '<link rel="stylesheet" type="text/css" href="' + 
			chrome.runtime.getURL("dialog.css") + '">');
		
		document.getElementById("translationField").value = "Duuuuuuupa";
		
		document.getElementById("btnAccept").addEventListener('click', function() {
			alert("Siemanko");
		}, false);
	}
}
xmlHttp.send( null );
*/

// #3 insert IFRAME to document due to style variations from original sites

var iframe = document.createElement('iframe');

iframe.style.cssText = 'border: 0; position: fixed; padding: 0; top: 50%; left: 50%; display: block; width: 620px; height: 240px; margin-left: -310px; margin-top: -120px; z-index: 50000;';
iframe.src = chrome.runtime.getURL('dialog.html');

document.body.appendChild(iframe);