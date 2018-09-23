import { addRestHandler } from '../api.module';
import { setDisplayName as setDisplayNameForm } from '../forms/user.form';
import { onlyLogged } from '../forms/auth.form';
import { setDisplayName } from '../../../repositories/user.repository';

export function init() {
	// noinspection JSCheckFunctionSignatures
	addRestHandler('get', '/api/user', onlyLogged, getCurrentUser);
	addRestHandler('patch', '/api/user/displayName', setDisplayNameForm, setDisplayName);
}

function getCurrentUser({ user }) {
	return user;
}
