const express=require("express");
const router=express.Router();
const {authMiddleware,authUserMiddleware,authAdminUserMiddleware}=require("../middlewares/auth.middleware");
const {createAccount,getUserAccountsController,getAccountBalanceController}=require("../controlers/account.controller");


/**
 * post /api/account/user
 * create a new account
 * protected route
 */
router.post("/user",authMiddleware,createAccount);

/**
 * - GET /api/accounts/
 * - Get all accounts of the logged-in user
 * - Protected Route
 */
router.get("/",authMiddleware,getUserAccountsController);


/**
 * - GET /api/accounts/balance/:accountId
 */
router.get("/balance/:accountId",authUserMiddleware,getAccountBalanceController);

module.exports=router;
