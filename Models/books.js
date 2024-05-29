const mongoose = require ('mongoose')


const bookSchema = new mongoose.Schema({

        bookName :
        {
            type:String,
            required:true
        },
        thumbnail :
        {
            type:String,
            required:true
        },
        description:
        {
            type:String,
            required:true
        },
        pdfurl: 
        {
            type:String,
            required:true
        },
        uploadedby:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"users",
            required:"true"
        }
        
        
})

const bookModel = mongoose.model("books",bookSchema)
module.exports = bookModel ;