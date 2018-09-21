import validator from 'validator';

import { FIELD_NOT_PROVIDED } from './_form-errors';
import FormError from '../errors/form.error';

const MIN_PASSWORD_LENGTH = 9;
const MAX_PASSWORD_LENGTH = 32;
const PASSWORD_VALIDATOR = /^[a-zA-Z\d,./<>?;':"[\]\\{}|!@#$%^&*()-_=+`~]*$/;

export function auth({ body: { email, password } }) {
	const error = new FormError();
	if (!email) error.add('email', FIELD_NOT_PROVIDED);
	else if (!validator.isEmail(email)) error.add('email', 'invalid email format');
	if (!password) error.add('password', FIELD_NOT_PROVIDED);
	else {
		if (password.length < MIN_PASSWORD_LENGTH) {
			error.add('password', {
				message: 'is less than $MIN_LENGTH characters',
				$MIN_LENGTH: MIN_PASSWORD_LENGTH,
			});
		}
		if (password.length > MAX_PASSWORD_LENGTH) {
			error.add('password', {
				message: 'is greater than $MAX_LENGTH characters',
				$MAX_LENGTH: MAX_PASSWORD_LENGTH,
			});
		}
		if (!PASSWORD_VALIDATOR.test(password)) error.add('password', 'contains invalid characters');
	}
	if (!error.isEmpty()) throw error;
	return { email, password };
}
