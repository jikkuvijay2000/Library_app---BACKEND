const express = require('express')
const dotenv= require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors');
const { userRouter } = require('./Routes/users');
const { booksRouter } = require('./Routes/books');

const app = express();
app.use(express.json());
app.use(cors());

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
