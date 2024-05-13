import Article from "../../models/Article.js";
import Topic from "../../models/Topic.js";
import User from "../../models/User.js";
import Comment from "../../models/Comment.js";

import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

const articleResolvers = {
    Query: {
        articles: async (parent, { sortBy, topicId }) => {
            try {
                let sortOption = { createdAt: -1 };
                if (sortBy === "OLDEST") {
                    sortOption = { createdAt: 1 };
                }

                let query = {};
                if (topicId) {
                    query = { topicId };
                }
                const articles = await Article.find(query).sort(sortOption);
                return articles;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to fetch articles!");
            }
        },
        
        article: async (parent, { articleId }) => {
            try {
                const article = await Article.findById(articleId);
                if (!article) {
                    throw new Error(`Could not find Article with ID: ${ articleId }`);
                }
                return article;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to fetch article!");
            }
        }
    },

    Mutation: {
        createArticle: async (parent, { input }, context) => {
            try {
                const currentUser = context.getUser();
                if (!currentUser) {
                    throw new Error("You must be logged in to create an article!");
                }

                const { title, content, topic } = input;
                if (!title || !content || !topic) {
                    throw new Error("All fields are required!");
                }

                const foundTopic = await Topic.findOne({ title: topic });
                if (!foundTopic) {
                    throw new Error(`Could not find Topic ${ input.topic }!`);
                }
        
                const article = new Article({
                    title,
                    content,
                    authorId: currentUser._id,
                    topicId: foundTopic._id
                });
        
                await article.save();

                pubsub.publish("NEW_ARTICLE", { newArticleSubscription: article });

                await User.findByIdAndUpdate(currentUser._id, { $push: { articles: article._id } }, { new: true });
                await Topic.findByIdAndUpdate(topic._id, { $push: { articles: article._id } }, { new: true });

                return article;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to create article!");
            }
        },
        
        updateArticle: async (_, { articleId, input }, context) => {
            try {
                const currentUser = context.getUser();
                if (!currentUser) {
                    throw new Error("You must be logged in to edit an article!");
                }

                const article = await Article.findById(articleId);
                if (!article) {
                    throw new Error(`Could not find Article with ID: ${ articleId }`);
                }

                const isAdmin = currentUser.role === "ADMIN";
                const isAuthor = article.authorId.toString() === currentUser._id.toString();

                if (!isAdmin && !isAuthor) {
                    throw new Error("You don't have permission to edit this article!");
                }
                const { title, content, topic } = input;
                if (!title || !content || !topic) {
                    throw new Error("All fields are required!");
                }
                
                if (topic) {
                    const foundTopic = await Topic.findOne({ title: topic });
                    if (!foundTopic) {
                        throw new Error(`Could not find Topic ${ topic }!`);
                    }

                    if (article.topicId.toString() !== foundTopic._id.toString()) {
                        await Topic.findByIdAndUpdate(article.topicId, { $pull: { articles: articleId } }, { new: true });
                        await Topic.findByIdAndUpdate(foundTopic._id, { $push: { articles: articleId } }, { new: true });
                        article.topicId = foundTopic._id;
                    }
                }
                article.title = title;
                article.content = content;
                await article.save();
                return article;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to edit article!");
            }
        },

        deleteArticle: async (parent, { articleId }, context) => {
            try {
                const currentUser = context.getUser();
                if (!currentUser) {
                    throw new Error("You must be logged in to delete an article!");
                }

                const article = await Article.findById(articleId);
                if (!article) {
                    throw new Error(`Could not find Article with ID: ${ articleId }`);
                }
                
                const isAdmin = currentUser.role === "ADMIN";
                const isAuthor = article.authorId.toString() === currentUser._id.toString();

                if (!isAdmin && !isAuthor) {
                    throw new Error("You don't have permission to delete this article!");
                }
                await Article.deleteOne({ _id: articleId });
                await User.findByIdAndUpdate(article.authorId, { $pull: { articles: articleId } }, { new: true });
                await Topic.findByIdAndUpdate(article.topicId, { $pull: { articles: articleId } }, { new: true });
                const comments = await Comment.find({ articleId });
                await Comment.deleteMany({ articleId });
                for (const comment of comments) {
                    await User.findByIdAndUpdate(comment.authorId, { $pull: { comments: comment._id } }, { new: true });
                }
                return article;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to delete article!");
            }
        }
    },

    Subscription: {
        newArticleSubscription: {
            subscribe: () => pubsub.asyncIterator(["NEW_ARTICLE"])
        }
    },
    
    Article: {
        author: async (parent) => {
            try {
                const author = await User.findById(parent.authorId);
                return author;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to fetch article's author!");
            }
        },

        topic: async (parent) => {
            try {
                const topic = await Topic.findById(parent.topicId);
                return topic;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to fetch article's topic!");
            }
        },

        comments: async (parent) => {
            try {
                const comments = await Comment.find({ articleId: parent._id });
                return comments;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to fetch article's comments");
            }
        }
    }
};

export default articleResolvers;