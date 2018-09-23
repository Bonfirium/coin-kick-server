import { Types } from 'mongoose';
import { FIELD_NOT_PROVIDED, NOT_OBJECT_ID } from './_form-errors';
import { PAGINATION } from '../api.constants';
import FormError from '../errors/form.error';
import RestError from '../errors/rest.error';
import { onlyLogged } from "./auth.form";

const _isValidObjectId = (id) => Types.ObjectId.isValid(id);

function pagination(count = PAGINATION.DEFAULT_COUNT, offset = 0) {
	const error = new FormError();
	console.log(count);
	count = parseInt(count);
	if (Number.isNaN(count)) error.add('count', 'not an integer');
	else {
		if (count <= 0) error.add('count', 'must be greater than 0');
		if (count > PAGINATION.MAX_COUNT)
			error.add('count', `must be less than or equal to ${PAGINATION.MAX_COUNT}`)
	}

	offset = parseInt(offset);
	if (Number.isNaN(offset)) error.add('offset', 'not an integer');
	else {
		if (offset < 0) error.add('offset', 'must be greater than or equal to 0');
	}

	if (!error.isEmpty()) throw error;
	return { count, offset };
}


export function getProjects({ query: { count, offset } }) {
	onlyLogged(arguments[0]);
	// todo try-catch to throw from this function ?
	return pagination(count, offset);
}

export function createProject({ body: { title, description } }) {
	onlyLogged(arguments[0]);
	const error = new FormError();

	if (title === undefined) error.add('title', FIELD_NOT_PROVIDED);
	else {
		if (typeof title !== 'string') error.add('title', 'not a string');
	}

	if (description === undefined) error.add('description', FIELD_NOT_PROVIDED);
	else {
		if (typeof description !== 'string') error.add('description', 'not a string');
	}

	if (!error.isEmpty()) throw error;
	return { title, description };
}

export function getProject({ params: { id } }) {
	onlyLogged(arguments[0]);
	const error = new FormError();
	if (id === undefined) error.add('id', FIELD_NOT_PROVIDED);
	else if (!_isValidObjectId(id)) error.add('id', NOT_OBJECT_ID);

	if (!error.isEmpty()) throw error;
	return { id };
}

export function createProjectNews({ params: { projectId }, body: { text } }) {
	const error = new FormError();
	if (projectId === undefined) error.add('projectId', FIELD_NOT_PROVIDED);
	else if (!_isValidObjectId(projectId)) error.add('projectId', NOT_OBJECT_ID);
	if (typeof text !== 'string') error.add('text', 'not a string');

	if (!error.isEmpty()) throw error;
	return { projectId, text };
}

export function likeProjectNews({ params: { newsId }}) {
	const error = new FormError();
	if (newsId === undefined) error.add('newsId', FIELD_NOT_PROVIDED);
	else if (!_isValidObjectId(newsId)) error.add('newsId', NOT_OBJECT_ID);

	if (!error.isEmpty()) throw error;
	return { newsId }
}

export function createNewsComment({ params: { newsId }, body: { text } }) {
	onlyLogged(arguments[0]);
	const error = new FormError();
	if (newsId === undefined) error.add('newsId', FIELD_NOT_PROVIDED);
	else if (!_isValidObjectId(newsId)) error.add('newsId', NOT_OBJECT_ID);
	if (text === undefined) error.add('text', FIELD_NOT_PROVIDED);
	else {
		if (typeof text !== 'string') error.add('text', 'not a string');
	}

	if (!error.isEmpty()) throw error;
	return { newsId, text };
}

export function likeNewsComment({ params: { commentId } }) {
	onlyLogged(arguments[0]);
	const error = new FormError();
	if (commentId === undefined) error.add('commentId', FIELD_NOT_PROVIDED);
	else if (!_isValidObjectId(commentId)) error.add('commentId', NOT_OBJECT_ID);
	return { commentId };
}