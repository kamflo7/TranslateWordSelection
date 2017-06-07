var onAcceptDialog = function() {
	//window.parent.postMessage("You've clicked accept", "*");
	window.parent.postMessage({action: 'acceptDialog', data: dialogFieldsToObject()}, "*");
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
	console.log("[dialogScript] Init! " + window.location.origin);
	
	document.getElementById("searchWord").addEventListener("keyup", onInputEnter);
	document.getElementById("pronunciation").addEventListener("keyup", onInputEnter);
	document.getElementById("meaning").addEventListener("keyup", onInputEnter);
	document.getElementById("example").addEventListener("keyup", onInputEnter);
	document.getElementById("btnAccept").addEventListener("click", onAcceptDialog);
	document.getElementById("btnDismiss").addEventListener("click", onDismissDialog);
	document.getElementById("searchWord").focus();

	window.addEventListener("message", function(event) {
		if(event.data.action == "giveTranslationData") {
			var translationData = event.data.data;
			
			document.getElementById("searchWord").value = translationData.searchWord;
			document.getElementById("pronunciation").value = translationData.pronunciation;
			document.getElementById("meaning").value = translationData.translation;
			document.getElementById("example").value = translationData.example;
			
			//document.getElementById("dictionaryDialog").style.backgroundColor = "aqua";
		}
	}, false);
	
	window.parent.postMessage({ action: "getTranslationData" }, "*");
}

function dialogFieldsToObject() {
	var result = new Object();
	
	result.searchWord = document.getElementById("searchWord").value.trim();
	result.pronunciation = document.getElementById("pronunciation").value.trim();
	result.meaning = document.getElementById("meaning").value.trim();
	result.example = document.getElementById("example").value.trim();
	
	return result;
}
