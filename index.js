const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const { userRouter } = require('./Routes/users');
const { booksRouter } = require('./Routes/books');

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = [
    'https://incandescent-bublanina-a28cdb.netlify.app'
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

// Use the CORS middleware with options
app.use(cors(corsOptions));

// Routes
app.use('/api', userRouter);
app.use('/file', booksRouter);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB Connected");
        app.listen(PORT, () => {
            console.log("Server connected at PORT: " + PORT);
        });
    })
    .catch((err) => {
        console.error("MongoDB Connection Error:", err);
    });
