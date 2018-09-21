import Modules from './modules/index';

async function main() {
	await Modules.ApiModule.init();
	console.log('server has been started');
}

// noinspection JSIgnoredPromiseFromCall
main();
