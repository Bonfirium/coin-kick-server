import { connect, getBlock, getBlockNumber, getTransaction } from '../../connections/ethereum.connection';
import { ETHEREUM } from '../../constants/wallet.constants';
import CurrencyModel from '../../models/currency.model';

let lastProcessedBlockIndex = null;

export async function init() {
	await connect();
	lastProcessedBlockIndex = await CurrencyModel.findOne({ name: ETHEREUM.name }).lastProcessedBlockIndex
		|| await getBlockNumber();
	// noinspection JSIgnoredPromiseFromCall
	iterate();
}

async function iterate() {
	const lastBlockNumber = await getBlockNumber();
	for (let blockIndex = lastProcessedBlockIndex; blockIndex < lastBlockNumber; blockIndex += 1) {
		const block = await getBlock(blockIndex);
		await Promise.all(block.transactions.map(async (txId) => {
			const transaction = await getTransaction(txId);
		}));
	}
	setTimeout(() => iterate(), 3000);
}
