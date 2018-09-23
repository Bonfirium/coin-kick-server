import { getLogger } from 'log4js';

import { connect } from './connections/mongodb.connection';
import Modules from './modules/index';

const logger = getLogger();
logger.level = 'trace';

async function main() {
	logger.trace('start server initializing');
	// noinspection JSCheckFunctionSignatures
	await connect();
	switch (process.env.MODULE) {
		case 'API':
			await Modules.ApiModule.init();
			break;
		case 'WORKERS':
			await Modules.EthereumWorker.init();
			break;
		default:
			throw new Error('invalid MODULE');
	}
	logger.info('server has been started');
}

// noinspection JSIgnoredPromiseFromCall
main();

/**
 * @typedef {Object} AppConfig
 * @property {Object} api
 * @property {Number} api.port
 * @property {String} api.session_secret
 * @property {Boolean} cors
 * @property {Object} db
 * @property {String} db.port
 * @property {String} db.name
 * @property {Object} ethereum
 * @property {String} encryptionKey
 * @property {String} ethereum.url
 */

/**
 * @typedef {Object} MongooseDocument
 * @property {String} _id
 */
