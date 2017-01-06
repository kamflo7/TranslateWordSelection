var SEARCH = "dictionary.cambridge.org";
var list = new InfinityFixedList(25);

chrome.commands.onCommand.addListener(function(command) {
	if(command === "go-dictionary") {
		onTranslateCommand("pl");
	} else if(command === "go-dictionary-eng") {
		onTranslateCommand("en");
	}
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
	
	if(request.msg == "getList")
	  sendResponse({list: list.getAll()});
});

function onTranslateCommand(lang) {
	searchDictionaryTab(function(tab) {
		getSelection(function(word) {
			if(tab == null) {
				var href = "http://dictionary.cambridge.org/dictionary/" + (lang == "en" ? "english" : "english-polish") + "/" + word;
				chrome.tabs.create({url: href}, function(tab) {
					afterUpdateTab(tab);
				});
			} else {
				updateTabUrl(word, lang, tab);
			}

			list.insert(word);
		});
	});
}

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