import Topic from '../../models/Topic.js';

const topicResolvers = {

    Query: {

        topics: async (_, __) => {

            try {

              const topics = await Topic.find();
              return topics;
            } 
            catch (err) {

              console.error(err);
              throw new Error(err.message || "Failed to fetch topics!");
            }
        },

        topic: async (_, { topicId }) => {

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

        createTopic: async (_, { input }, context) => {
          
            try {

                const currentUser = context.getUser();
                if (!currentUser) {

                    throw new Error("You must be logged in to create a topic.");
                }
                
                if (currentUser.role !== "ADMIN") {

                    throw new Error("You don't have permission to create a topic.");
                }

                const { title, description } = input;

                const newTopic = new Topic(
                {
                    title,
                    description,
                    adminId: context.getUser()._id
                });

                await newTopic.save();
                return newTopic;
            } 
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to create topic!");
            }
        },

        updateTopic: async (_, { topicId, input }, context) => {
        
            try {

                const currentUser = context.getUser();
                if (!currentUser) {

                    throw new Error("You must be logged in to update this topic.");
                }
                    
                if (currentUser.role !== "ADMIN") {

                    throw new Error("You don't have permission to update this topic.");
                }
                
                const updatedTopic = await Topic.findByIdAndUpdate(topicId, input, { new: true });
                return updatedTopic;
            } 
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to update topic!");
            }
        },

        deleteTopic: async (_, { topicId }, context) => {

            try {
                
                const currentUser = context.getUser();
                if (!currentUser) {

                    throw new Error("You must be logged in to delete this topic.");
                }
                    
                if (currentUser.role !== "ADMIN") {

                    throw new Error("You don't have permission to delete this topic.");
                }

                const deletedTopic = await Topic.findByIdAndDelete(topicId);
                return deletedTopic;
            } 
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to delete topic!");
            }
        }
    }
};

export default topicResolvers;