//Imports
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/auth.js';
import api from './routes/api.js'

dotenv.config({ path: './config.env' });

//instances

const app = express();
const PORT = process.env.PORT || 3001;

//Middlewares

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    credentials: true,
    optionsSuccessStatus: 200,
    // origin: 'http://localhost:3000',
    origin: 'https://gdsc-project.netlify.app',
}));

//Mongodb connection

mongoose.set('strictQuery', true);
mongoose.connect(process.env.Mongo_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB connected.")
}).catch((e) => console.log(e.name));


//API's

app.use(router);

app.use(api);

app.get('/', (req, res) => {
    res.send("Encrypted Backend.")
});


//Listener

app.listen(PORT, () => {
    console.log(`Successfully started on http://localhost:${PORT}`)
});
