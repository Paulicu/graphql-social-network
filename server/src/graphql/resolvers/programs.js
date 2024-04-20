import Program from '../../models/Program.js';
import User from '../../models/User.js';
import Workout from '../../models/Workout.js';

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
                const { title, days } = input;

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

                    const workout = await Workout.findById(day.workoutId);
                    if (!workout) {
                        throw new Error(`Could not find Workout with ID: ${ day.workoutId }!`);
                    }
                }

                const program = new Program(
                {
                    authorId: currentUser._id,
                    title,
                    days
                });

                await program.save();
                await User.findByIdAndUpdate(currentUser._id, { $push: { programs: program._id } }, { new: true });
                return program;
            } 
            catch (err) {
                
                console.error(err);
                throw new Error(err.message || "Failed to create program!");
            }
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
                throw new Error(err.message || "Failed to fetch program's author!");
            }
        },

        days: async (parent) => {

            try {

                const programDays = parent.days.map(async (day) => {

                    const { workoutId, dayNumber } = day;

                    const workout = await Workout.findById(workoutId);

                    return { dayNumber, workout };
                });

                const days = await Promise.all(programDays);
                return days;
            } 
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to fetch program's days!");
            }
        }
    }
};

export default programResolvers;