const exerciseResolvers = {

    Query: {

        exercises: async (_, { pagination, filters }, { dataSources }) => {

            try {
                
                let exercises = await dataSources.exercisesAPI.getExercises();
                const { limit = 9, offset = 0 } = pagination;
                const { equipment = [], bodyParts = [], targets = [] } = filters;
                if (filters) {
                    if (equipment.length > 0) {
                        exercises = exercises.filter(exercise => filters.equipment.includes(exercise.equipment));
                    }
                    if (bodyParts.length > 0) {
                        exercises = exercises.filter(exercise => filters.bodyParts.includes(exercise.bodyPart));
                    }
                    if (targets.length > 0) {
                        exercises = exercises.filter(exercise => filters.targets.includes(exercise.target));
                    }
                }
                exercises = exercises.slice(offset, offset + limit);
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
                throw new Error(err.message || `Failed to fetch exercise by ID: ${ exerciseId }!`);
            }
        },

        exercisesByName: async (_, { name }, { dataSources }) => {

            try {

                return dataSources.exercisesAPI.getExercisesByName(name);
            } 
            catch (err) {
                
                console.error(err);
                throw new Error(err.message || `Failed to fetch exercises by name: ${ name }!`);
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