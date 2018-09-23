import { promisify } from 'util';

import { STATUS_CODE } from '../api.constants';
import { addRestHandler } from '../api.module';
import FormError from '../errors/form.error';
import { auth, onlyLogged } from '../forms/auth.form';
import { create, errors } from '../../../repositories/user.repository';

export function init() {
	addRestHandler('post', '/api/auth/sign-up', auth, signUp);
	addRestHandler('get', '/api/auth/me', onlyLogged, getCurrentUser);
}

async function signUp({ form: { email, password }, req }) {
	try {
		const user = await create(email, password);
		await promisify((cb) => req.login(user, cb))();
		return user;
	} catch (err) {
		switch (err.message) {
			case errors.ALREADY_EXISTS:
				throw new FormError()
					.add('email', 'user with same email is already exists')
					.setStatus(STATUS_CODE.UNPROCESSABLE_ENTITY);
			default:
				throw err;
		}
	}
}

function getCurrentUser({ user }) {
	return user;
}
