import { RESTDataSource } from '@apollo/datasource-rest';

class ExercisesAPI extends RESTDataSource {

    constructor() {

        super();
        this.baseURL = process.env.API_URL;
        this.key = process.env.API_KEY;
        this.host = process.env.API_HOST;
    }
    
    willSendRequest(_path, request) {

        request.headers['X-RapidAPI-Host'] = this.host;
        request.headers['X-RapidAPI-Key'] = this.key;
    }

    async getExercises() {

        return this.get('/exercises');
    }

    async getExerciseById(id) {

        return this.get(`/exercises/exercise/${id}`);
    }
}

export default ExercisesAPI;