const exerciseResolvers = {

    Query: {

        exercises: async (_, { equipment, bodyParts, targets }, { dataSources }) => {

            try {
                
                let exercises = await dataSources.exercisesAPI.getExercises();
                
                if (equipment) {

                    exercises = exercises.filter(exercise => equipment.includes(exercise.equipment));
                }

                if (bodyParts) {

                    exercises = exercises.filter(exercise => bodyParts.includes(exercise.bodyPart));
                }

                if (targets) {

                    exercises = exercises.filter(exercise => targets.includes(exercise.target));
                }
                 
                return exercises;
            } 
            catch (err) {
                
                console.error(err);
                throw new Error(err.message || "Failed to fetch exercises!");
            }
        },

        exerciseById: async (_, { exerciseId }, { dataSources }) => {

            try {

                return dataSources.exercisesAPI.getExerciseById(exerciseId);
            } 
            catch (err) {
                
                console.error(err);
                throw new Error(err.message || "Failed to fetch exercise!");
            }
        },

        bodyPartList: async (_, __, { dataSources }) => {
    
            try {

                return dataSources.exercisesAPI.getBodyPartList();
            } 
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to fetch body parts list!");
            }
        },

        targetList: async (_, __, { dataSources }) => {

            try {

              return dataSources.exercisesAPI.getTargetList();
            } 
            catch (err) {

              console.error(err);
              throw new Error(err.message || "Failed to fetch target list!");
            }
        },

        equipmentList: async (_, __, { dataSources }) => {

            try {

                return dataSources.exercisesAPI.getEquipmentList();
            } 
            catch (err) {

                console.error(err);
                throw new Error(err.message || "Failed to fetch equipment list!");
            }
        }
    }
};

export default exerciseResolvers;