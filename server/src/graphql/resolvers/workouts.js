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
        },

        workoutsByAuthor: async (_, { authorId }) => {

            try {

                const workouts = Workout.find({ authorId: authorId });
                return workouts;
            } 
            catch (err) {
                
                console.error(err);
                throw new Error(err.message || "Failed to fetch workouts by author!");
            }
        },
        workout: async (_, { workoutId }) => {

            try {

                const workout = Workout.findById(workoutId);
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

        updateWorkoutInfo: async (_, { workoutId, input }, context) => {

            try {
                
                const { title, difficulty, description } = input;
                const { getUser } = context;

                const currentUser = getUser();
                if (!currentUser) {

                    throw new Error("You must be logged in to update a workout!");
                }

                const workout = await Workout.findById(workoutId);
                if (!workout) {

                    throw new Error("workout not found.");
                }

                const isAdmin = currentUser.role === "ADMIN";
                const isAuthor = workout.authorId.toString() === currentUser._id.toString();

                if (!isAdmin && !isAuthor) {

                    throw new Error("You don't have permission to update this workout.");
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

        addExerciseToWorkout: async (_, { workoutId, input }, context) => {

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

                const existingExercise = workout.exercises.find(ex => ex.exerciseId === exerciseId);
                if (existingExercise) {

                    throw new Error("This exercise is already a part of this workout!");
                }

                const exercise = await dataSources.exercisesAPI.getExerciseById(exerciseId);
                if (!exercise) {

                    throw new Error(`Exercise with ID ${ exerciseId } was not found.`);
                }
                    
                workout.equipment.push(exercise.equipment);
                    
                const mappedMuscleGroup = muscleMap[exercise.target];
                workout.muscleGroups.push(mappedMuscleGroup); 

                workout.exercises.push(
                {
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

            const currentUser = context.getUser();
            if (!currentUser) {
                throw new Error("You must be logged in to modify a workout!");
            }

            const workout = await Workout.findById(workoutId);
            if (!workout) {
                throw new Error("Workout not found.");
            }

            if (!currentUser.role === "ADMIN" && workout.authorId.toString() !== currentUser._id.toString()) {
                throw new Error("You don't have permission to update this workout.");
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

            workout.equipment = workout.equipment.filter(eqp => allEquipmentInUse.has(eqp));
            workout.muscleGroups = workout.muscleGroups.filter(msc => allMuscleGroupsInUse.has(msc));

            // console.log("equipment in use: ", Array.from(allEquipmentInUse));
            // console.log("msc grp in use: ", Array.from(allMuscleGroupsInUse));

            await workout.save();
            return workout;
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