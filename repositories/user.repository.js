import bcrypt from 'bcrypt';

import model from '../models/user.model';

export const errors = {
	ALREADY_EXISTS: 'already exists',
};

export async function create(email, password) {
	if (await model.findOne({ email })) throw new Error(errors.ALREADY_EXISTS);
	return model.create({ email, passwordHash: await bcrypt.hash(password, 10) });
}

export function findById(id) {
	return model.findById(id);
}

export function setDisplayName(userId, newDisplayName) {
	return model.findByIdAndUpdate(userId, { displayName: newDisplayName });
}
