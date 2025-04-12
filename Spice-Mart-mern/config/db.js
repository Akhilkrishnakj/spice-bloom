import mongoose from 'mongoose';
import color from 'colors';

const connectDB = async () => {
    try {
         const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`.bgWhite.green);
    } catch (error) {
        console.log(`Error in MongoDB ${error}`.bgRed.white)
    }
}

export default connectDB;