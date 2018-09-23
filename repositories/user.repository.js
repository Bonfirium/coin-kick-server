import bcrypt from 'bcrypt';

import model from '../models/user.model';
import { execIndependent } from '../helpers/atomic-operations.helper';

export const salt = 13;
export const errors = {
	ALREADY_EXISTS: 'already exists',
};

export async function create(email, password) {
	return execIndependent(async () => {
		if (await model.findOne({ email })) throw new Error(errors.ALREADY_EXISTS);
		return model.create({ email, passwordHash: await bcrypt.hash(password, salt) });
	});
}

export function findByEmail(email) {
	return model.findOne({ email });
}

export function setDisplayName(userId, newDisplayName) {
	return model.findByIdAndUpdate(userId, { displayName: newDisplayName });
}
