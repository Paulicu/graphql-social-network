import { RESTDataSource } from "@apollo/datasource-rest";

class ExercisesAPI extends RESTDataSource {
    constructor(options) {
        super(options);
        this.baseURL = process.env.API_URL;
        this.key = process.env.API_KEY;
        this.host = process.env.API_HOST;
        this.cache = options.cache;
    }
    
    cacheOptionsFor() {
        return { ttl: 1000 * 60 * 60 * 24 };
    }

    willSendRequest(_path, request) {
        request.headers["X-RapidAPI-Host"] = this.host;
        request.headers["X-RapidAPI-Key"] = this.key;
    }

    async getExercises() {
        const exercises = await this.get(`/exercises?limit=${ process.env.EXERCISE_LIMIT }`);
        exercises.forEach(exercise => {
            const cacheKey = `exercise:${ exercise.id }`;
            this.cache.set(cacheKey, JSON.stringify(exercise), this.cacheOptionsFor());
        });
        return exercises;
    }

    async getExerciseById(id) {
        const cacheKey = `exercise:${ id }`;
        const cachedExercise = await this.cache.get(cacheKey);
        if (cachedExercise) {
            return JSON.parse(cachedExercise);
        }

        const exercise = await this.get(`/exercises/exercise/${ id }`);
        this.cache.set(cacheKey, JSON.stringify(exercise), this.cacheOptionsFor());
        return exercise;
    }

    async getExercisesByName(name) {
        const cacheKey = `search:${ name.toLowerCase() }`;
        const cachedSearch = await this.cache.get(cacheKey);
        if (cachedSearch) {
            return JSON.parse(cachedSearch);
        }
        
        const exercises = await this.get(`/exercises/name/${ name }`);
        this.cache.set(cacheKey, JSON.stringify(exercises), this.cacheOptionsFor());
        return exercises;
    }

    async getBodyPartList() {
        return this.get("exercises/bodyPartList");
    }

    async getTargetList() {
        return this.get("exercises/targetList");
    }

    async getEquipmentList() {
        return this.get("exercises/equipmentList");
    }
}

export default ExercisesAPI;