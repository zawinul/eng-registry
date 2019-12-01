const fs = require("fs");
const DATAFILEPATH = "c:/workspace/eng-docs/data/registry-data.json";

var data = {};

function init() {
	try {
		var s = fs.readFileSync(DATAFILEPATH, {encoding:'utf8'});
		data = JSON.parse(s);
	}
	catch(e) {
		console.log(e);
		data = { 
			service:{},
			app: {}
		};
		set(data);
	}
}

function get(){
	return data;
}

function set(x){
	data = x;
	fs.writeFileSync(DATAFILEPATH, JSON.stringify(data,null,2),  {encoding:'utf8'});
	return data;
}


init();

module.exports = {
	get: get,
	set: set
};