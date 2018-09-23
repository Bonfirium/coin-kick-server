import {
	FIELD_NOT_PROVIDED,
	GET_OVER_MAX_LENGTH_ERROR,
	GET_UNDER_MIN_LENGTH_ERROR, NOT_A_STRING,
	NOT_A_STRING_OR_THE_NULL,
} from './_form-errors';
import FormError from '../errors/form.error';
import { onlyLogged } from "./auth.form";

export function setDisplayName({ body: { displayName } }) {
	onlyLogged(...arguments);
	if (displayName === null) return { displayName };
	if (!displayName) throw new FormError().add('displayName', FIELD_NOT_PROVIDED);
	if (typeof displayName !== 'string') throw new FormError().add('displayName', NOT_A_STRING_OR_THE_NULL);
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

export function getDepositAddress({ query: { currency } }) {
	onlyLogged(...arguments);
	if (!currency) throw new FormError().add('currency', FIELD_NOT_PROVIDED);
	if (typeof currency !== 'string') throw new FormError().add(currency, NOT_A_STRING);
	if (currency.length === 0) throw new FormError().add('currency', GET_UNDER_MIN_LENGTH_ERROR(0));
	return { currency };
}
