import mongoose from 'mongoose';

export default mongoose.model('user', new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		index: true,
	},
	password_hash: { type: String, required: true },
}, { timestamp: true }));
