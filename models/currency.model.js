import mongoose from 'mongoose';

export default mongoose.model('currency', new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	shortName: { type: String, required: true, unique: true },
	priority: { type: Number, required: true, default: 0 },
	isEnabled: { type: Boolean, required: true, default: false },
	maxPrecision: { type: Number, required: true },
}, { timestamp: true }));
