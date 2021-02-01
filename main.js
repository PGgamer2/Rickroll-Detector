const YTapiKey = "QUl6YVN5QnRNVkdMcVgzemdvMWdLV3FTNE9naW1FLXM2TDhxbGtr";
var RickDetected = 0;

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
	document.getElementById("rickornot").innerHTML = "";
	if (!rickLink) return;
	RickDetected = 0;
	var rickYTid = youtubeParser(rickLink);
	readJSONfile("https://raw.githubusercontent.com/PGgamer2/Rickroll-Detector/main/rickrolls.json", function(text) {
		var totalLinks = JSON.parse(text);
		
		// Check if video ID is between these ones
		if (typeof(rickYTid) == 'string') {
			for (var i = 0; i < totalLinks.YouTube.Video.length; i++) {
				if (rickYTid == youtubeParser(totalLinks.YouTube.Video[i])) {
					RickDetected = 1;
				}
			}
		}
		
		if (typeof(rickYTid) == 'string' && RickDetected == 0) {
			readJSONfile("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + rickYTid + "&key=" + atob(YTapiKey), function(text) {
				var videoInfos = JSON.parse(text);
				
				// Check if video author is between these ones
				for (var i = 0; i < totalLinks.YouTube.Channel.length; i++) {
					if (totalLinks.YouTube.Channel[i] == videoInfos.items[0].snippet.channelId) {
						RickDetected = 1;
					}
				}
				
				// Check if title contains the rickroll word
				if (RickDetected == 0 && videoInfos.items[0].snippet.title.replace(/ /g, '').toLowerCase().includes("rickroll")) {
					RickDetected = 2;
				}
				// Check if description contains the rickroll word
				if (RickDetected == 0 && videoInfos.items[0].snippet.description.replace(/ /g, '').toLowerCase().includes("rickroll")) {
					RickDetected = 2;
				}
				
				DisplayRickRoll();
			});
		} else {
			DisplayRickRoll();
		}
	});
}

function DisplayRickRoll() {
	switch (RickDetected) {
		case 1:
			document.getElementById("rickornot").innerHTML = "A Rickroll has been detected!";
			document.getElementById("rickornot").style.color = "red";
			break;
		case 2:
			document.getElementById("rickornot").innerHTML = "Maybe this is a Rickroll. <i>But I'm not sure...</i>";
			document.getElementById("rickornot").style.color = "yellow";
			break;
		default:
			document.getElementById("rickornot").innerHTML = "This URL seems Rick-free! You're safe.";
			document.getElementById("rickornot").style.color = "white";
			break;
	}
}