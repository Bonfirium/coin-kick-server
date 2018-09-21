import RestError from './rest.error';

export default class FormError extends RestError {

	constructor(data) {
		super('form error', 400);
		this.data = data || null;
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
