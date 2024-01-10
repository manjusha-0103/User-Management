const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    { 
        username :{
            type : String,
            required : true,
            unique : true
        },
        email : {
            type : String,
            required : true ,
            unique : true
        },
        phone: { 
            type: String, 
            required: true, 
            unique: true 
        },
        password : {
            type : String,
            required : true
        },
        uploadImage : {
            type : String
        },
        
        role: { 
            type: String, 
            enum: ['Admin', 'User'], 
            default: 'User' 
        },
        
    
    },
    {timestamps : true}
    
)

module.exports = mongoose.model("User", userSchema);