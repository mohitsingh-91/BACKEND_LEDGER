const userModel = require("./models/user.model");
require("dotenv").config();

async function createSystemUser() {
    const adminUser = await userModel.findOne({ role: "ADMIN" });

    if(!adminUser){
        await userModel.create({
            email: process.env.ADMIN_EMAIL,
            name: process.env.ADMIN_NAME,
            password: process.env.ADMIN_PASSWORD,
            role: process.env.ADMIN_ROLE
        });

        console.log("Admin user created");
    } else {
        console.log("Admin user already exists");
    }
}

module.exports = createSystemUser;