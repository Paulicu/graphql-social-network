import Workout from '../../models/Workout.js';
import User from '../../models/User.js';

import muscleMap from '../../utils/muscleMap.js';

const workoutResolvers = {

    Query: {

        workouts: async (_, __) => {

            try {
                
                const workouts = await Workout.find();
                return workouts;
            } 
            catch (err) {
                
                console.error(err);
                throw new Error(err.message || "Failed to fetch workouts!");
            }
        }
    },

    Mutation: {

        createWorkout: async (_, { input }, context) => {

            try {

                const { getUser, dataSources } = context;
                
                const currentUser = getUser();

                if (!currentUser) {

                    throw new Error("You must be logged in to create a workout!");
                }

                const { title, difficulty, description, exercises } = input;

                let equipmentList = [];
                let muscleGroupsList = [];

                for (const exerciseInput of exercises) {

                    const exercise = await dataSources.exercisesAPI.getExerciseById(exerciseInput.exerciseId);
                    
                    if (!exercise) {

                        throw new Error(`Exercise with ID ${exerciseInput.exerciseId} was not found.`);
                    }
                    
                    equipmentList.push(exercise.equipment);
                    
                    const mappedMuscleGroup = muscleMap[exercise.target];
                    muscleGroupsList.push(mappedMuscleGroup); 
                }
                
                equipmentList = [...new Set(equipmentList)];
                muscleGroupsList = [...new Set(muscleGroupsList)];

                const workout = new Workout(
                {
                    authorId: currentUser._id,
                    title,
                    difficulty,
                    description,
                    exercises,
                    equipment: equipmentList,
                    muscleGroups: muscleGroupsList
                });

                await workout.save();

                await User.findByIdAndUpdate(currentUser._id, { $push: { workouts: workout._id } }, { new: true });

                return workout;
            } 
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to create workout!");
            }
        },

        deleteWorkout: async (_, { workoutId }, context) => {

            try {
                
                const currentUser = context.getUser();
                if (!currentUser) {

                    throw new Error("You must be logged in to delete a workout!");
                }

                const workout = await Workout.findById(workoutId);
                if (!workout) {

                    throw new Error("Workout not found!");
                }
                
                const isAdmin = currentUser.role === "ADMIN";
                const isAuthor = workout.authorId.toString() === currentUser._id.toString();
    
                if (!isAdmin && !isAuthor) {

                    throw new Error("You don't have permission to delete this workout!");
                }

                const deletedWorkout = await Workout.findByIdAndDelete(workoutId);
                if (!deletedWorkout) {

                    throw new Error("Failed to delete workout!");
                }

                await User.findByIdAndUpdate(workout.authorId, { $pull: { workouts: workoutId } }, { new: true });
                return deletedWorkout;
            } 
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to delete workout!");
            }
        }
    },

    Workout: {

        author: async (parent) => {

            try {

              const author = await User.findById(parent.authorId);
              return author;
            } 
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to fetch workout's author!");
            }
        },

        exercises: async(parent, _, { dataSources }) => {
            
            try {
            
                const exercisesData = parent.exercises;

                const exercisesPromises = exercisesData.map(async (exerciseData) => {
                    const { exerciseId, sets, repetitions } = exerciseData;
                    const exercise = await dataSources.exercisesAPI.getExerciseById(exerciseId);
                    return {
                        exercise,
                        sets,
                        repetitions
                    };
                });

                const exercises = await Promise.all(exercisesPromises);
                return exercises;
            } 
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to fetch workout's exercises!");
            }
        }
    }
};

export default workoutResolvers;