const exerciseResolvers = {

    Query: {

        exercises: async (_, __, { dataSources }) => {

            try {
                
                return dataSources.exercisesAPI.getExercises();
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
        }
    }
};

export default exerciseResolvers;