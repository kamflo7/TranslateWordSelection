// #3 insert IFRAME to document due to style variations from original sites

var iframe;

function createIframeIntoPage() {
	iframe = document.createElement('iframe');
	iframe.setAttribute("id", "dictionaryIframe");
	iframe.setAttribute("name", "dictionaryIframeName");

	iframe.style.cssText = 'border: 0; position: fixed; padding: 0; top: 50%; left: 50%; display: block; width: 620px; height: 240px; margin-left: -310px; margin-top: -120px; z-index: 50000;';
	iframe.src = chrome.runtime.getURL('dialog.html');

	document.body.appendChild(iframe);
}

console.log("[injectDialog.js] origin: " + window.location.origin);

createIframeIntoPage();

window.addEventListener("message", function(e) {
	
	console.log("[injectDialog] onMessage: " + e.origin + "; data: " + e.data);
	//if(e.origin.indexOf('')
});