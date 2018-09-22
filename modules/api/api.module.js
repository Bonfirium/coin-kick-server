import bodyParser from 'body-parser';
/** @type AppConfig */
import config from 'config';
import express from 'express';
import { getLogger } from 'log4js';

import { STATUS_CODE } from './constants';
import * as AuthController from './controllers/auth.controller';
import RestError from './errors/rest.error';

const logger = getLogger('api.module');
const { OK, INTERNAL_SERVER_ERROR } = STATUS_CODE;

let app;
let server;

export async function init() {
	logger.trace('start API-module initializing');
	app = express();
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	await new Promise((resolve) => {
		server = app.listen(config.api.port, () => resolve());
	});
	app.get('/api/hello', (req, res) => res.status(OK).json({ result: 'hello!', status: OK }));
	[AuthController].forEach(({ init }) => init());
	logger.info('API-module has been started');
}

export function addRestHandler(method, route, validator, handler) {
	app[method](route, (req, res) => {
		try {
			const form = validator(req);
			const result = handler({ form });
			res.status(OK).json({ result, status: OK });
		} catch (error) {
			if (error instanceof RestError) {
				return res.status(error.status).json({ error: error.data, status: error.status });
			}
			return res.status(INTERNAL_SERVER_ERROR).json('server side error');
		}
	});
}
