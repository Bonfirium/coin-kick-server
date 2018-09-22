import { model, Schema, Types } from 'mongoose';

import { ALL_TARGETS } from '../constants/wallet.constants';

export const schema = new Schema({
	user: { type: Types.ObjectId, required: true, index: true },
	target: { type: String, enum: ALL_TARGETS, required: true },
	address: {
		type: String,
		required: true,
		unique: true,
		index: true,
	},
	encrypted_private_key: { type: String, required: true, unique: true },
});

export default model('wallet', schema);
