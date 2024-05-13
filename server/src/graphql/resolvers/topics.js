import Topic from "../../models/Topic.js";
import User from "../../models/User.js";
import Article from "../../models/Article.js";

import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

const topicResolvers = {
    Query: {
        topics: async () => {
            try {
                const topics = await Topic.find().sort({ createdAt: -1 });
                return topics;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to fetch topics!");
            }
        },

        topic: async (parent, { topicId }) => {
            try {
                const topic = await Topic.findById(topicId);
                return topic;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to fetch topic!");
            }
        }
    },

    Mutation: {
        createTopic: async (parent, { input }, context) => {
            try {
                const currentUser = context.getUser();
                if (!currentUser) {
                    throw new Error("You must be logged in to create a topic!");
                }
                
                if (currentUser.role !== "ADMIN") {
                    throw new Error("You don't have permission to create a topic!");
                }

                const { title, description } = input;
                if (!title || !description) {
                    throw new Error("All fields are required!");
                }

                const topic = new Topic({
                    title,
                    description,
                    adminId: currentUser._id
                });

                await topic.save();
                pubsub.publish("NEW_TOPIC", { newTopicSubscription: topic });
                await User.findByIdAndUpdate(currentUser._id, { $push: { topics: topic._id } }, { new: true });
                return topic;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to create topic!");
            }
        },

        updateTopic: async (parent, { topicId, input }, context) => {
            try {
                const currentUser = context.getUser();
                if (!currentUser) {
                    throw new Error("You must be logged in to edit this topic!");
                }
                    
                if (currentUser.role !== "ADMIN") {
                    throw new Error("You don't have permission to edit this topic!");
                }
                
                const { title, description } = input;
                if (!title || !description) {
                    throw new Error("All fields are required!");
                }

                const topic = await Topic.findById(topicId);
                topic.title = title;
                topic.description = description;
                await topic.save();
                return topic;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to edit topic!");
            }
        },

        deleteTopic: async (parent, { topicId }, context) => {
            try {
                const currentUser = context.getUser();
                if (!currentUser) {
                    throw new Error("You must be logged in to delete this topic!");
                }

                const topic = await Topic.findById(topicId);
                if (!topic) {
                    throw new Error("Topic not found!");
                }

                if (currentUser.role !== "ADMIN") {
                    throw new Error("You don't have permission to delete this topic!");
                }

                if (topic.status !== "INACTIVE") {
                    throw new Error("Only inactive topics can be deleted!");
                }
                
                await Topic.deleteOne({ _id: topicId });
                await User.findByIdAndUpdate(topic.adminId, { $pull: { topics: topicId } }, { new: true });
                return topic;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to delete topic!");
            }
        }
    },

    Subscription: {
        newTopicSubscription: {
            subscribe: () => pubsub.asyncIterator(["NEW_TOPIC"])
        }
    },

    Topic: {
        author: async (parent) => {
            try {
                const author = await User.findById(parent.adminId);
                return author;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to fetch topic's author!");
            }
        },

        articles: async (parent) => {
			try {
				const articles = await Article.find({ topicId: parent._id });
				return articles;
			} 
            catch (err) {
				console.error(err);
				throw new Error(err.message || "Failed to fetch topic's articles!");
			}
		}
    }
};

export default topicResolvers;