import Program from '../../models/Program.js';
import User from '../../models/User.js';
import Workout from '../../models/Workout.js';
import Rating from '../../models/Rating.js';

const programResolvers = {

    Query: {

        programs: async (_, __) => {

            try {

                const programs = await Program.find();
                return programs;    
            } 
            catch (err) {
                
                console.error(err);
                throw new Error(err.message || "Failed to fetch programs!");
            }
        },

        program: async (_, { programId }) => {

            try {

                const program = await Program.findById(programId);
                if (!program) {

                    throw new Error(`Could not find Program with ID: ${ programId }!`);
                }
                return program;    
            } 
            catch (err) {
                
                console.error(err);
                throw new Error(err.message || "Failed to fetch program!");
            }
        }
    },

    Mutation: {

        createProgram: async (_, { input }, context) => {

            try {
                
                const { getUser } = context;
                const { title, goal, days } = input;

                const currentUser = getUser();
                if (!currentUser) {

                    throw new Error("You must be logged in to create a program!");
                }

                if (!days || days.length === 0 || days.length > 7) {

                    throw new Error("Invalid number of days. Must be between 1 and 7.");
                }

                for (const day of days) {
                    
                    if (day.dayNumber < 1 || day.dayNumber > 7) {

                        throw new Error("Invalid day number. Must be between 1 and 7.");
                    }

                    if (day.workoutId) {

                        const workout = await Workout.findById(day.workoutId);
                        if (!workout) {
                            throw new Error(`Could not find Workout with ID: ${ day.workoutId }!`);
                        }
                    }
                    else {
                        
                        day.isRestDay = true;
                    }
                }

                const program = new Program(
                {
                    authorId: currentUser._id,
                    title,
                    goal,
                    days
                });

                await program.save();

                await User.findByIdAndUpdate(currentUser._id, { $push: { programs: program._id } }, { new: true });
                
                return program;
            } 
            catch (err) {
                
                console.error(err);
                throw new Error(err.message || "Failed to create Program!");
            }
        },

        deleteProgram: async (_, { programId }, context) => {

            const { getUser } = context;

            const currentUser = getUser();
            if (!currentUser) {

                throw new Error("You must be logged in to delete this Program!");
            }
            
            const program = await Program.findById(programId);
            if (!program) {

                throw new Error("Program not found!");
            }

            const isAdmin = currentUser.role === "ADMIN";
            const isAuthor = program.authorId.toString() === currentUser._id.toString();
    
            if (!isAdmin && !isAuthor) {

                throw new Error("You don't have permission to delete this Program!");
            }

            

            const deletedProgram = await Program.findByIdAndDelete(programId);
            if (!deletedProgram) {

                throw new Error("Failed to delete Program!");
            }

            const ratings = await Rating.find({ programId });
            await Rating.deleteMany({ programId });

            for (const rating of ratings) {

                await User.findByIdAndUpdate(rating.userId, { $pull: { ratings: rating._id } }, { new: true });
            }
            await User.findByIdAndUpdate(program.authorId, { $pull: { programs: programId } }, { new: true });
            
            return deletedProgram;
        }
    },

    Program: {

        author: async (parent) => {

            try {

                const author = await User.findById(parent.authorId);
                return author;
            } 
            catch (err) {
  
                console.error(err);
                throw new Error(err.message || "Failed to fetch Program's author!");
            }
        },

        days: async (parent) => {

            try {

                const programDays = parent.days.map(async (day) => {

                    const { workoutId, dayNumber, isRestDay } = day;

                    if (workoutId) {

                        const workout = await Workout.findById(workoutId);
                        return { dayNumber, workout, isRestDay };
                    }

                    return { dayNumber, isRestDay };
                });

                const days = await Promise.all(programDays);
                return days;
            } 
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to fetch Program's days!");
            }
        },

        averageRating: async (parent) => {

            try {

                const ratings = await Rating.find({ programId: parent._id });

                if (ratings.length === 0) {

                    return 0; 
                }
    
                const totalStars = ratings.reduce((acc, rating) => acc + rating.stars, 0);
                const averageRating = totalStars / parent.ratings.length;
                
                return averageRating;
            } 
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to fetch average rating for Program!");
            }
        },

        ratings: async(parent) => {

            try {
                
                const ratings = await Rating.find({ programId: parent._id });
                return ratings;
            } 
            catch (err) {
                
                console.error(err);
                throw new Error(err.message || "Failed to fetch program's ratings");
            }
        }
    }
};

export default programResolvers;