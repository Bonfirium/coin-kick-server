import { connect } from '../connections/mongodb.connection';
import CurrencyModel from '../models/currency.model';
import { ETHEREUM } from '../constants/wallet.constants';

async function main() {
	await connect();
	await CurrencyModel.create([{
		...ETHEREUM,
		displayName: 'Ethereum',
		priority: 1500,
		isEnabled: true,
	}, {
		name: 'bitcoin',
		displayName: 'Bitcoin',
		shortName: 'BTC',
		priority: 1400,
		isEnabled: false,
		maxPrecision: 8,
	}, {
		name: 'litecoin',
		displayName: 'Litecoin',
		shortName: 'LTC',
		priority: 1300,
		isEnabled: false,
		maxPrecision: 8,
	}, {
		name: 'eos',
		displayName: 'EOS',
		shortName: 'EOS',
		priority: 1400,
		isEnabled: false,
		maxPrecision: 4,
	}, {
		name: 'bitshares',
		displayName: 'BitShares',
		shortName: 'BTS',
		priority: 1300,
		isEnabled: false,
		maxPrecision: 12,
	}]);
}

main().then(() => {
	console.log('Done');
	process.exit();
});
