import mongoose from 'mongoose';

export default mongoose.model('wallet', new mongoose.Schema({
	user: {
		ref: 'user',
		type: mongoose.Schema.ObjectId,
		required: true,
		default: null
	},
	currency: { ref: 'currency', type: mongoose.Schema.ObjectId, required: true },
	address: {
		type: String,
		required: true,
		unique: true,
		index: true,
	},
	encryptedPK: { type: String, required: true, unique: true },
}, { timestamp: true }));
