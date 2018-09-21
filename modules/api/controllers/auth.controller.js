import { addRestHandler } from '../api.module';
import { auth } from '../forms/auth.form';

export function init() {
	addRestHandler('post', '/api/test/form', auth, testForm);
}

function testForm({ form }) {
	console.log(form);
	return true;
}
