import { connect } from '../connections/mongodb.connection';
import CurrencyModel from '../models/currency.model';
import * as UserRepo from '../repositories/user.repository';
import BlogProjectModel from '../models/blog.project.model';
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

	const User = await UserRepo.create('startup@gmail.com', 'qweasd123');
	await BlogProjectModel.create([
		{
			title: 'First Project',
			description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
			lead: User._id,
		},
		{
			title: 'Second cool project',
			description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
			lead: User._id,
		},
		{
			title: 'One another awesome project',
			description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
			lead: User._id,
		},
	]);
}

main().then(() => {
	console.log('Done');
	process.exit();
});
