import { mergeTypeDefs } from '@graphql-tools/merge';
import { readFileSync } from 'fs';

const user = readFileSync('src/graphql/typeDefs/User.graphql', { encoding: 'utf-8' });
const topic = readFileSync('src/graphql/typeDefs/Topic.graphql', { encoding: 'utf-8' });
const article = readFileSync('src/graphql/typeDefs/Article.graphql', { encoding: 'utf-8' });
const comment = readFileSync('src/graphql/typeDefs/Comment.graphql', { encoding: 'utf-8' });
const exercise = readFileSync('src/graphql/typeDefs/Exercise.graphql', { encoding: 'utf-8' });
const workout = readFileSync('src/graphql/typeDefs/Workout.graphql', { encoding: 'utf-8' });

const mergedTypeDefs = mergeTypeDefs([user, topic, article, comment, exercise, workout]);

export default mergedTypeDefs;