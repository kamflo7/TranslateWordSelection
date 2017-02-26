var SEARCH = "dictionary.cambridge.org";
var SEARCH_FIELD_ID = "cdo-search-input";
var SUBMIT_BUTTON = "button.cdo-search__button";
var list = new InfinityFixedList(25);

(function initScript() {
	chrome.contextMenus.create({ 
		title: "CambridgeDictionary: %s",
		contexts: ["selection"],
		onclick: function(info, tab) { doTranslateSelection(info.selectionText.trim().toLowerCase(), "pl"); }
	});

	chrome.commands.onCommand.addListener(function(command) {
		if(command === "go-dictionary")
			onShortcutCommand("pl");
		else if(command === "go-dictionary-eng")
			onShortcutCommand("en");
	});

	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		//console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
		if(request.msg == "getList")
			sendResponse({list: list.getAll()});
	});
})();

// Main two in order first events
function onShortcutCommand(lang) {
	getSelection(function(word) {
		doTranslateSelection(word, lang);
	});
}

function doTranslateSelection(word, lang) {
	searchDictionaryTab(function(tab) {
		if(tab == null) {
			var href = "http://dictionary.cambridge.org/dictionary/" + (lang == "en" ? "english" : "english-polish") + "/" + word;
			chrome.tabs.create({url: href}, function(tab) {
				afterUpdateTab(tab);
			});
		} else {
			//updateTabUrl(word, lang, tab);
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
			chrome.tabs.executeScript(tab.id, { code: "var s = document.querySelectorAll('.fcdo-volume-up'); if(s != null) s[1].click();" });
			chrome.tabs.onUpdated.removeListener(listener);
		}
	};

	chrome.tabs.onUpdated.addListener(listener);
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
	chrome.tabs.executeScript(dictionaryTab.id, { code: 'document.getElementById("cdo-search-input").value = "'+word+'"; document.querySelector("button.cdo-search__button").click();' }, function(e) {
		afterUpdateTab(dictionaryTab);
	});
}

function getSelection(listener) {
	chrome.tabs.executeScript( {code: "window.getSelection().toString();"}, function(selection) {
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
