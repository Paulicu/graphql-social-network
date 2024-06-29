import Program from "../../models/Program.js";
import User from "../../models/User.js";
import Workout from "../../models/Workout.js";
import Rating from "../../models/Rating.js";

import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

const programResolvers = {
    Query: {
        programs: async () => {
            try {
                const programs = await Program.find().sort({ createdAt: -1 });
                return programs;    
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to fetch programs!");
            }
        },

        program: async (parent, { programId }) => {
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
        createProgram: async (parent, { input }, context) => {
            try {
                const { getUser } = context;
                const { title, goal, days } = input;

                const currentUser = getUser();
                if (!currentUser) {
                    throw new Error("You must be logged in to create a program!");
                }

                if (!title || !goal) {
                    throw new Error("All fields are required!");
                }

                if (!days || days.length < 2 || days.length > 7) {
                    throw new Error("Invalid number of days. Must be between 2 and 7.");
                }

                for (let i = 0; i < days.length; i++) {
                    if (days[i].workoutId) {
                        const workout = await Workout.findById(days[i].workoutId);
                        if (!workout) {
                            throw new Error(`Workout with ID ${ days[i].workoutId } does not exist.`);
                        }
                    }
                    days[i].dayNumber = i + 1;
                    days[i].isRestDay = !days[i].workoutId;
                    days[i].workoutId = days[i].workoutId || null;
                }
            
                const program = new Program({ authorId: currentUser._id, title, goal, days });
                await program.save();
                pubsub.publish("NEW_PROGRAM", { newProgramSubscription: program });
                await User.findByIdAndUpdate(currentUser._id, { $push: { programs: program._id } }, { new: true });
                
                return program;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to create Program!");
            }
        },

        updateProgram: async (parent, { programId, input }, context) => {
            const { getUser } = context;
            const { title, goal, days } = input;

            const currentUser = getUser();

            if (!currentUser) {
                throw new Error("You must be logged in to update a program!");
            }
            
            const program = await Program.findById(programId);
            if (!program) {
                throw new Error("Program not found!");
            }
            const isAdmin = currentUser.role === "ADMIN";
            const isAuthor = program.authorId.toString() === currentUser._id.toString();
            if (!isAdmin && !isAuthor) {
                throw new Error("You are not authorized to update this program!");
            }

            if (!title || !goal) {
                throw new Error("All fields are required!");
            }

            if (!days || days.length < 2 || days.length > 7) {
                throw new Error("Invalid number of days. Must be between 2 and 7!");
            }

            for (let i = 0; i < days.length; i++) {
                if (days[i].workoutId) {
                    const workout = await Workout.findById(days[i].workoutId);
                    if (!workout) {
                        throw new Error(`Workout with ID ${ days[i].workoutId } does not exist!`);
                    }
                }
                days[i].dayNumber = i + 1;
                days[i].isRestDay = !days[i].workoutId;
                days[i].workoutId = days[i].workoutId || null;
            }
    
            program.title = title;
            program.goal = goal;
            program.days = days;
            await program.save();
            return program;
        },

        deleteProgram: async (parent, { programId }, context) => {

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

            await Program.deleteOne({ _id: programId });
            await Rating.deleteMany({ programId });
            await User.findByIdAndUpdate(program.authorId, { $pull: { programs: programId } }, { new: true });
            return program;
        }
    },

    Subscription: {
        newProgramSubscription: {
            subscribe: () => pubsub.asyncIterator(["NEW_PROGRAM"])
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