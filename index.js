const express = require('express')
const dotenv= require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors');
const { userRouter } = require('./Routes/users');
const { booksRouter } = require('./Routes/books');

const app = express();
app.use(express.json());
app.use(cors());

const allowedOrigins = [
    'https://incandescent-bublanina-a28cdb.netlify.app/'
    // Add more origins if necessary
];

const corsOptions = {
    origin: function (origin, callback) {
        // Check if the origin is in the allowed origins list
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // If you need to send cookies or authorization headers
};

// Use the CORS middleware
app.use(cors(corsOptions));



app.use('/api',userRouter);
app.use('/file',booksRouter)

const PORT = 3000 || process.env.PORT

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("MONGO DB  Connected"))
.catch((err)=>console.log(err))


app.listen(PORT,()=>
    {
        console.log("server connected at PORT : "+PORT)
    })
