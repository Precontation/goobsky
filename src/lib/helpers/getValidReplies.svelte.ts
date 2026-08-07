import { AppBskyFeedDefs } from '@atproto/api';

export const getValidReplies = (post: AppBskyFeedDefs.ThreadViewPost) => {
	if (!post.replies) return [];

	const newReplies: AppBskyFeedDefs.ThreadViewPost[] = [];

	post.replies.forEach((reply) => {
		if (AppBskyFeedDefs.isThreadViewPost(reply)) {
			newReplies.push(reply);
		}
	});

	newReplies.reverse();
	return newReplies;
};
