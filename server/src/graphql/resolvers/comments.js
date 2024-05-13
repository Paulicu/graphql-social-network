import Article from "../../models/Article.js";
import Comment from "../../models/Comment.js";
import User from "../../models/User.js";

import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

const commentResolvers = {
    Query: {
        commentsByArticle: async (parent, { articleId }) => {
            try {
                const comments = await Comment.find({ articleId });
                return comments;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to fetch comments by article!");
            }
        }
    },

    Mutation: {
        addComment: async(parent, { articleId, input }, context) => {
            try {
                const currentUser = context.getUser();
                if (!currentUser) {
                    throw new Error("You must be logged in!");
                }

                const { content } = input;
                if (!content) {
                    throw new Error("Field must not be empty!");
                }

                const comment = new Comment({
                    content,
                    authorId: currentUser._id,
                    articleId: articleId
                });

                await comment.save();
                pubsub.publish(`NEW_COMMENT_${ articleId }`, { newCommentSubscription: comment });
                await Article.findByIdAndUpdate(articleId, { $push: { comments: comment._id } }, { new: true });
                await User.findByIdAndUpdate(currentUser._id, { $push: { comments: comment._id } }, { new: true });
                return comment;
            }
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to add comment!");
            }
        },

        updateComment: async (parent, { commentId, input }, context) => {
            try {
                const currentUser = context.getUser();
                if (!currentUser) {
                    throw new Error("You must be logged in!");
                }

                const comment = await Comment.findById(commentId);
                if (!comment) {
                    throw new Error("Comment not found!");
                }

                const isAdmin = currentUser.role === "ADMIN";
                const isAuthor = currentUser._id.toString() === comment.authorId.toString();

                if (!isAdmin && !isAuthor) {
                    throw new Error("You are not authorized to edit this comment!");
                }

                const { content } = input;
                if (!content) {
                    throw new Error("Field must not be empty!");
                }

                comment.content = content;
                await comment.save();
                return comment;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to edit comment!")
            }
        },

        deleteComment: async (parent, { commentId }, context) => {
            try {
                const currentUser = context.getUser();
                if (!currentUser) {
                    throw new Error("You must be logged in!");
                }

                const comment = await Comment.findById(commentId);
                if (!comment) {
                    throw new Error("Comment not found!");
                }

                const isAdmin = currentUser.role === "ADMIN";
                const isAuthor = currentUser._id.toString() === comment.authorId.toString();

                if (!isAdmin && !isAuthor) {
                    throw new Error("You are not authorized to delete this comment!");
                }

                await Comment.deleteOne({ _id: commentId });
                await Article.findByIdAndUpdate(comment.articleId, { $pull: { comments: commentId } }, { new: true });
                await User.findByIdAndUpdate(comment.authorId, { $pull: { comments: commentId } }, { new: true });

                return comment;
            }
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to delete comment!");
            }
        }
    },

    Subscription: {
        newCommentSubscription: {
            subscribe: (_, { articleId }) => {
                return pubsub.asyncIterator([`NEW_COMMENT_${ articleId }`]);
            }
        }
    },

    Comment: {
        author: async (parent) => {
            try {
                const author = await User.findById(parent.authorId);
				return author;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to find comment's author!");
            }
        },

        article: async(parent) => {
            try {
                const article = await Article.findById(parent.articleId);
                return article;
            }
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to find comment's article!");
            }
        }
    }
};

export default commentResolvers;