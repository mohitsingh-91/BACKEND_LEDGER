const express=require("express");
const router=express.Router();

const {userRegister,userLogin,userLogoutController}=require("../controlers/auth.controller");


/* POST /api/auth/register */
router.post("/register",userRegister);

/* POST /api/auth/login */
router.post("/login",userLogin);

/**
 * - POST /api/auth/logout
 */
router.post("/logout",userLogoutController);

module.exports=router;
