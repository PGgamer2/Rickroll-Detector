const YTapiKey = "QUl6YVN5QnRNVkdMcVgzemdvMWdLV3FTNE9naW1FLXM2TDhxbGtr";
var RickDetected = false;

function readJSONfile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function youtubeParser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
}

function isThisArickroll(rickLink) {
	if (!rickLink) return;
	RickDetected = false;
	var rickYTid = youtubeParser(rickLink);
	readJSONfile("https://raw.githubusercontent.com/PGgamer2/Rickroll-Detector/main/rickrolls.json", function(text) {
		var totalLinks = JSON.parse(text);
		
		// Check if video ID is between these ones
		if (typeof(rickYTid) == 'string') {
			for (var i = 0; i < totalLinks.YouTube.Video.length; i++) {
				if (rickYTid == youtubeParser(totalLinks.YouTube.Video[i])) {
					RickDetected = true;
				}
			}
		}
		
		if (typeof(rickYTid) == 'string' && !RickDetected) {
			readJSONfile("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + rickYTid + "&key=" + atob(YTapiKey), function(text) {
				var videoInfos = JSON.parse(text);
				
				// Check if video author is between these ones
				for (var i = 0; i < totalLinks.YouTube.Channel.length; i++) {
					if (totalLinks.YouTube.Channel[i] == videoInfos.items[0].snippet.channelId) {
						RickDetected = true;
					}
				}
				
				// Check if title contains the rickroll word
				if (!RickDetected && videoInfos.items[0].snippet.title.replace(/ /g, '').toLowerCase().includes("rickroll")) {
					RickDetected = true;
				}
				// Check if description contains the rickroll word
				if (!RickDetected && videoInfos.items[0].snippet.description.replace(/ /g, '').toLowerCase().includes("rickroll")) {
					RickDetected = true;
				}
				
				DisplayRickRoll();
			});
		} else {
			DisplayRickRoll();
		}
	});
}

function DisplayRickRoll() {
	if (RickDetected) {
		document.getElementById("rickornot").innerHTML = "A Rickroll has been detected!";
		document.getElementById("rickornot").style.color = "red";
	} else {
		document.getElementById("rickornot").innerHTML = "This URL seems Rick-free! You're safe.";
		document.getElementById("rickornot").style.color = "white";
	}
}