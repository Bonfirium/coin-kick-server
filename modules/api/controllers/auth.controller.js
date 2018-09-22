import { promisify } from 'util';

import { STATUS_CODE } from '../api.constants';
import { addRestHandler } from '../api.module';
import FormError from '../errors/form.error';
import { auth } from '../forms/auth.form';
import { createUser, errors } from '../../../repositories/user.repository';

export function init() {
	addRestHandler('post', '/api/auth/sign-up', auth, signUp);
}

async function signUp({ form: { email, password }, req }) {
	try {
		const user = await createUser(email, password);
		await promisify((cb) => req.logIn(user, cb));
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
