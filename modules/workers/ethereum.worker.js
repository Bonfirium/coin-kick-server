import BN from 'bignumber.js';
import { getLogger } from 'log4js';

import { connect, getBlock, getBlockNumber, getTransaction } from '../../connections/ethereum.connection';
import { ETHEREUM } from '../../constants/wallet.constants';
import CurrencyModel from '../../models/currency.model';
import TxModel from '../../models/tx.model';
import WalletModel from '../../models/wallet.model';

const logger = getLogger('ethereum.connection');
let lastProcessedBlockIndex = null;
let Ethereum;

export async function init() {
	await connect();
	Ethereum = await CurrencyModel.findOne({ name: ETHEREUM.name });
	lastProcessedBlockIndex = Ethereum.lastProcessedBlockIndex || await getBlockNumber();
	// noinspection JSIgnoredPromiseFromCall
	iterate();
}

async function iterate() {
	const blocksNumber = await getBlockNumber();
	for (let blockIndex = lastProcessedBlockIndex; blockIndex < blocksNumber - 3; blockIndex += 1) {
		logger.trace(`start processing block #${blockIndex}`);
		const block = await getBlock(blockIndex);
		const transactions = await Promise.all(block.transactions.map((txId) => getTransaction(txId)))
			.then((res) => res.filter((tx) => tx && tx.to));
		/** @type {Object.<String,{ to: String, hash: String, value: String }>} */
		const txsByReceiver = transactions.reduce((acc, tx) => {
			if (!acc[tx.to]) acc[tx.to] = [];
			acc[tx.to].push(tx);
			return acc;
		}, {});
		const Wallets = await WalletModel.find({
			currency: Ethereum._id,
			address: { $in: Object.keys(txsByReceiver) },
		});
		const WalletByAddress = Wallets.reduce((acc, Wallet) => {
			acc[Wallet.address] = Wallet;
			return acc;
		}, {});
		const processedTxs = await Promise.all(Object.keys(txsByReceiver)
			.map((receiver) => WalletByAddress[receiver])
			.filter((a) => a)
			.map(async (Wallet) => {
				const txs = txsByReceiver[Wallet.address];
				const Txs = await Promise.all(txs.map((tx) => TxModel.create({
					wallet: Wallet._id,
					txId: tx.hash,
					value: new BN(tx.value).times(`1e-${Ethereum.maxPrecision}`),
				})));
				['realBalance', 'balance'].forEach((field) => {
					Wallet.set(field, Txs.reduce((acc, { value }) =>
						acc.plus(value), new BN(Wallet.get(field))).toString());
				});
				await Wallet.save();
				return Txs;
			}));
		logger.info(`block #${blockIndex} has been processed`);
		lastProcessedBlockIndex = blockIndex;
		Ethereum.lastProcessedBlockIndex = blockIndex;
		await Ethereum.save();
		if (processedTxs.length > 0) logger.info(`processed txs:\n${processedTxs}`);
	}
	setTimeout(() => iterate(), 3000);
}
