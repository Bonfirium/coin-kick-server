import RestError from './rest.error';

export default class FormError extends RestError {

	constructor() {
		super(null, 400);
	}

	add(field, error) {
		this.data = this.data || {};
		if (!this.data[field]) this.data[field] = [];
		this.data[field].push(error);
		return this;
	}

	isEmpty() {
		return !this.data;
	}

}
