const userModel=require("../models/user.model");
const jwt=require("jsonwebtoken");
const {sendRegistrationEmail}=require("../services/email.service");
const tokenBlackListModel=require("../models/blankList.model");
require("dotenv").config();

/** 
* - user register controller
* - /api/auth/register
*/
exports.userRegister=async(req,res)=>{
    try{
        const{email,name,password}=req.body;
    // is email already exist?
    const isexist=await userModel.findOne({email});
    if(isexist){
        return res.status(422).json({
            success:false,
            message:"User already exist with this email"
        })
    }
    const user=await userModel.create({
        email:email,
        name:name,
        password:password
    })

    res.status(201).json({
        success:true,
        message:"User registered successfully",
        user:{
            userID:user._id,
            email:user.email,
            name:user.name,
        }
    })
    try{
        // send a email for registration successfully
        await sendRegistrationEmail(user.email,user.name);
    }catch (emailError) {
         console.error("Failed to send failure email:", emailError);

    }
    }
    catch(err){
        console.error(err);
        res.status(400).json({
            success:false,
            message:"Internal Server Error"
        })
    }
    
}


/**
 * - user login the account
 * - /api/auth/login
 */
exports.userLogin=async(req,res)=>{
    try{
        const {email,password}=req.body;
    const user=await userModel.findOne({email}).select("+password");
    if(!user){
        res.status(401).json({
            message:"Email or password INVALID"
        })
    }
    const isValid=user.comparePassword(password);
    if(!isValid){
         res.status(401).json({
            message:"Email or password INVALID"
        })
    }
    // create jwt token
    const token=jwt.sign({user_Id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"2d"});
    res.cookie("token",token,{
        httponly:true,
        secure:false,
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    })

    res.status(200).json({
        success:true,
        message:"User Login successfully",
        user:{
            userID:user._id,
            email:user.email,
            name:user.name,
            token:token
        }
    })
    }catch(err){
        console.error(err);
        res.status(400).json({
            success:false,
            message:"Internal Server Error"
        })
    }
    

}



/**
 * - User Logout Controller
 * - POST /api/auth/logout
  */
exports.userLogoutController=async(req, res)=>{
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }



    await tokenBlackListModel.create({
        token: token
    })

    res.clearCookie("token");

    res.status(200).json({
        message: "User logged out successfully"
    })

}
