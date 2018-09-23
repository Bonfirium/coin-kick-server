import xor from 'buffer-xor';
/** @type AppConfig */
import config from 'config';
import ethUtil from 'ethereumjs-util';

import CurrencyModel from '../models/currency.model';
import UserModel from '../models/user.model';
import WalletModel from '../models/wallet.model';
import { ETHEREUM } from '../constants/wallet.constants';

export const errors = {
	CURRENCY_NOT_SUPPORTED: 'CURRENCY_NOT_SUPPORTED',
	UNKNOWN_CURRENCY: 'UNKNOWN_CURRENCY',
	USER_NOT_FOUND: 'USER_NOT_FOUND',
};

export async function getDepositAddress(userId, currency) {
	const user = await UserModel.findById(userId);
	if (!user) throw new Error(errors.USER_NOT_FOUND);
	const Currency = await CurrencyModel.findOne({ name: currency });
	if (!Currency) throw new Error(errors.UNKNOWN_CURRENCY);
	if (!Currency.isEnabled) throw new Error(errors.CURRENCY_NOT_SUPPORTED);
	return await WalletModel.findOne({ user: userId, currency: Currency._id }) || await createWallet(userId, Currency);
}

async function createWallet(userId, Currency) {
	const pk = Buffer.from(new Array(32).fill(0).map(() => Math.floor(Math.random() * 256)));
	const address = pkToAddress(Currency, pk);
	return WalletModel.create({
		currency: Currency._id,
		address,
		encryptedPK: encryptOrDecryptPK(pk, config.encryptionKey),
		user: userId,
	});
}

function encryptOrDecryptPK(privateKey, key) {
	return xor(privateKey, ethUtil.sha256(key));
}

export function pkToAddress(currency, privateKey) {
	currency = currency.name || currency;
	switch (currency) {
		case ETHEREUM.name:
			return `0x${ethUtil.privateToAddress(privateKey).toString('hex').toLowerCase()}`;
		default:
			throw new Error(`unknown currency ${currency}`);
	}
}
