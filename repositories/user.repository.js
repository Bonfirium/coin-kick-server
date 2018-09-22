import bcrypt from 'bcrypt';

/** @type MongooseModel */
import model from '../models/user.model';

export const errors = {
	ALREADY_EXISTS: 'already exists',
	USER_NOT_FOUND: 'user not found',
};

export async function createUser(email, password) {
	if (await model.findOne({ email })) throw new Error(errors.ALREADY_EXISTS);
	return model.create({ email, password_hash: await bcrypt.hash(password, 10) });
}

export async function findUserById(id) {
	const User = await model.findOne({ _id: id });
	if (!User) throw new Error(errors.USER_NOT_FOUND);
	return User;
}

export async function updateUserById(id, { displayName }) {
	const User = await model.updateOne({ _id: id }, { $set: { displayName } });
	User.displayName = displayName;
	return User.save();
}
