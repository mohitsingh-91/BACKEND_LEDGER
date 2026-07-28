const express=require("express");
const router=express.Router();
const {authMiddleware,authUserMiddleware,authAdminUserMiddleware}=require("../middlewares/auth.middleware");



const {createTransaction,createInitialFundsTransaction}=require("../controlers/transaction.controller");

/**
 * - POST /api/transactions/
 * - Create a new transaction
 */
router.post("/",authUserMiddleware,createTransaction);


/**
 * - POST /api/transactions/admin/initial-funds
 * - Create initial funds transaction from admin user
 */
router.post("/admin/initial-funds",authAdminUserMiddleware,createInitialFundsTransaction);


module.exports=router;