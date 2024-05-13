import Workout from "../../models/Workout.js";
import User from "../../models/User.js";

import muscleMap from "../../utils/muscleMap.js";

import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

const workoutResolvers = {
    Query: {
        workouts: async () => {
            try {
                const workouts = await Workout.find().sort({ createdAt: -1 });
                return workouts;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to fetch workouts!");
            }
        },

        workoutsByAuthor: async (parent, { authorId }) => {
            try {
                const workouts = Workout.find({ authorId: authorId });
                return workouts;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to fetch workouts by author!");
            }
        },

        workout: async (parent, { workoutId }) => {
            try {
                const workout = Workout.findById(workoutId);
                if (!workout) {
                    throw new Error(`Could not find Workout with ID: ${ workoutId }`);
                }
                return workout;
            }
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to fetch workout!");
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
                if (!title || !difficulty || !exercises || exercises.length === 0) {
                    throw new Error("Please fill all required fields!");
                }

                let equipmentList = [];
                let muscleGroupsList = [];

                for (const exerciseInput of exercises) {
                    const { exerciseId, sets, repetitions } = exerciseInput;
                    const exercise = await dataSources.exercisesAPI.getExerciseById(exerciseId);
                    if (!exercise) {
                        throw new Error(`Exercise with ID ${ exerciseInput.exerciseId } was not found.`);
                    }
                    if (sets <= 0 || repetitions <= 0) {
                        throw new Error("Invalid Sets or Repetitions value!");
                    }
                    equipmentList.push(exercise.equipment);
                    muscleGroupsList.push(muscleMap[exercise.target]); 
                }
                
                equipmentList = [...new Set(equipmentList)];
                muscleGroupsList = [...new Set(muscleGroupsList)];

                const workout = new Workout({
                    authorId: currentUser._id,
                    title,
                    difficulty,
                    description,
                    exercises,
                    equipment: equipmentList,
                    muscleGroups: muscleGroupsList
                });

                await workout.save();
                pubsub.publish("NEW_WORKOUT", { newWorkoutSubscription: workout });
                await User.findByIdAndUpdate(currentUser._id, { $push: { workouts: workout._id } }, { new: true });

                return workout;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to create workout!");
            }
        },

        updateWorkoutInfo: async (parent, { workoutId, input }, context) => {
            try {
                const { title, difficulty, description } = input;
                const { getUser } = context;

                const currentUser = getUser();
                if (!currentUser) {
                    throw new Error("You must be logged in to edit workout information!");
                }

                const workout = await Workout.findById(workoutId);
                if (!workout) {
                    throw new Error("Workout not found!");
                }

                const isAdmin = currentUser.role === "ADMIN";
                const isAuthor = workout.authorId.toString() === currentUser._id.toString();

                if (!isAdmin && !isAuthor) {
                    throw new Error("You don't have permission to update this workout's information!");
                }

                if (!title || !difficulty) {
                    throw new Error("Please fill all required fields!");
                }

                workout.title = title;
                workout.difficulty = difficulty;
                workout.description = description;
                await workout.save();
                return workout;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to update workout information!");
            }
        },

        addExerciseToWorkout: async (parent, { workoutId, input }, context) => {
            try {
                const { exerciseId, sets, repetitions } = input;
                const { getUser,  dataSources } = context;

                const currentUser = getUser();
                if (!currentUser) {
                    throw new Error("You must be logged in to modify a workout!");
                }

                const workout = await Workout.findById(workoutId);
                if (!workout) {
                    throw new Error("Workout not found.");
                }

                const isAdmin = currentUser.role === "ADMIN";
                const isAuthor = workout.authorId.toString() === currentUser._id.toString();

                if (!isAdmin && !isAuthor) {
                    throw new Error("You don't have permission to update this workout.");
                }

                if (!exerciseId || !sets || !repetitions) {
                    throw new Error("All fields are required!");
                }

                const existingExercise = workout.exercises.find(ex => ex.exerciseId === exerciseId);
                if (existingExercise) {
                    throw new Error("This exercise is already a part of this workout!");
                }

                const exercise = await dataSources.exercisesAPI.getExerciseById(exerciseId);
                if (!exercise) {
                    throw new Error(`Exercise with ID: ${ exerciseId } was not found!`);
                }
                    
                workout.equipment.push(exercise.equipment);
                workout.muscleGroups.push(muscleMap[exercise.target]); 

                workout.exercises.push({
                    exerciseId,
                    sets, 
                    repetitions
                });

                workout.equipment = [...new Set(workout.equipment)];
                workout.muscleGroups = [...new Set(workout.muscleGroups)];
                await workout.save();
                return workout;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to add exercise to workout!");
            }
        },

        removeExerciseFromWorkout: async (_, { workoutId, exerciseId }, context) => {
            try {
                const currentUser = context.getUser();
                if (!currentUser) {
                    throw new Error("You must be logged in to modify a workout!");
                }

                const workout = await Workout.findById(workoutId);
                if (!workout) {
                    throw new Error("Workout not found.");
                }

                if (!currentUser.role === "ADMIN" && workout.authorId.toString() !== currentUser._id.toString()) {
                    throw new Error("You don't have permission to update this workout!");
                }

                if (workout.exercises.length === 1) {
                    throw new Error("Workout must have at least one exercise left!");
                }

                workout.exercises = workout.exercises.filter(ex => ex.exerciseId !== exerciseId);

                const allEquipmentInUse = new Set();
                const allMuscleGroupsInUse = new Set();

                for (const exercise of workout.exercises) {
                    const exerciseDetails = await context.dataSources.exercisesAPI.getExerciseById(exercise.exerciseId);
                    if (exerciseDetails && exerciseDetails.equipment) {
                        allEquipmentInUse.add(exerciseDetails.equipment);
                    }

                    const muscleGroup = muscleMap[exerciseDetails.target];
                    if (muscleGroup) {
                        allMuscleGroupsInUse.add(muscleGroup);
                    }
                }

                workout.equipment = workout.equipment.filter(equipment => allEquipmentInUse.has(equipment));
                workout.muscleGroups = workout.muscleGroups.filter(muscle => allMuscleGroupsInUse.has(muscle));
                await workout.save();
                return workout;
            }
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to remove exercise from workout!");
            }
        },

        deleteWorkout: async (parent, { workoutId }, context) => {
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

                await Workout.deleteOne({ _id: workoutId });
                await User.findByIdAndUpdate(workout.authorId, { $pull: { workouts: workoutId } }, { new: true });
                return workout;
            } 
            catch (err) {
                console.error(err);
                throw new Error(err.message || "Failed to delete workout!");
            }
        }
    },

    Subscription: {
        newWorkoutSubscription: {
            subscribe: () => pubsub.asyncIterator(["NEW_WORKOUT"])
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

        exercises: async(parent, args, { dataSources }) => {
            try {
                const workoutExercises = parent.exercises.map(async (exerciseData) => {
                    const { exerciseId, sets, repetitions } = exerciseData;
                    const exercise = await dataSources.exercisesAPI.getExerciseById(exerciseId);
                    return {
                        exercise,
                        sets,
                        repetitions
                    };
                });
                const exercises = await Promise.all(workoutExercises);
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