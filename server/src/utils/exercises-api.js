import { RESTDataSource } from '@apollo/datasource-rest';

class ExercisesAPI extends RESTDataSource {

    constructor(options) {

        super(options);
        this.baseURL = process.env.API_URL;
        this.key = process.env.API_KEY;
        this.host = process.env.API_HOST;
        this.cache = options.cache;
    }
    
    cacheOptionsFor() {
        
        return { ttl: 1000 * 60 * 60 * 24 * 7 };
    }

    willSendRequest(_path, request) {

        request.headers['X-RapidAPI-Host'] = this.host;
        request.headers['X-RapidAPI-Key'] = this.key;
    }

    async getExercises() {

        const data = await this.get(`/exercises?limit=9999`);
        data.forEach(exercise => {

            const cacheKey = `exercise:${ exercise.id }`;
            this.cache.set(cacheKey, JSON.stringify(exercise), this.cacheOptionsFor());
        });
        return data;
    }

    async getExerciseById(id) {
       
        const cacheKey = `exercise:${ id }`;
        const cachedExercise = await this.cache.get(cacheKey);
        if (cachedExercise) {

            return JSON.parse(cachedExercise);
        }

        const data = await this.get(`/exercises/exercise/${ id }`);
        this.cache.set(cacheKey, JSON.stringify(data), this.cacheOptionsFor());
        return data;
    }

    async getExercisesByName(name) {

        const searchKey = `search:${ name.toLowerCase() }`;
        const cachedSearch = await this.cache.get(searchKey);
        if (cachedSearch) {
            return JSON.parse(cachedSearch);
        }
        
        const data = await this.get(`/exercises/name/${ name }`);
        if (data.length > 0) {
            this.cache.set(searchKey, JSON.stringify(data), this.cacheOptionsFor());
        }
        return data;
    }

    async getBodyPartList() {

        return this.get('exercises/bodyPartList');
    }

    async getTargetList() {

        return this.get('exercises/targetList');
    }

    async getEquipmentList() {

        return this.get('exercises/equipmentList');
    }
}

export default ExercisesAPI;