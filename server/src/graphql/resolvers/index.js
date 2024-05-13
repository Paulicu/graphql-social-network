import { mergeResolvers } from "@graphql-tools/merge";

import userResolvers from "./users.js";
import topicResolvers from "./topics.js";
import articleResolvers from "./articles.js";
import commentResolvers from "./comments.js";
import exerciseResolvers from "./exercises.js";
import workoutResolvers from "./workouts.js";
import programResolvers from "./programs.js";
import ratingResolvers from "./ratings.js";
import searchResolvers from "./search.js";

const mergedResolvers = mergeResolvers([
    userResolvers,
    topicResolvers,
    articleResolvers,
    commentResolvers,
    exerciseResolvers,
    workoutResolvers,
    programResolvers,
    ratingResolvers,
    searchResolvers
]);

export default mergedResolvers;