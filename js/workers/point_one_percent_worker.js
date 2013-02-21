function reqListener() {
	postMessage({'info': 1, 'message': ".1% data retrieved"});
	data = JSON.parse(this.responseText);
    postMessage({'info': 1, 'message': ".1% data parsed"});
    postMessage({'info': 0, 'message': data});
}

var request = new XMLHttpRequest();
request.onload = reqListener;
request.open("get", "../../data/FOF_point1_percent.json", true);
request.send();
