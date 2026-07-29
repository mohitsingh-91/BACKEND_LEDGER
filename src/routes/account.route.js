const express=require("express");
const router=express.Router();
const {authMiddleware,authUserMiddleware,authAdminUserMiddleware}=require("../middlewares/auth.middleware");
const {createAccountUser,createAccountAdmin,getUserAccountsController,getAccountBalanceController,getUserAccountByAdmin}=require("../controlers/account.controller");


/**
 * post /api/account/user
 * create a new account for user
 * protected route
 */
router.post("/user",authAdminUserMiddleware,createAccountUser);

/**
 * post /api/account/admin
 * create a new account for Admin
 * protected route
 */
router.post("/admin",authAdminUserMiddleware,createAccountAdmin);

/**
 * - GET /api/accounts/
 * - Get all accounts of the logged-in user
 * - Protected Route
 */
router.get("/",authMiddleware,getUserAccountsController);

/**
 * - GET /api/accounts/get/:accountId
 * - Get all accounts of the logged-in user
 * - Protected Route
 */ 
router.get("/get/:accountId",authAdminUserMiddleware,getUserAccountByAdmin);

/**
 * - GET /api/accounts/balance/:accountId
 */
router.get("/balance/:accountId",authUserMiddleware,getAccountBalanceController);

module.exports=router;
