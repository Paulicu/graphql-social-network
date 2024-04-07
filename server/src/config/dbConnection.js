import mongoose from 'mongoose';

export const dbConnection = async () => {

    try {

        const dbConn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${ dbConn.connection.host }`);
    } 
    catch (error) {

       console.error(error);
       process.exit(1); 
    }
};