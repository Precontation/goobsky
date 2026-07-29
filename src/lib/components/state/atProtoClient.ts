import { APP_NAME, APP_URL } from '$lib/config';
import { BrowserOAuthClient } from '@atproto/oauth-client-browser';

export const atProtoClient = new BrowserOAuthClient({
	clientMetadata: {
		client_id: `https://${APP_URL}/oauth-client-metadata.json`,
		client_name: APP_NAME,
		client_uri: APP_URL,
		logo_uri: `https://${APP_URL}/icon.svg`,
		redirect_uris: [`https://${APP_URL}/oauth/callback`],
		scope: 'atproto transition:generic',
		grant_types: ['authorization_code', 'refresh_token'],
		response_types: ['code'],
		token_endpoint_auth_method: 'none',
		application_type: 'web',
		dpop_bound_access_tokens: true
	}
});
