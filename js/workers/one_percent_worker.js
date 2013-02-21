function reqListener() {
	postMessage({'info': 1, 'message': "1% data retrieved"});
	var t1 = new Date();
	data = JSON.parse(this.responseText);
	var t2 = new Date();
	var diff = (t2-t1) / 1000; //strip ms
    postMessage({'info': 1, 'message': "1% data parsed in "+diff+" seconds"});
    postMessage({'info': 0, 'message': data});
}

var request = new XMLHttpRequest();
request.onload = reqListener;
request.open("get", "../../data/FOF_1_percent.json", true);
request.send();
