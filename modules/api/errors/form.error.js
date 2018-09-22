import RestError from './rest.error';
import { STATUS_CODE } from '../api.constants';

export default class FormError extends RestError {

	constructor() {
		super(null, STATUS_CODE.BAD_REQUEST);
	}

	/**
	 * @param {String} field
	 * @param {String|{message:String}} error
	 * @returns {FormError}
	 */
	add(field, error) {
		this.data = this.data || {};
		if (!this.data[field]) this.data[field] = [];
		this.data[field].push(error);
		return this;
	}

	setStatus(newStatus) {
		this.status = newStatus;
		return this;
	}

	isEmpty() {
		return !this.data;
	}

}
