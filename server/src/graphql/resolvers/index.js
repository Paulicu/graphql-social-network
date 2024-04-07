import { mergeResolvers } from '@graphql-tools/merge';

import userResolvers from './users.js';
import topicResolvers from './topics.js';
import articleResolvers from './articles.js';
import commentResolvers from './comments.js';

const mergedResolvers = mergeResolvers([
    
    userResolvers,
    topicResolvers,
    articleResolvers,
    commentResolvers
]);

export default mergedResolvers;