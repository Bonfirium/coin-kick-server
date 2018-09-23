import { addRestHandler } from '../api.module';
import { setDisplayName as setDisplayNameForm } from '../forms/user.form';
import { onlyLogged } from '../forms/auth.form';
import * as UserRepository from '../../../repositories/user.repository';

export function init() {
	// noinspection JSCheckFunctionSignatures
	addRestHandler('get', '/api/user', onlyLogged, getCurrentUser);
	addRestHandler('patch', '/api/user/displayName', setDisplayNameForm, setDisplayName);
}

function getCurrentUser({ user }) {
	return user;
}

function setDisplayName({ form, user }) {
	return UserRepository.setDisplayName(user._id, form.displayName);
}
