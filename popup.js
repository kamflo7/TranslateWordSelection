function twoDigit(n) {
	return n > 9 ? ""+n : "0"+n;
}

function formatTimeDifference(currentDate, timestamp) {
	var difference = (currentDate.getTime() - timestamp)/1000;

	if(difference < 3600) {
		var minutes = Math.floor(difference / 60);
		var seconds = Math.floor(difference % 60);
		
		if(minutes >= 1)
			return minutes + "m ago";
		else
			return seconds + "s ago";
	} else {
		var d = new Date(timestamp);
		return d.getHours() + ":" + twoDigit(d.getMinutes());
	}
}

document.addEventListener('DOMContentLoaded', function() {
	var d = document.getElementById("result");

	chrome.runtime.sendMessage({msg: "getList"}, function(response) {
		var html = "";
		var currentDate = new Date();

		for(var i=0; i<response.list.length; i++) {
			var e = response.list[i];

			if(e == undefined) continue;

			html += formatTimeDifference(currentDate, e.date) + " -> " + e.theWord + "<br />";
		}

	  	d.innerHTML = html;
	});
});
