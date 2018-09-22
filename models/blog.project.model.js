import mongoose from 'mongoose';

export default mongoose.model('blog_project', new mongoose.Schema({
	lead: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
	title: { type: String, required: true },
	description: { type: String, required: true },
}, { timestamp: true }));

/**
 * @typedef {Object} UserDocument
 * @property {String} lead
 * @property {String} title
 * @property {String} description
 */
