const mongoose=require("mongoose");
require("dotenv").config();
const dbConnect=()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{
        console.log("DB CONNECTED SUCCESSFULLY");
    })
    .catch((error)=>{
        console.log("ERROR IN DB CONNECTION");
        console.error(error);
        process.exit(1);
    })
}

module.exports=dbConnect;