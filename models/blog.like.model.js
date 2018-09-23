import mongoose from 'mongoose';

export default mongoose.model('blog_like', new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'blog_project', required: true },
	item: { type: mongoose.Schema.Types.ObjectId, required: true },
}, {
	_id: false,
	timestamp: true,
}));

/**
 * @typedef {Object} UserDocument
 * @property {String} project
 * @property {String} text
 */
