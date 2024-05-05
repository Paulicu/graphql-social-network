import Article from '../../models/Article.js';
import Topic from '../../models/Topic.js';
import User from '../../models/User.js';
import Comment from '../../models/Comment.js';

import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const articleResolvers = {

    Query: {

        articles: async (_, { sortBy, topicId }) => {

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
        
        article: async (_, { articleId }) => {

            try {

                const article = await Article.findById(articleId);
                return article;
            } 
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to fetch article!");
            }
        }
    },

    Mutation: {

        createArticle: async (_, { input }, context) => {

            try {

                const currentUser = context.getUser();
                if (!currentUser) {

                    throw new Error("You must be logged in to create an article.");
                }
        
                
                const topic = await Topic.findOne({ title: input.topic });
                if (!topic) {
                    throw new Error("Topic not found!");
                }
        
                const { title, content } = input;
                
                const newArticle = new Article(
                {
                    title,
                    content,
                    authorId: currentUser._id,
                    topicId: topic._id
                });
        
                await newArticle.save();

                pubsub.publish('NEW_ARTICLE', { newArticleSubscription: newArticle });

                await User.findByIdAndUpdate(currentUser._id, { $push: { articles: newArticle._id } }, { new: true });
                await Topic.findByIdAndUpdate(topic._id, { $push: { articles: newArticle._id } }, { new: true });

                return newArticle;
            } 
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to create article.");
            }
        },
        
        updateArticle: async (_, { articleId, input }, context) => {

            try {

                const currentUser = context.getUser();
                if (!currentUser) {
                    throw new Error("You must be logged in to update an article.");
                }

                const article = await Article.findById(articleId);
                if (!article) {
                    throw new Error("Article not found.");
                }

                const isAdmin = currentUser.role === "ADMIN";
                const isAuthor = article.authorId.toString() === currentUser._id.toString();

                if (!isAdmin && !isAuthor) {

                    throw new Error("You don't have permission to update this article.");
                }

                if (input.topic) {

                    const topic = await Topic.findOne({ title: input.topic });
                    if (!topic) {

                        throw new Error("Topic not found.");
                    }

                    if (article.topicId.toString() !== topic._id.toString()) {
                        
                        await Topic.findByIdAndUpdate(article.topicId, { $pull: { articles: articleId } }, { new: true });
                        await Topic.findByIdAndUpdate(topic._id, { $push: { articles: articleId } }, { new: true });

                        article.topicId = topic._id;
                    }
                }

                article.title = input.title;
                article.content = input.content;
                
                const updatedArticle = await article.save();
                return updatedArticle;
            } 
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to update article.");
            }
        },

        deleteArticle: async (_, { articleId }, context) => {

            try {

                const currentUser = context.getUser();
                if (!currentUser) {

                    throw new Error("You must be logged in to delete an article.");
                }

                const article = await Article.findById(articleId);
                if (!article) {

                    throw new Error("Article not found!");
                }
                
                const isAdmin = currentUser.role === "ADMIN";
                const isAuthor = article.authorId.toString() === currentUser._id.toString();

                if (!isAdmin && !isAuthor) {

                    throw new Error("You don't have permission to delete this article.");
                }

                const deletedArticle = await Article.findByIdAndDelete(articleId);
                if (!deletedArticle) {

                    throw new Error("Failed to delete article!");
                }

                await User.findByIdAndUpdate(article.authorId, { $pull: { articles: articleId } }, { new: true });
                await Topic.findByIdAndUpdate(article.topicId, { $pull: { articles: articleId } }, { new: true });
                await Comment.deleteMany({ articleId });
                
                return deletedArticle;
            } 
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to delete article.");
            }
        }
    },

    Subscription: {

        newArticleSubscription: {

            subscribe: () => pubsub.asyncIterator(['NEW_ARTICLE'])
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