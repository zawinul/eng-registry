const fs = require('fs');
const engMsService = require('../eng-ms-js-service');
const storage = require('./storage.js');

// const Redis = require("ioredis");
// const redis = new Redis();

// redis.get('pippo').then(console.log);



async function main() {
	var data = storage.get();

	var cfg = {
		name: 'eng-registry',
		instanceName: 'default',
		httpPort:1111,
		httpsPort:1112,
		preValidation: preValidation
		
	};
	const service = await engMsService.init(cfg);

	function preValidation(req) { 
		//if (req.path.endsWith('/info') )
			req.isValidated = true;
	}

	if (process.argv.length>2)
		cfg.instanceName = process.argv[2];
		
	var app = service.app;
	service.addSwagger('./eng-registry.yaml');

	app.get('/ciao', function(req,res){
		res.status(200).send('ciao a te');
	});

	app.get('/service/:servicename/info', function (req, res) {
		try {
			var servicename = req.params.servicename;
			var x = data.service[servicename].info;
			x.endpoint = data.service[servicename].endpoint;
			res.status(200).send(x);
		}
		catch(e) {
			res.status(404).send({error:e});
		}
	});

	app.post('/service/:servicename/info', function(req, res){
		try {
			var servicename = req.params.servicename;
			var x = data.service[servicename];
			if (!x)
				x = data.service[servicename] = { config:{}, info: {}, endpoint:[]};
			data.service[servicename].info = req.body;	
			storage.set(data);
			res.status(200).send('OK');
		}
		catch(e) {
			res.	status(404).send(e);
		}	
	});


	app.get('/service/:servicename/config', function(req, res){
		try {
			var servicename = req.params.servicename;
			var x = data.service[servicename].config;
			res.status(200).send(x);
		}
		catch(e) {
			res.status(404).send({error:e});
		}	
	});

	app.get('/app/:appname/config', function(req, res){
		try {
			var appname = req.params.appname;
			var x = data.app[appname].config;
			res.status(200).send(x);
		}
		catch(e) {
			res.status(404).send({error:e});
		}	
	});

	app.post('/app/:appname/config', function(req, res){
		try {
			var appname = req.params.appname;
			var x = data.app[appname];
			if (!x)
				x = data.app[appname] = { config:{}};
			data.app[appname].config = req.body;	
			res.status(200).send('OK');
		}
		catch(e) {
			res.status(404).send(e);
		}	
	});

	app.put('/service/:servicename/endpoint', function(req, res) {
		res.status(200).send('ciao');
	});


	app.get('/me', function (req, res) {
		res.status(200).send(
			JSON.stringify(req.userInfo, null, 2)
		);
	});

	service.logger.info('STARTED!!!');

}

main();