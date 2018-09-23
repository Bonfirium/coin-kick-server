import { promisify } from 'util';

import { STATUS_CODE } from '../api.constants';
import { addRestHandler } from '../api.module';
import FormError from '../errors/form.error';
import { auth, onlyLogged } from '../forms/auth.form';
import { create, errors, findByEmail } from '../../../repositories/user.repository';
import RestError from '../errors/rest.error';
import * as bcrypt from 'bcrypt';
import { expand } from '../../../services/user.service';

export function init() {
	addRestHandler('post', '/api/auth/sign-up', auth, signUp);
	addRestHandler('get', '/api/auth/sign-out', onlyLogged, signOut);
	addRestHandler('post', '/api/auth/sign-in', auth, signIn);
}

async function signUp({ form: { email, password }, req }) {
	try {
		const user = await create(email, password);
		await promisify((cb) => req.login(user, cb))();
		return expand(user);
	} catch (err) {
		if (err.message === errors.ALREADY_EXISTS) {
			throw new FormError()
				.add('email', 'user with same email is already exists')
				.setStatus(STATUS_CODE.UNPROCESSABLE_ENTITY);
		}
		throw err;
	}
}

function signOut({ req }) {
	req.logout();
	return true;
}

async function signIn({ form: { email, password }, req }) {
	const error = new RestError('email or password is invalid', STATUS_CODE.UNPROCESSABLE_ENTITY);
	const User = await findByEmail(email);
	if (!User || !await bcrypt.compare(password, User.passwordHash)) throw error;
	await promisify((cb) => req.login(User, cb))();
	return expand(User);
}
