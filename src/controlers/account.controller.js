const accountModel=require("../models/account.model");

/** 
* - user register controller
* - /api/account
*/
exports.createAccount=async(req,res)=>{
    try{
       const user=req.user;
       const account=await accountModel.create({
        user:user._id
       })

       res.status(201).json({
        "Account":account
        })
    }catch(err){
        console.error(err);
        res.status(400).json({
            success:false,
            message:"Internal Server Error"
        })
    }
    
}

exports.getUserAccountsController=async(req, res)=>{

    const accounts = await accountModel.find({ user: req.user._id });

    res.status(200).json({
        accounts
    })
}


exports.getAccountBalanceController=async(req,res)=>{
    const { accountId } = req.params;

    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    })

    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        })
    }
    const balance = await account.getBalance();

    res.status(200).json({
        accountId: account._id,
        balance: balance
    })
}


