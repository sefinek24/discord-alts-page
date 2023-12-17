const axios = require('axios');
const {name, version} = require('../package.json');

axios.defaults.headers.common['User-Agent'] = `Mozilla/5.0 (compatible; ${name}/${version}; +https://github.com/sefinek24/discord-alts-page)`;
axios.defaults.timeout = 6000;

const userDataCache = new Map();

function clearExpiredCache() {
	const currentTime = new Date().getTime();
	const expiredIds = [];

	for (const [id, userData] of userDataCache) {
		if (currentTime - userData.timestamp >= 2 * 60 * 60 * 1000) {
			expiredIds.push(id);
		}
	}

	for (const id of expiredIds) {
		userDataCache.delete(id);
	}
}

module.exports = async id => {
	clearExpiredCache();

	if (userDataCache.has(id)) {
		return userDataCache.get(id);
	}

	if (!id) return null;

	try {
		const response = await axios.get(`${process.env.API_URL}/api/v2/discord/user/${id}`);
		if (response.data) {
			const userData = response.data;
			userData.timestamp = new Date().getTime();
			userDataCache.set(id, userData);
			return userData;
		} else {
			console.error('Error while fetching user data');
			return null;
		}
	} catch (err) {
		console.error('An error occurred:', err.message);
		return null;
	}
};