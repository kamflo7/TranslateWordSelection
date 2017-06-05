var SEARCH = "dictionary.cambridge.org";
var SEARCH_FIELD_ID = "cdo-search-input";
var SUBMIT_BUTTON = "button.cdo-search__button";
var list = new InfinityFixedList(25);

var lastSearchWord;
var lastTranslationData;


var API_enabled = true;
var API_port = 9898;
var API_uriContextCheckWord = "checkWord";

(function initScript() {
	chrome.contextMenus.create({ 
		title: "CambridgeDictionary: %s",
		contexts: ["selection"],
		onclick: function(info, tab) { doTranslateSelection(info.selectionText.trim().toLowerCase(), "pl"); }
	});

	chrome.commands.onCommand.addListener(function(command) {
		if(command === "go-dictionary") {
			getSelection(function(word) {
				doTranslateSelection(word, "pl");
			});
		}
		else if(command === "go-dictionary-eng") {
			getSelection(function(word) {
				doTranslateSelection(word, "en");
			});
		} else if(command === "dispatch-word-outside") {
			dispatchWordOutside(lastSearchWord);
		}
	});

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		if(request.msg == "getList")
			sendResponse({list: list.getAll()});
	});
})();

function doTranslateSelection(word, lang) {
	lastSearchWord = word;
	
	searchDictionaryTab(function(tab) {
		if(tab == null) {
			var href = "http://dictionary.cambridge.org/dictionary/" + (lang == "en" ? "english" : "english-polish") + "/" + word;
			chrome.tabs.create({url: href}, function(tab) {
				afterUpdateTab(tab);
			});
		} else {
			searchWordOnTargetPage(word, lang, tab);
		}

		list.insert(word);
	});
}
// ###############################

function searchDictionaryTab(listener) {
	chrome.tabs.query({}, function(a) {	
		var tab = null;

		for(var i=0; i<a.length; i++) {
			var cv = a[i];
			if(cv.url.indexOf(SEARCH) !== -1) {
				tab = cv;
				break;
			}
		}

		listener(tab);
	});
}

function afterUpdateTab(tab) {
	var listener = function(tabId, info) {
		if(tabId == tab.id && info.status == "complete") {
			chrome.tabs.executeScript(tab.id, { code: "var s = document.querySelectorAll('.fcdo-volume-up'); var _result = 'no'; if(s != null) {s[1].click(); _result = 'true'; }" },
			function(result) {});
			
			chrome.tabs.sendMessage(tabId, {action: "getTranslation"}, function(response) {
				console.log("[Background:] getPronunciation resopnse: " + response.data);
				lastTranslationData = JSON.parse(response.data);
			});
			
			var xhr = new XMLHttpRequest();
			xhr.open("GET", "http://localhost:"+API_port+"/"+API_uriContextCheckWord+"?word="+lastSearchWord, true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					console.log("Got response: " + xhr.responseText);
				}
			}
			xhr.send();
			
			chrome.tabs.onUpdated.removeListener(listener);
		}
	};
	chrome.tabs.onUpdated.addListener(listener);
}

function dispatchWordOutside(word) {
	chrome.tabs.executeScript(null, { file: "injectDialog.js" }, function(result) {
		console.log("[Response from injectDialog] " + result);
	});
			
			
	searchDictionaryTab(function(tab) {
		if(tab == null) {
			console.log("[Background] I cannot send runtime message because tab not exists");
			return;
		}

		
		chrome.tabs.sendMessage(tab.id, {action: "getTranslation"}, function(response) {
			console.log("[Background:] getPronunciation resopnse: " + response.data);
			var translationObj = JSON.parse(response.data);

			
		});
		
		console.log("[Background] I should send runtime message");
	});
}

function updateTabUrl(word, targetLang, dictionaryTab) {
	if(targetLang === "pl") {
		chrome.tabs.update(dictionaryTab.id, {
			active: true,
			url: "http://dictionary.cambridge.org/dictionary/english-polish/" + word
			}, function(tab) {
				afterUpdateTab(tab);
		});
	} else if(targetLang === "en") {
		chrome.tabs.update(dictionaryTab.id, {
			active: true,
			url: "http://dictionary.cambridge.org/dictionary/english/" + word
			}, function(tab) {
				afterUpdateTab(tab);
		});
	}
}

function searchWordOnTargetPage(word, targetLang, dictionaryTab) {
	console.log(dictionaryTab);
	chrome.tabs.executeScript(dictionaryTab.id, { code: 'document.getElementById("cdo-search-input").value = "'+word+'"; document.querySelector("'+SUBMIT_BUTTON+'").click();' }, function(e) {
		afterUpdateTab(dictionaryTab);
	});
}

function getSelection(listener) {
	chrome.tabs.executeScript( {code: "window.getSelection().toString();"}, function(selection) {
		//console.log("getSelection, selection: " + selection);
		listener(selection[0].trim().toLowerCase());
	});
}

function InfinityFixedList(size) {
	this.size = size;
	this.elements = new Array(size);
	this.currentIndex = 0;
}

InfinityFixedList.prototype.getAll = function() {
	var array = this.elements.sort(function(a, b) {
		return b.date - a.date;
	});
	return array;
}

InfinityFixedList.prototype.insert = function(word) {
	var a = { date: new Date().getTime(), theWord: word };

	this.elements[this.currentIndex++] = a;

	if(this.currentIndex == this.elements.length)
		this.currentIndex = 0;
}
