import mongoose from 'mongoose';

export default mongoose.model('currency', new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	displayName: { type: String, required: true },
	shortName: { type: String, required: true, unique: true },
	priority: { type: Number, required: true, default: 0 },
	isEnabled: { type: Boolean, required: true, default: false },
	maxPrecision: { type: Number, required: true },
	lastProcessedBlockIndex: { type: Number, default: null },
}, { timestamp: true }));
