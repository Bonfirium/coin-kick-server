import CurrencyModel from '../models/currency.model';
import WalletModel from '../models/wallet.model';

export async function expand(user) {
	const walletByCurrency = await WalletModel.find({ user: user._id })
		.then((wallets) => wallets.reduce((acc, wallet) => {
			acc[wallet.currency.toString()] = wallet;
			return acc;
		}, {}));
	return {
		email: user.email,
		displayName: user.displayName,
		currencies: await CurrencyModel.find(null, null, { sort: 'priority' })
			.then((res) => Promise.all(res.map(async (Currency) => {
				const Wallet = walletByCurrency[Currency._id.toString()];
				return {
					name: Currency.name,
					displayName: Currency.displayName,
					shortName: Currency.shortName,
					isEnabled: Currency.isEnabled,
					maxPrecision: Currency.maxPrecision,
					balance: Wallet ? Wallet.balance : '0',
				};
			}))),
	};
}
