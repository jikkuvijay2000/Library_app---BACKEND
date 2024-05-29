const mongoose = require('mongoose')


const userSchema = new mongoose.Schema(
    {
        username :
        {
            type:String,
            unique:true,
            required:true
        },
        email:
        {
            type:String,
            unique:true,
            required:true
        },
        password:
        {
            type:String,
            required:true
        },
        role:
        {
            type:String,
            enum : ['user','admin'],
            default:'user',
            required: true
        },
        savedBooks:
        [{
            type:mongoose.Schema.Types.ObjectId,
            ref:"books",
            
        }]
    }
)


const userModel = mongoose.model("users",userSchema)
module.exports=userModel;