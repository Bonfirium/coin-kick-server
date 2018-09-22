import { FIELD_NOT_PROVIDED } from './_form-errors';
import FormError from '../errors/form.error';
import { onlyLogged } from "./auth.form";

export function getUser({ params: { id } }) {
	onlyLogged(arguments[0]);
	const error = new FormError();
	if (!id) error.add('id', FIELD_NOT_PROVIDED);
	if (!error.isEmpty()) throw error;
	return { id };
}

export function updateUser({ body: { displayName } }) {
	onlyLogged(arguments[0]);
	const error = new FormError();
	if (!displayName) error.add('id', FIELD_NOT_PROVIDED);
	if (!error.isEmpty()) throw error;
	return { displayName };
}
