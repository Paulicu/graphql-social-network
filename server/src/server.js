import dotenv from 'dotenv';

import { dbConnection }  from './config/dbConnection.js';


dotenv.config();

await dbConnection();
