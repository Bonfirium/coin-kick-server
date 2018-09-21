import bodyParser from 'body-parser';
import express from 'express';

import * as AuthController from './controllers/auth.controller';

let app;
let server;

export async function init() {
	app = express();
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	await new Promise((resolve) => {
		server = app.listen('16320', () => resolve());
	});
	app.get('/api/hello', (req, res) => res.status(200).json({ result: 'hello!', status: 200 }));
	[AuthController].forEach(({ init }) => init());
	console.log('API-module has been started');
}

export function addRestHandler(method, route, validator, handler) {
	app[method](route, (req, res) => {
		const form = validator(req);
		const result = handler({ form });
		res.status(200).json({ result, status: 200 });
	});
}
