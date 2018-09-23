import CurrencyModel from '../models/currency.model';

export async function expand(user) {
	return {
		email: user.email,
		displayName: user.displayName,
		currencies: await CurrencyModel.find(null, null, { sort: 'priority' }).then((res) => res.map((currencyInfo) => {
			currencyInfo.balance = '0';
		})),
	};
}
