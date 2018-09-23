import BN from 'bignumber.js';

import CurrencyModel from '../models/currency.model';
import TxModel from '../models/tx.model';
import WalletModel from '../models/wallet.model';

export async function expand(user) {
	const walletByCurrency = await WalletModel.find({ user: user._id })
		.then((wallets) => wallets.reduce((acc, wallet) => {
			acc[wallet.currency.toString()] = wallet;
			return acc;
		}, {}));
	const txsByWallet = await TxModel.find({
		wallet: { $in: Object.values(walletByCurrency).map(({ _id }) => _id.toString()) },
	}).then((res) => res.reduce((acc, tx) => {
		const walletId = tx.wallet.toString();
		if (!acc[walletId]) acc[walletId] = [tx];
		else acc[walletId].push(tx);
		return acc;
	}, {}));
	return {
		email: user.email,
		displayName: user.displayName,
		currencies: await CurrencyModel.find(null, null, { sort: 'priority' })
			.then((res) => Promise.all(res.map(async (Currency) => {
				const Wallet = walletByCurrency[Currency._id.toString()];
				let balance = new BN(0);
				if (Wallet) {
					balance = (txsByWallet[Wallet._id.toString()] || [])
						.reduce((acc, { value }) => acc.plus(value), new BN(0));
				}
				return {
					name: Currency.name,
					displayName: Currency.displayName,
					shortName: Currency.shortName,
					isEnabled: Currency.isEnabled,
					maxPrecision: Currency.maxPrecision,
					balance: balance.toString(),
				};
			}))),
	};
}
