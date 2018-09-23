export const FIELD_NOT_PROVIDED = 'is not provided';
export const IS_NOT_STRING_OR_NULL = 'is not string or null';

export function GET_UNDER_MIN_LENGTH_ERROR(minLength) {
	return {
		message: 'length is less than $MIN_LENGTH characters',
		$MIN_LENGTH: minLength,
	};
}

export function GET_OVER_MAX_LENGTH_ERROR(maxLength) {
	return {
		message: 'length is greater than $MAX_LENGTH characters',
		$MAX_LENGTH: maxLength,
	};
}
