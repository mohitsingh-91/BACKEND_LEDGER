const express=require("express");
const cookieParser=require("cookie-parser");
const app=express();

// middleware
app.use(express.json());
app.use(cookieParser());

/**
 * Required routes
 */
const authRoutes=require("./routes/auth.route");
const accountRoutes=require("./routes/account.route");
const transactionRoutes=require("./routes/transaction.route");

/**
 * - mount APIs
 */

app.get("/",(req,res)=>{
    res.send(`<h1>Welcome to the Backend Ledger Service</h1>
              <h2>Server is running successfully</h2>`);
});

app.use("/api/auth",authRoutes);
app.use("/api/accounts",accountRoutes);
app.use("/api/transactions",transactionRoutes);

module.exports=app;