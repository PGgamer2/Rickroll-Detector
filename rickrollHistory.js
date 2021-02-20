var rickrollHistory = [];
try { rickrollHistory = JSON.parse(getCookie("rickrollHistory")); } catch (error) {}
updateHistoryHTML();

function setCookie(name, value) {
	document.cookie = name + "=" + value + ";";
}

function getCookie(c_name) {
	if (document.cookie.length > 0) {
		c_start = document.cookie.indexOf(c_name + "=");
		if (c_start != -1) {
			c_start = c_start + c_name.length + 1;
			c_end = document.cookie.indexOf(";", c_start);
			if (c_end == -1) {
				c_end = document.cookie.length;
			}
			return unescape(document.cookie.substring(c_start, c_end));
		}
	}
	return "";
}

function updateHistoryHTML() {
	var listNode = document.getElementById("HistoryList");
	listNode.innerHTML = '';
	if (rickrollHistory.length < 1) {
		document.getElementById("rickrollhistoryLabel").style.display = "none";
	}
	else
	{
		document.getElementById("rickrollhistoryLabel").style.display = "initial";
		for (var i = 0; i < rickrollHistory.length; i++) {
			var pelem = document.createElement("p");
			var nodeURL = document.createTextNode(rickrollHistory[i]);
			var nodeRemButton = document.createElement("button");
			nodeRemButton.style.marginLeft = "10px";
			nodeRemButton.innerHTML = "-";
			nodeRemButton.setAttribute( "onclick", "javascript: removeFromHistory('" + rickrollHistory[i] + "');" );
			pelem.appendChild(nodeURL);
			pelem.appendChild(nodeRemButton);
			listNode.appendChild(pelem);
		}
	}
}

function removeFromHistory(url) {
	var elemToRemove = rickrollHistory.indexOf(url);
	if (elemToRemove > -1) {
	   rickrollHistory.splice(elemToRemove, 1);
	}
	
	setCookie("rickrollHistory", JSON.stringify(rickrollHistory));
	updateHistoryHTML();
}

function addToHistory(ytID) {
	var url = "https://youtu.be/" + ytID;
	if (rickrollHistory.indexOf(url) === -1) rickrollHistory.push(url);
	
	setCookie("rickrollHistory", JSON.stringify(rickrollHistory));
	updateHistoryHTML();
}