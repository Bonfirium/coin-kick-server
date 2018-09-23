/** @type AppConfig */
import config from 'config';
import { getLogger } from 'log4js';
import Web3 from 'web3';

const logger = getLogger('ethereum.connection');
/** @type Web3 */
let web3 = null;

export async function connect() {
	logger.trace('start connecting to ethereum');
	web3 = new Web3(new Web3.providers.WebsocketProvider(config.ethereum.url));
	const blockNumber = await web3.eth.getBlockNumber();
	if (!Number.isFinite(blockNumber) || !Number.isSafeInteger(blockNumber) || blockNumber < 1) {
		throw new Error('not connected');
	}
	logger.info('connected to ethereum');
}

export function getBlockNumber() {
	return web3.eth.getBlockNumber();
}

export function getBlock(index) {
	return web3.eth.getBlock(index);
}

/**
 * @param txId
 * @returns {Promise<{ to:String, value:String, hash:String }>}
 */
export async function getTransaction(txId) {
	const result = await web3.eth.getTransaction(txId);
	if (result.to) result.to = result.to.toLowerCase();
	return result;
}
