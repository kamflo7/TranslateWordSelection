window.onload = function() {
	//console.log("[TranslateWorldSelection] Injected script init");
	
	chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
		if(msg.action == "getTranslation") {
			var translation = getTranslationData();
			
			sendResponse({ data: JSON.stringify(translation) });
		}
	});
}

function getTranslationData() {
	var result = new Object();
	
	result.pronunciation = getPronunciation();
	result.translation = getPolishTranslation();
	result.example = getExample();
	
	return result;
}

function getPronunciation() {
	var node = document.querySelector("#entryContent > div.cdo-dblclick-area > div > div > div.di-head.normal-entry > span > span:nth-child(2) > span.pron > span");
	
	if(node != null)
		return node.innerText;
	
	return null;
}

function getPolishTranslation() {
	var selectors = [
		"#entryContent > div.cdo-dblclick-area > div > div > div.di-body.normal-entry-body > div > div > div > div:nth-child(1) > div > div > span > span",
		"#entryContent > div.cdo-dblclick-area > div > span > div > div.di-body.normal-entry-body > div > span > div > div > div > span > span"
	];
	
	for(var i=0; i<selectors.length; i++) {
		var node = document.querySelector(selectors[i]);
		if(node != null)
			return node.innerText;
	}
	
	return null;
}

function getExample() {
	var node = document.querySelector("#entryContent > div.cdo-dblclick-area > div > div > div.di-body.normal-entry-body > div > div > div > div:nth-child(1) > div > div > span > div:nth-child(2) > span");
	
	if(node != null)
		return node.innerText;
	
	return null;
}