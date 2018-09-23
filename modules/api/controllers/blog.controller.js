import { addRestHandler } from '../api.module';
import RestError from '../errors/rest.error';
import FormError from '../errors/form.error';
import * as blogForm from '../forms/blog.form';
import * as projectRepository from '../../../repositories/blog.project.repository';
import * as newsRepository from '../../../repositories/blog.news.repository';
import * as commentRepository from '../../../repositories/blog.comment.repository';
import * as likeRepository from '../../../repositories/blog.like.repository';

export async function init() {
	addRestHandler('get', '/api/blog', blogForm.getProjects, getProjects);
	addRestHandler('post', '/api/blog', blogForm.createProject, createProject);
	addRestHandler('get', '/api/blog/:id', blogForm.getProject, getProject);
	addRestHandler('post', '/api/blog/:projectId/news', blogForm.createProjectNews, createNews);
	addRestHandler('post', '/api/blog/news/:newsId/like', blogForm.likeProjectNews, likeNews);
	addRestHandler('post', '/api/blog/news/:newsId/comment', blogForm.createNewsComment, createNewsComment);
	addRestHandler('post', '/api/blog/news/comment/:commentId/like', blogForm.likeNewsComment, likeComment);

}

async function createProject({ form }) {
	if (await projectRepository.find({ title: form.title }))
		throw new FormError().add('title', 'already in use').setStatus(422);

	return await projectRepository.create(form);
}

async function getProjects({ form }) {
	return {
		count: await projectRepository.count({}),
		items: await projectRepository.find({}, null, {
			sort: { rating: 1 },
			skip: form.offset,
			count: form.count,
		})
	};
};

async function getProject({ form }) {
	const Project = projectRepository.findById(form.id);
	if (!Project) throw new RestError('project not found', 404);

	const newsAndComments = await newsRepository.aggregate([
		{ $match: { project: Project._id } },
		{ $sort: { rating: -1, createdAt: 1 } },
		{
			$lookup: {
				from: 'blog_comments',
				let: {
					parent: '$_id',
				},
				pipeline: [
					{ $match: { $expr: { $eq: ['$parent', '$$parent'] } } },
					{ $sort: { rating: -1, createdAt: 1 } },
				],
				as: 'comments',
			},
		},
	]);

	return { project: Project, blog: newsAndComments };
};

async function createNews({ user, form: { projectId, ...form } }) {
	const Project = await projectRepository.findById(projectId);
	if (!Project) throw new RestError('project not found', 404);

	if (Project.lead.toString() !== user._id.toString())
		throw new RestError('you are not lead of this project', 422);

	return await newsRepository.create(form);
}

async function _like(userId, Item) {
	const Like = await likeRepository.find({ user: userId, item: Item._id });
	if (Like) {
		Item.rating -= 1;
		await Promise.all([
			Like.remove(),
			Item.save(),
		]);
	} else {
		Item.rating += 1;
		await Promise.all([
			Item.save(),
			likeRepository.create({
				user: userId,
				item: Item._id,
			}),
		]);
	}
	return Item;
}

async function likeNews({ user, form: { newsId } }) {
	const News = await newsRepository.findById(newsId);
	if (!News) throw new RestError('news not found', 404);
	return _like(user._id, News);
}

async function createNewsComment({ user, form: { newsId, ...form } }) {
	return await commentRepository.create(form);
}

async function likeComment({ user, form: { commentId } }) {
	const Comment = await commentRepository.findById(commentId);
	if (!Comment) throw new RestError('comment not found', 404);
	return _like(user._id, Comment);
}