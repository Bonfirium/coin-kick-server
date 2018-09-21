import bodyParser from 'body-parser';
import express from 'express';

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
	console.log('Server has been started');
}
