import { TIME } from '../../constants/common.constants';

export const STATUS_CODE = {
	OK: 200,
	BAD_REQUEST: 400,
	INTERNAL_SERVER_ERROR: 500,
	UNAUTHORIZED: 401,
	NOT_FOUND: 404,
	UNPROCESSABLE_ENTITY: 422,
};

export const COOKIES_LIFETIME = TIME.WEEK;
