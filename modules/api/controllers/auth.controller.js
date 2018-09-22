import { promisify } from 'util';

import { STATUS_CODE } from '../api.constants';
import { addRestHandler } from '../api.module';
import FormError from '../errors/form.error';
import { auth, onlyLogged } from '../forms/auth.form';
import UserModel from '../../../models/user.model';
import { createUser, errors } from '../../../services/user.service';
import RestError from '../errors/rest.error';
import bcrypt from 'bcrypt';

export function init() {
	addRestHandler('post', '/api/auth/sign-up', auth, signUp);
	addRestHandler('get', '/api/auth/me', onlyLogged, getCurrentUser);
	addRestHandler('get', '/api/auth/sign-out', onlyLogged, signOut);
	addRestHandler('post', '/api/auth/sign-in', auth, signIn);
}

async function signUp({ form: { email, password }, req }) {
	try {
		const user = await createUser(email, password);
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
	return UserModel.findById(user);
}

function signOut({ req }) {
	req.logout();
}

async function signIn({ form: { email, password }, req }) {
	const error = new RestError('email or password is invalid', STATUS_CODE.UNPROCESSABLE_ENTITY);
	const user = await UserModel.findOne({ email });
	if (!user || !await bcrypt.compare(password, user.password_hash)) throw error;
	await promisify((cb) => req.login(user, cb))();
	return user;
}
