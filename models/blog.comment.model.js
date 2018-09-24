import mongoose from 'mongoose';

export default mongoose.model('blog_news', new mongoose.Schema({
	// todo deep comments ?
	parent: { type: mongoose.Schema.Types.ObjectId, ref: 'blog_news', required: true },
	likes: { type: Number, default: 0 },
	text: { type: String, required: true },
}, { timestamp: true }));

/**
 * @typedef {Object} UserDocument
 * @property {String} parent
 * @property {String} text
 */
