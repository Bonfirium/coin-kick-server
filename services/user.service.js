import model from '../models/user.model';
import bcrypt from 'bcrypt';
import { execIndependent } from '../helpers/atomic-operations.helper';

export const errors = {
	ALREADY_EXISTS: 'ALREADY_EXISTS',
};

export const salt = 13;

export function createUser(email, password) {
	return execIndependent(async () => {
		if (await model.findOne({ email })) throw new Error(errors.ALREADY_EXISTS);
		return model.create({ email, password_hash: await bcrypt.hash(password, salt) });
	});
}
