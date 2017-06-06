var onAcceptDialog = function() {
	window.parent.postMessage("You've clicked accept", "*");
}

var onDismissDialog = function() {
	window.parent.postMessage("You've clicked dismiss", "*");
}

var onInputEnter = function(e) {
	e.preventDefault();
	if(e.keyCode == 13) {
		onAcceptDialog();
	}
}

window.onload = function() {
	console.log("[dialogScript] Hello World! " + window.location.origin);
	//document.getElementById("searchWord").value = "Another";
	
	document.getElementById("searchWord").addEventListener("keyup", onInputEnter);
	document.getElementById("pronunciation").addEventListener("keyup", onInputEnter);
	document.getElementById("meaning").addEventListener("keyup", onInputEnter);
	document.getElementById("example").addEventListener("keyup", onInputEnter);
	
	document.getElementById("btnAccept").addEventListener("click", onAcceptDialog);
	document.getElementById("btnDismiss").addEventListener("click", onDismissDialog);
	
	document.getElementById("searchWord").focus();

	window.addEventListener("message", function(event) {
		document.getElementById("dictionaryDialog").style.backgroundColor = "red";
		
		//window.parent.postMessage("Test", "*");
		//document.getElementById("example").value = "e.source: " + event.source + "; window: " + window;
		
	  // We only accept messages from ourselves
	  if (event.source != window)
		return;

	}, false);
}
