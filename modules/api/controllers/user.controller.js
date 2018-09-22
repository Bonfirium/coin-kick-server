import { STATUS_CODE } from '../api.constants';
import { addRestHandler } from '../api.module';
import FormError from '../errors/form.error';
import * as userForm from '../forms/user.form';
import { findUserById, updateUserById, errors } from '../../../repositories/user.repository';

export function init() {
	addRestHandler('get', '/api/user/:id', userForm.getUser, getUser);
	addRestHandler('put', '/api/user', userForm.updateUser, updateUser);
}

async function getUser({ form }) {
	try {
		return await findUserById(form.id);
	} catch (err) {
		switch (err.message) {
			case errors.USER_NOT_FOUND:
				throw new FormError()
					.add('id', 'user was not found')
					.setStatus(STATUS_CODE.NOT_FOUND);
			default:
				throw err;
		}
	}
}

async function updateUser({ user, form }) {
	try {
		return await updateUserById(user._id, form);
	} catch (err) {
		switch (err.message) {
			case errors.USER_NOT_FOUND:
				throw new FormError()
					.add('id', 'user was not found')
					.setStatus(STATUS_CODE.NOT_FOUND);
			default:
				throw err;
		}
	}
}
