import { connect } from '../connections/mongodb.connection';
import CurrencyModel from '../models/currency.model';

async function main() {
	await connect();
	await CurrencyModel.create([{
		name: 'Ethereum',
		shortName: 'ETH',
		priority: 1500,
		isEnabled: true,
		maxPrecision: 18,
	}, {
		name: 'Bitcoin',
		shortName: 'BTC',
		priority: 1400,
		isEnabled: false,
		maxPrecision: 8,
	}, {
		name: 'Litecoin',
		shortName: 'LTC',
		priority: 1300,
		isEnabled: false,
		maxPrecision: 8,
	}, {
		name: 'EOS',
		shortName: 'EOS',
		priority: 1400,
		isEnabled: false,
		maxPrecision: 4,
	}, {
		name: 'BitShares',
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
