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
			} else if (parseInt(rawFile.status) >= 400) {
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
		} else totalLinks = JSON.parse(callback);
		
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
					if (callback == 403) {
						RickDetected = -2; // YT quota exceeded
					} else RickDetected = -1;
				} else videoInfos = JSON.parse(callback);
				
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
					
					if (RickDetected == 0) {
						var vidTitle = videoInfos.items[0].snippet.title.replace(/ /g, '').toLowerCase();
						var vidDescription = videoInfos.items[0].snippet.description.replace(/ /g, '').toLowerCase();
						
						if (vidTitle.indexOf("rickroll") !== -1 || vidTitle.indexOf("nevergonnagiveyouup") !== -1 || vidTitle.indexOf("rickastley")!== -1 ) {
							// Check if title contains any combination of "nevergonnagiveyouup"
							RickDetected = 2;
						} else if (vidDescription.indexOf("rickroll") !== -1 || vidDescription.indexOf("nevergonnagiveyouup" || vidTitle.indexOf("rickastley")!== -1) !== -1) {
							// Check if description contains any combination of "nevergonnagiveyouup"
							RickDetected = 2;
						}
					}
				} catch (error) {
					RickDetected = -1;
				}
				
				DisplayRickRoll(rickYTid);
			});
		} else {
			DisplayRickRoll(rickYTid);
		}
	});
}

const resultMessages = [["This URL seems Rickroll-free! You're safe.", "lightgreen"],
						["A Rickroll has been detected!", "red"],
						["This is probably a Rickroll.", "yellow"]];
const errorsMessages = [["This isn't a valid YouTube URL!", "white"],
						["YouTube quota has been exceeded. Try again later.", "purple"],
						["An error has occurred! Cannot get the blacklist.", "violet"]];
function DisplayRickRoll(ytID) {
	lastYTid = ytID;
	if (RickDetected < 0 || RickDetected == 1) {
		document.getElementById("addToHistory").style.display = "none";
	} else {
		document.getElementById("addToHistory").style.display = "";
	}
	if (RickDetected == 1) addToHistory(ytID);
	
	if (RickDetected < 0) {
		document.getElementById("rickornot").innerHTML = errorsMessages[-RickDetected - 1][0];
		document.getElementById("rickornot").style.color = errorsMessages[-RickDetected - 1][1];
	} else {
		document.getElementById("rickornot").innerHTML = resultMessages[RickDetected][0];
		document.getElementById("rickornot").style.color = resultMessages[RickDetected][1];
	}
}
