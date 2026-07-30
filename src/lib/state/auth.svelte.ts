type AuthState = 'restoring' | 'authenticated' | 'unauthenticated';

let bskyAuthState: AuthState = $state('restoring');

export const getBskyAuthState = (): AuthState => {
	return bskyAuthState;
};

export const setBskyAuthState = (state: AuthState) => {
	bskyAuthState = state;
};
