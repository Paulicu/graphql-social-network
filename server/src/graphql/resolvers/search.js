import Article from "../../models/Article.js";
import Workout from "../../models/Workout.js";
import Program from "../../models/Program.js";

const searchResolvers = {
    Query: {
        search: async (parent, { contains }, { dataSources }) => {
            const articleResults = await Article.find({ title: { $regex: contains, $options: 'i' } });
            const workoutResults = await Workout.find({ title: { $regex: contains, $options: 'i' } });
            const programResults = await Program.find({ title: { $regex: contains, $options: 'i' } });
            const exerciseResults = await dataSources.exercisesAPI.getExercisesByName(contains);
           
            return [...articleResults, ...exerciseResults, ...workoutResults, ...programResults];
        }
    },

    SearchResult: {
        __resolveType(obj) {
            if (obj.title && obj.content) {
                return "Article";
            }
            if (obj.name && obj.bodyPart) {
                return "Exercise";
            }
            if (obj.title && obj.difficulty) {
                return "Workout";
            }
            if (obj.title && obj.goal) {
                return "Program";
            }
            return null;
        }
    }
};

export default searchResolvers;