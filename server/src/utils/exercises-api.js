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

        return this.get(`/exercises?limit=9999`);
    }

    async getExerciseById(id) {

        return this.get(`/exercises/exercise/${id}`);
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