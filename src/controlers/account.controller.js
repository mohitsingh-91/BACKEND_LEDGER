const accountModel=require("../models/account.model");
const userModel=require("../models/user.model");

/** 
* - user account create controller
* - /api/account/user
*/
exports.createAccountUser=async(req,res)=>{
    try{
       const {userId}=req.body;
       const user=await userModel.findById(userId);
       if(!user){
        return res.status(404).json({
                success: false,
                message: "User not found",
                });
       }
       // Prevent creating account for admin
        if (user.role === "ADMIN") {
            return res.status(403).json({
                message: "Cannot create account for admin."
            });
        }

       const account=await accountModel.create({
        user:userId
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

/** 
* - Admin account create controller
* - /api/account/admin
*/
exports.createAccountAdmin=async(req,res)=>{
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
    try{
        const accounts = await accountModel.find({ user: req.user._id });

        res.status(200).json({
            accounts
        })
    }catch(error){
        return res.status(500).json({
            message: error.message
        });
    
    }
    
}

exports.getUserAccountByAdmin = async (req, res) => {
    try {
        const { accountId } = req.params;

        const account = await accountModel.findById(accountId);

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        return res.status(200).json({
            account
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

exports.getAccountBalanceController=async(req,res)=>{
    try{
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
    }catch(error){
        return res.status(500).json({
            message: error.message
        });
    }
    
}


