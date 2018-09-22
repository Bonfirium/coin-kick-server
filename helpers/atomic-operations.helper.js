const separatedByUsers = 'separatedByUsers';
const independent = 'independent';

function throwUnknownTypeError() {
	throw new Error('invalid queue element type');
}

/**
 * @typedef {Object} QueueElement
 * @property {function():Promise<*>} func
 * @property {function():void} resolve
 * @property {function(error):void} reject
 * @property {QueueElement|null} next
 */

/**
 * @typedef {Object} UserQueueElement
 * @property {'separatedByUsers'} type
 * @property {Object.<String,{first:QueueElement,last:QueueElement}>} q
 * @property {UserQueueElement|IndependentQueueElement|null} next
 */

/**
 * @typedef {Object} IndependentQueueElement
 * @property {'independent'} type
 * @property {{ first:QueueElement, last:QueueElement }} q
 * @property {UserQueueElement|IndependentQueueElement|null} next
 */

/**
 * @type {{ first:UserQueueElement|IndependentQueueElement|null, last: UserQueueElement|IndependentQueueElement|null }}
 */
const globalQueue = { first: null, last: null };

export function execForUserWithId(userId, func) {
	return new Promise(async (resolve, reject) => {
		const task = { func, resolve, reject, next: null };
		const newQueueElement = { type: separatedByUsers, q: { [userId]: { first: task, last: task } }, next: null };
		if (!globalQueue.last) {
			globalQueue.first = newQueueElement;
			globalQueue.last = newQueueElement;
			await processForUserWithId(userId);
			return;
		}
		switch (globalQueue.last.type) {
			case independent:
				globalQueue.last.next = newQueueElement;
				globalQueue.last = newQueueElement;
				return;
			case separatedByUsers:
				const newTask = { func, resolve, reject, next: null };
				if (globalQueue.last.q[userId]) {
					globalQueue.last.q[userId].last.next = newTask;
					globalQueue.last.q[userId].last = newTask;
				} else {
					globalQueue.last.q[userId] = { first: task, last: task };
					await processForUserWithId(userId);
				}
				return;
			default:
				return throwUnknownTypeError();
		}
	});
}

export function execIndependent(func) {
	return new Promise(async (resolve, reject) => {
		const task = { func, resolve, reject, next: null };
		const newQueueElement = { type: independent, q: { first: task, last: task }, next: null };
		if (!globalQueue.last) {
			globalQueue.first = newQueueElement;
			globalQueue.last = globalQueue.first;
			await processIndependent();
			return;
		}
		switch (globalQueue.last.type) {
			case independent:
				globalQueue.last.q.last.next = task;
				globalQueue.last.q.last = task;
				return;
			case separatedByUsers:
				globalQueue.last.next = newQueueElement;
				globalQueue.last = newQueueElement;
				return;
			default:
				return throwUnknownTypeError();
		}
	});
}

async function processTask({ func, resolve, reject }) {
	try {
		resolve(await func());
	} catch (error) {
		reject(error);
	}
}

async function processIndependent() {
	const task = globalQueue.first.q.first;
	await processTask(task);
	if (task.next) {
		globalQueue.first.q.first = task.next;
		return;
	}
	if (!globalQueue.first.next) {
		// noinspection JSValidateTypes
		globalQueue.first = null;
		// noinspection JSValidateTypes
		globalQueue.last = null;
		return;
	}
	globalQueue.first = globalQueue.first.next;
	await run();
}

async function processForUserWithId(userId) {
	const task = globalQueue.first.q[userId].first;
	await processTask(task);
	if (task.next) {
		globalQueue.first.q[userId].first = next;
		await processForUserWithId(userId);
		return;
	}
	delete globalQueue.first.q[userId];
	if (Object.keys(globalQueue.first.q).length) return;
	if (!globalQueue.first.next) {
		// noinspection JSValidateTypes
		globalQueue.first = null;
		// noinspection JSValidateTypes
		globalQueue.last = null;
		return;
	}
	globalQueue.first = globalQueue.first.next;
	await run();
}

function run() {
	switch (globalQueue.first.type) {
		case separatedByUsers:
			return Promise.all(Object.keys(globalQueue.first.q).map(processForUserWithId));
		case independent:
			return processIndependent();
		default:
			return throwUnknownTypeError();
	}
}
