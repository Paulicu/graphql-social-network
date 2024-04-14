import Article from '../../models/Article.js';
import Comment from '../../models/Comment.js';
import User from '../../models/User.js';

const commentResolvers = {

    Query: {

        commentsByArticle: async (_, { articleId }) => {

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

        addComment: async(_, { articleId, input }, context) => {

            try {

                const { content } = input;

                const currentUser = context.getUser();
                if (!currentUser) {

                    throw new Error("You must be logged in!");
                }

                const newComment = new Comment(
                {

                    content,
                    authorId: currentUser._id,
                    articleId: articleId
                });

                await newComment.save();

                await Article.findByIdAndUpdate(articleId, { $push: { comments: newComment._id } }, { new: true });
                await User.findByIdAndUpdate(currentUser._id, { $push: { comments: newComment._id } }, { new: true });

                return newComment;
            }
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to add comment!");
            }
        },

        updateComment: async (_, { commentId, input }, context) => {

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

                comment.content = input.content;

                const updatedComment = await comment.save();
                return updatedComment;
            } 
            catch (error) {
                
                console.error(err);
                throw new Error(err.message || "Failed to update comment!")
            }
        },

        deleteComment: async (_, { commentId }, context) => {

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

                const deletedComment = await Comment.findByIdAndDelete(commentId);

                await Article.findByIdAndUpdate(comment.articleId, { $pull: { comments: commentId } }, { new: true });
                await User.findByIdAndUpdate(comment.authorId, { $pull: { comments: commentId } }, { new: true });

                return deletedComment;
            }
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to delete comment!");
            }
            
        }
    },

    Comment: {

        author: async (parent) => {

            const authorId = parent.authorId;
            try {

                const author = await User.findById(authorId);
				return author;
            } 
            catch (err) {
                
                console.error(err);
                throw new Error(err.message || "Failed to find comment's author!");
            }
        },

        article: async(parent) => {

            const articleId = parent.articleId;
            try {

                const article = await Article.findById(articleId);
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