/** @type AppConfig */
import config from 'config';
import { getLogger } from 'log4js';
import mongoose from 'mongoose';

const logger = getLogger('mongodb.connection');
// noinspection JSUnresolvedVariable
mongoose.Promise = global.Promise;

export async function connect() {
	logger.trace('start connection to mongoDB');
	await mongoose.connect(`mongodb://127.0.0.1:${config.db.port}/${config.db.name}`, { useNewUrlParser: true });
	logger.info('mongoDB has been connected');
}
