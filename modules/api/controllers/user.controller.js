import { addRestHandler } from '../api.module';
import {
	getDepositAddress as getDepositAddressForm,
	setDisplayName as setDisplayNameForm
} from '../forms/user.form';
import { onlyLogged } from '../forms/auth.form';
import * as UserRepository from '../../../repositories/user.repository';
import { expand } from '../../../services/user.service';
import { getDepositAddress } from '../../../services/wallet.service';

export function init() {
	addRestHandler('get', '/api/user', onlyLogged, getCurrentUser);
	addRestHandler('patch', '/api/user/displayName', setDisplayNameForm, setDisplayName);
	addRestHandler('get', '/api/user/get-deposit-address', getDepositAddressForm, getDepositAddressAction);
}

function getCurrentUser({ user }) {
	return expand(user);
}

/**
 * @param {Object} form
 * @param {String} form.displayName
 * @param {UserDocument} user
 * @returns {Promise.<boolean>}
 */
async function setDisplayName({ form, user }) {
	await UserRepository.setDisplayName(user._id, form.displayName);
	return expand(user);
}

function getDepositAddressAction({ user, form }) {
	return getDepositAddress(user._id, form.currency);
}
