import Rating from '../../models/Rating.js';
import Program from '../../models/Program.js';
import User from '../../models/User.js';

const ratingResolvers = {

    Query: {

        ratingsByProgram: async (_, { programId }) => {

            try {
                
                const ratings = await Rating.find({ programId });
                return ratings;
            } 
            catch (err) {
                
                console.error(err);
                throw new Error(err.message || "Failed to fetch ratings by program!");
            }
        }
    },

    Mutation: {

        addRating: async (_, { programId, input }, context) => {

            try {
                
                const { getUser } = context;
                const { stars, message } = input;

                const currentUser = getUser();
                if (!currentUser) {

                    throw new Error("You must be logged in to rate a program!");
                }

                const rating = new Rating(
                {
                    authorId: currentUser._id,
                    programId,
                    stars,
                    message
                });

                await rating.save();

                await Program.findByIdAndUpdate(programId, { $push: { ratings: rating._id } }, { new: true });
                await User.findByIdAndUpdate(currentUser._id, { $push: { ratings: rating._id } }, { new: true });

                return rating;
            } 
            catch (err) {
                
                console.error(err);
                throw new Error(err.message || "Failed to add rating!");
            }
        },

        updateRating: async (_, { ratingId, input }, context) => {

            try {
                
                const { getUser } = context;
                const { stars, message } = input;

                const currentUser = getUser();
                if (!currentUser) {

                    throw new Error("You must be logged in to edit this rating!");
                }

                const rating = await Rating.findById(ratingId);
                if (!rating) {

                    throw new Error("Rating not found!");
                }

                const isAdmin = currentUser.role === "ADMIN";
                const isAuthor = currentUser._id.toString() === rating.authorId.toString();

                if (!isAdmin && !isAuthor) {

                    throw new Error("You are not authorized to edit this rating!");
                }

                rating.stars = stars;
                rating.message = message;

                await rating.save();
                return rating;
            } 
            catch (error) {
                
                console.error(err);
                throw new Error(err.message || "Failed to update rating!")
            }
        },

        deleteRating: async (_, { ratingId }, context) => {

            try {
                
                const { getUser } = context;
                
                const currentUser = getUser();
                if (!currentUser) {

                    throw new Error("You must be logged in to delete a rating!");
                }

                const rating = await Rating.findById(ratingId);
                if (!rating) {

                    throw new Error("Rating not found!");
                }

                const isAdmin = currentUser.role === "ADMIN";
                const isAuthor = currentUser._id.toString() === rating.authorId.toString();

                if (!isAdmin && !isAuthor) {

                    throw new Error("You are not authorized to delete this rating!");
                }

                const deletedRating = await Rating.findByIdAndDelete(ratingId);

                await Program.findByIdAndUpdate(rating.programId, { $pull: { ratings: ratingId } }, { new: true });
                await User.findByIdAndUpdate(rating.authorId, { $pull: { ratings: ratingId } }, { new: true });

                return deletedRating;
            } 
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to delete rating.");
            }
        }
    },

    Rating: {

        author: async (parent) => {
            try {

                const author = await User.findById(parent.authorId);
                return author;
            } 
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to fetch rating's author.");
            }
        },

        program: async (parent) => {

            try {

                const program = await Program.findById(parent.programId);
                return program;
            } 
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to fetch rated program.");
            }
        }
    }
}

export default ratingResolvers;