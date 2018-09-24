/** @type MongooseModel */
import model from '../models/blog.news.model';

export const errors = {
	NOT_FOUND: 'NOT_FOUND',
};

export function findById(id) {
	return model.findById(id);
}

export function count() {
	return model.count(...arguments);
}

export function find() {
	return model.find(...arguments);
}

export function aggregate() {
	return model.aggregate(...arguments);
}

export function create() {
	return model.create(...arguments);
}
