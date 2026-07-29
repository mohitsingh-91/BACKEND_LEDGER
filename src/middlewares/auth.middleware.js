const userModel=require("../models/user.model");
const tokenBlackListModel=require("../models/blankList.model");

const jwt=require("jsonwebtoken");
require("dotenv").config();

async function authMiddleware(req,res,next){
    const token=req.cookies?.token || req.headers?.authorization.split(" ")[1] ;

    if(!token){
        return res.status(401).json({
            message:"Unauthorized access, Token is missing"
        })
    }
    const isBlacklisted = await tokenBlackListModel.findOne({ token })

    if (isBlacklisted) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }
    try{
        const payload=jwt.verify(token,process.env.JWT_SECRET_KEY); // user id
        const user=await userModel.findById(payload.user_Id);
        req.user=user;
        return next();
    }catch(error){
        return res.status(401).json({
            message:"Unauthorized access, Token is missing"
        })
    }
}

async function authUserMiddleware(req,res,next){
    const token=req.cookies?.token || req.headers?.authorization.split(" ")[1] ;

    if(!token){
        return res.status(401).json({
            message:"Unauthorized access, Token is missing"
        })
    }
    const isBlacklisted = await tokenBlackListModel.findOne({ token })

    if (isBlacklisted) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }
    try{
        const payload=jwt.verify(token,process.env.JWT_SECRET_KEY); // user id
        const user=await userModel.findById(payload.user_Id);
        if(user.role!=="USER"){
            return res.status(403).json({
                message:"Forbidden access, not a User"
            })
        }
        req.user=user;
        return next();
    }catch(error){
        return res.status(401).json({
            message:"Unauthorized access, Token is missing"
        })
    }
}

async function authAdminUserMiddleware(req,res,next){
    const token=req.cookies?.token || req.headers?.authorization.split(" ")[1] ;

    if(!token){
        return res.status(401).json({
            message:"Unauthorized access, Token is missing"
        })
    }
    const isBlacklisted = await tokenBlackListModel.findOne({ token })

    if (isBlacklisted) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }
    try{
        const payload=jwt.verify(token,process.env.JWT_SECRET_KEY); // user id
        const user=await userModel.findById(payload.user_Id);
        if(user.role!=="ADMIN"){
            return res.status(403).json({
                message:"Forbidden access, not a Admin"
            })
        }
        req.user=user;
        return next();
    }catch(error){
        return res.status(401).json({
            message:"Unauthorized access, Token is missing"
        })
    }
}

module.exports={authMiddleware,authUserMiddleware,authAdminUserMiddleware};