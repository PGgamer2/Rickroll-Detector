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
	var rickYTid = youtubeParser(rickLink);
	readJSONfile("rickrolls.json", function(text){
		var totalLinks = JSON.parse(text);
		
		for (var i = 0; i < totalLinks.YouTube.length; i++) {
			if (typeof(rickYTid) != 'string') break;
			if (rickYTid == youtubeParser(totalLinks.YouTube[i])) {
				document.getElementById("rickornot").innerHTML = "A Rickroll has been detected!";
				document.getElementById("rickornot").style.color = "red";
				return;
			}
		}
		
		document.getElementById("rickornot").innerHTML = "This URL seems Rick-free! You're safe.";
		document.getElementById("rickornot").style.color = "white";
	});
}