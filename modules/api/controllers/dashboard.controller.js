import { addRestHandler } from '../api.module';
import { onlyLogged } from '../forms/auth.form';
import { execForUserWithId } from '../../../helpers/atomic-operations.helper';
import {} from '../../../models/wallet.model';

export function init() {
	addRestHandler('get', '/api/dashboard/deposit-address', onlyLogged, getDepositAddress);
}

async function getDepositAddress({ user }) {
	await execForUserWithId(user, async () => {
		await WalletModel
	});
}
