const YTapiKey = "QUl6YVN5QnRNVkdMcVgzemdvMWdLV3FTNE9naW1FLXM2TDhxbGtr";
var RickDetected = 0;
var lastYTid;

function readJSONfile(file, callback) {
	var rawFile = new XMLHttpRequest();
	rawFile.overrideMimeType("application/json");
	rawFile.open("GET", file, true);
	rawFile.onreadystatechange = function() {
		if (rawFile.readyState === 4) {
			if (rawFile.status == "200") {
				callback(rawFile.responseText);
			}
			else if (parseInt(rawFile.status) >= 400) {
				callback(parseInt(rawFile.status));
			}
		}
	}
	rawFile.send(null);
}

function youtubeParser(url) {
	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(shorts\/)|(watch\?))\??v?=?([^#&?]*).*/;
	var match = url.match(regExp);
	if (match) {
		if (typeof match[7] !== 'undefined' && match[7].length==11) return match[7];
		if (typeof match[8] !== 'undefined' && match[8].length==11) return match[8];
	}
	return false;
}

function isThisArickroll(rickLink) {
	document.getElementById("rickornot").innerHTML = "";
	if (!rickLink) return;
	RickDetected = 0;
	var rickYTid = youtubeParser(rickLink);
	if (typeof(rickYTid) != 'string') RickDetected = -1;
	readJSONfile("https://raw.githubusercontent.com/PGgamer2/Rickroll-Detector/main/rickrolls.json", function(callback) {
		var totalLinks;
		if (typeof(callback) != 'string') {
			RickDetected = -3;
		}
		else totalLinks = JSON.parse(callback);
		
		// Check if video's ID is between these ones
		if (RickDetected == 0) {
			for (var i = 0; i < totalLinks.YouTube.Video.length; i++) {
				if (rickYTid == youtubeParser(totalLinks.YouTube.Video[i])) {
					RickDetected = 1;
					break;
				}
			}
			for (var i = 0; i < rickrollHistory.length; i++) {
				if (rickYTid == youtubeParser(rickrollHistory[i])) {
					RickDetected = 1;
					break;
				}
			}
		}
		
		if (RickDetected == 0) {
			readJSONfile("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + rickYTid + "&key=" + atob(YTapiKey), function(callback) {
				var videoInfos;
				if (typeof(callback) != 'string') {
					if (callback == 403)
						RickDetected = -2;
					else
						RickDetected = -1;
				}
				else videoInfos = JSON.parse(callback);
				
				try {
					// Check if video's author is between these ones
					if (RickDetected == 0) {
						for (var i = 0; i < totalLinks.YouTube.Channel.length; i++) {
							if (totalLinks.YouTube.Channel[i] == videoInfos.items[0].snippet.channelId) {
								RickDetected = 1;
								break;
							}
						}
					}
					
					var vidTitle = videoInfos.items[0].snippet.title.replace(/ /g, '').toLowerCase();
					var vidDescription = videoInfos.items[0].snippet.description.replace(/ /g, '').toLowerCase();
					
					// Check if title contains these words
					if (RickDetected == 0 && (vidTitle.indexOf("rickroll") !== -1 || vidTitle.indexOf("nevergonnagiveyouup") !== -1)) {
						RickDetected = 2;
					}
					// Check if description contains these words
					if (RickDetected == 0 && (vidDescription.indexOf("rickroll") !== -1 || vidDescription.indexOf("nevergonnagiveyouup") !== -1)) {
						RickDetected = 2;
					}
				}
				catch (error) {
					RickDetected = -1;
				}
				
				DisplayRickRoll(rickYTid);
			});
		} else {
			DisplayRickRoll(rickYTid);
		}
	});
}

function DisplayRickRoll(ytID) {
	lastYTid = ytID;
	switch (RickDetected) {
		case 1:
			document.getElementById("rickornot").innerHTML = "A Rickroll has been detected!";
			document.getElementById("rickornot").style.color = "red";
			document.getElementById("addToHistory").style.display = "none";
			addToHistory(ytID);
			break;
		case 2:
			document.getElementById("rickornot").innerHTML = "This is probably a Rickroll.";
			document.getElementById("rickornot").style.color = "yellow";
			document.getElementById("addToHistory").style.display = "";
			break;
		case 0:
			document.getElementById("rickornot").innerHTML = "This URL seems Rickroll-free! You're safe.";
			document.getElementById("rickornot").style.color = "lightgreen";
			document.getElementById("addToHistory").style.display = "";
			break;
		case -1:
			document.getElementById("rickornot").innerHTML = "This isn't a valid YouTube URL!";
			document.getElementById("rickornot").style.color = "white";
			document.getElementById("addToHistory").style.display = "none";
			break;
		case -2:
			document.getElementById("rickornot").innerHTML = "YouTube quota has been exceeded. Try again later.";
			document.getElementById("rickornot").style.color = "purple";
			document.getElementById("addToHistory").style.display = "none";
			break;
		case -3:
			document.getElementById("rickornot").innerHTML = "An error has occurred! Cannot get the blacklist.";
			document.getElementById("rickornot").style.color = "violet";
			document.getElementById("addToHistory").style.display = "none";
			break;
	}
}