const app=require("../src/app");
require("dotenv").config();
const PORT=process.env.PORT ||4000 

const dbConnect=require("../src/config/dataBase");
dbConnect();

/**
 * - Seed script function
 * - Register a system user
 */
const seedscript=require("../src/seedScript");
seedscript();

app.listen(PORT,()=>{
    console.log(`app is running on port no ${PORT}`);
})