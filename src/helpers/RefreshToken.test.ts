import RefreshToken from './RefreshToken';
import nock from 'nock';
import axios from 'axios';

require('dotenv').config();
const clientId = 'user_id';
const clientSecret = 'client_secret';
const refreshToken = 'refresh_token';

axios.defaults.adapter = require('axios/lib/adapters/http');
describe('RefreshToken', () => {
	it('Gets auth correctly', async () => {
		const scope = nock('https://id.twitch.tv')
			.post(
				`/oauth2/token?grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}`
			)
			.reply(200, {
				access_token: 'dummy_string'
			})
			.persist();
		const auth = await RefreshToken({ refreshToken, clientId, clientSecret });
		expect(auth).toHaveProperty('clientId');
	});
});
