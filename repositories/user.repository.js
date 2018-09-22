import bcrypt from 'bcrypt';

/** @type MongooseModel */
import model from '../models/user.model';

export const errors = {
	ALREADY_EXISTS: 'already exists',
};

export async function createUser(email, password) {
	if (await model.findOne({ email })) throw new Error(errors.ALREADY_EXISTS);
	return model.create({ email, password_hash: await bcrypt.hash(password, 10) });
}
