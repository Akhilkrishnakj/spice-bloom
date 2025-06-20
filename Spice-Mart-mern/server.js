import express  from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoute from './routes/authRoute.js';
import cors from 'cors';
import mongoose from 'mongoose';
import categoryRoute from './routes/categoryRoutes.js';


//configure dotenv
dotenv.config();

//rest object
const app = express();

//database config
connectDB();

//middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

//routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category', categoryRoute);

app.get('/', (req, res) => {
  res.send('<h1>Welcome to SpiceMart Website</h1>');
}   );

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const PORT = process.env.PORT  || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`.bgMagenta.white);
}
); 