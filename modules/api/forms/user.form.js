import {
	FIELD_NOT_PROVIDED,
	GET_OVER_MAX_LENGTH_ERROR,
	GET_UNDER_MIN_LENGTH_ERROR,
	IS_NOT_STRING_OR_NULL,
} from './_form-errors';
import FormError from '../errors/form.error';
import { onlyLogged } from "./auth.form";

export function setDisplayName({ body: { displayName } }) {
	onlyLogged(...arguments);
	if (displayName === null) return { displayName };
	if (!displayName) throw new FormError().add('displayName', FIELD_NOT_PROVIDED);
	if (typeof displayName !== 'string') throw new FormError().add('displayName', IS_NOT_STRING_OR_NULL);
	const minLength = 2;
	if (displayName.length < minLength) {
		throw new FormError().add('displayName', GET_UNDER_MIN_LENGTH_ERROR(minLength));
	}
	const maxLength = 32;
	if (displayName.length > maxLength) {
		throw new FormError().add('displayName', GET_OVER_MAX_LENGTH_ERROR(maxLength));
	}
	return { displayName };
}

export function updateUser({ body: { displayName } }) {
	onlyLogged(arguments[0]);
	const error = new FormError();
	if (!displayName) error.add('id', FIELD_NOT_PROVIDED);
	if (!error.isEmpty()) throw error;
	return { displayName };
}
