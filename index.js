import { getLogger } from 'log4js';

import { connect } from './connections/mongodb.connection';
import Modules from './modules/index';

const logger = getLogger();
logger.level = 'trace';

async function main() {
	logger.trace('start server initializing');
	// noinspection JSCheckFunctionSignatures
	await Promise.all([
		connect(),
		Modules.ApiModule.init(),
	]);
	logger.info('server has been started');
}

// noinspection JSIgnoredPromiseFromCall
main();

/**
 * @typedef {Object} AppConfig
 * @property {Object} api
 * @property {Number} api.port
 * @property {Object} db
 * @property {String} db.port
 * @property {String} db.name
 */
