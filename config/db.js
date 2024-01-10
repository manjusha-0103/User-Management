const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// dotenv.config({path:"../.env"});


MONGO_URI = "Add YOUR OWN MONGO URI"
;
const connectDB = async ()=>{
    try{
        const conn = await mongoose.connect(MONGO_URI,
        {   useNewUrlParser : true,
            useUnifiedTopology :true
        })
        console.log(`mongodb connected: ${conn.connection.host}`);
    }
    catch(error){
        console.log(error);
        process.exit(1)
    }
}
module.exports = connectDB