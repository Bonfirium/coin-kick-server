import mongoose from 'mongoose';

export default mongoose.model('user', new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		index: true,
	},
	displayName: { type: String, default: null },
	passwordHash: { type: String, required: true },
}, { timestamp: true }));

/**
 * @typedef {MongooseDocument} UserDocument
 * @property {String} email
 * @property {String} passwordHash
 */
