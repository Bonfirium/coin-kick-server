import mongoose from 'mongoose';

export const schema = mongoose.Schema({
	currency: { ref: 'currency', type: mongoose.Schema.ObjectId, required: true },
	txId: { type: String, require: true },
	value: { type: String, required: true },
}, { timestamp: true });

// noinspection JSUnresolvedFunction
schema.index({ currency: 1, txId: 1 }, { unique: true });

export default mongoose.model('tx', schema, 'txs');
