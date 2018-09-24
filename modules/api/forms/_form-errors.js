export const FIELD_NOT_PROVIDED = 'is not provided';
export const NOT_A_STRING_OR_THE_NULL = 'is not a string or the null';
export const NOT_A_STRING = 'is not a string';
export const NOT_AN_OBJECT_ID = 'not an id';

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
