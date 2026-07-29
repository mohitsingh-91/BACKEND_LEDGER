const transactionModel=require("../models/transaction.model");
const ledgerModel=require("../models/ledger.model");
const accountModel=require("../models/account.model");
const {sendTransactionSuccessEmail,sendTransactionFailedEmail}=require("../services/email.service");
const mongoose=require("mongoose");
/**
 * - Create a new transaction
 * - The 10 steps transfer flow :
    * - 1. Validate request
    * - 2. Validate Idempotency Key
    * - 3. Check account status
    * - 4. Derive sender balance from ledger
    * - 5. Create transaction (PENDING)
    * - 6. Create DEBIT ledger entry
    * - 7. Create Credit ledger entry 
    * - 8. Mark transaction COMPLETED
    * - 9. Commit MongoDB Session
    * - 10. Send EMAIL notification
 */

exports.createTransaction= async (req,res)=>{

    /**
     * 1. Validate request
     */
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "FromAccount, toAccount, amount and idempotencyKey are required"
        })
    }
    // amount validate
    if (amount <= 0) {
    return res.status(400).json({
        message: "Amount must be greater than zero"
    });
}

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount,
    })

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    }).populate("user");

    if (!fromUserAccount || !toUserAccount) {
        return res.status(400).json({
            message: "Invalid fromAccount or toAccount"
        })
    }

    // Prevent transaction to admin account
        if (toUserAccount.user.role === "ADMIN") {
            return res.status(403).json({
                message: "Cannot transaction to admin."
            });
        }
    if(fromUserAccount.user.toString() !== req.user._id.toString()) {
         return res.status(403).json({
         message: "You are not authorized to use this account"
    });
   }

    if (fromAccount === toAccount) {
    return res.status(400).json({
        message: "Sender and receiver accounts cannot be the same"
    });
   }

   if (fromUserAccount.currency !== toUserAccount.currency) {
    return res.status(400).json({
        message: "Currency mismatch"
    });
}

    /**
     * 2. Validate idempotency key
     */

    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })

    if (isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status === "COMPLETED") {
            return res.status(200).json({
                message: "Transaction already processed",
                transaction: isTransactionAlreadyExists
            })

        }

        if (isTransactionAlreadyExists.status === "PENDING") {
            return res.status(200).json({
                message: "Transaction is still processing",
            })
        }

        if (isTransactionAlreadyExists.status === "FAILED") {
            return res.status(500).json({
                message: "Transaction processing failed, please retry"
            })
        }

        if (isTransactionAlreadyExists.status === "REVERSED") {
            return res.status(500).json({
                message: "Transaction was reversed, please retry"
            })
        }
    }

    /**
     * 3. Check account status
     */

    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            message: "Both fromAccount and toAccount must be ACTIVE to process transaction"
        })
    }

    /**
     * 4. Derive sender balance from ledger
     */
    const balance = await fromUserAccount.getBalance()

    if (balance < amount) {
        return res.status(400).json({
            message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`
        })
    }

    let transaction;
    let session;
    try {


        /**
         * 5. Create transaction (PENDING)
         */
        session = await mongoose.startSession()
        session.startTransaction()

        transaction = (await transactionModel.create([ {
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        } ], { session }))[ 0 ]

        await ledgerModel.create([ {
            account: fromAccount,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT"
        } ], { session })

        await ledgerModel.create([ {
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        } ], { session })

        transaction.status = "COMPLETED";

        await transaction.save({ session });
        await session.commitTransaction();

    } catch (error) {
      console.error(error);
      if (session) {
            await session.abortTransaction();
         } 

      try {
         await sendTransactionFailedEmail(
            req.user.email,
            req.user.name,
            amount,
            toAccount
         );
      } catch (emailError) {
         console.error("Failed to send failure email:", emailError);
      } 
        return res.status(500).json({
            success: false,
            message: "Transaction could not be completed due to an internal error. Please try again."
        });

    }finally{
      if (session) {
        await session.endSession();
      }
    }
    /**
     * 10. Send email notification
     */
    try {
      await sendTransactionSuccessEmail(
         req.user.email,
         req.user.name,
         amount,
         toAccount
      );
   } catch (emailError) {
      console.error("Failed to send success email:", emailError);
   }

    return res.status(201).json({
      success:true,
      message: "Transaction completed successfully",
      transaction: transaction
    })

}


exports.createInitialFundsTransaction=async(req,res)=>{
    const { toAccount, amount, idempotencyKey } = req.body

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "toAccount, amount and idempotencyKey are required"
        })
    }

   //  validate amount
   if (amount <= 0) {
    return res.status(400).json({
        message: "Amount must be greater than zero"
    });
}

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    })

    if (!toUserAccount) {
        return res.status(400).json({
            message: "Invalid toAccount"
        })
    }

   const fromUserAccount = await accountModel.findOne({
        user: req.user._id
   })

   if (!fromUserAccount) {
      return res.status(400).json({
            message: "System user account not found"
      })
   }

   if (fromUserAccount._id.equals(toUserAccount._id)) {
      return res.status(400).json({
         message: "Sender and receiver accounts cannot be the same"
      });
   }

   if (fromUserAccount.currency !== toUserAccount.currency) {
    return res.status(400).json({
        message: "Currency mismatch"
    });
   }


    /**
     * -  Validate idempotency key
     */

    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })

    if (isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status === "COMPLETED") {
            return res.status(200).json({
                message: "Transaction already processed",
                transaction: isTransactionAlreadyExists
            })

        }

        if (isTransactionAlreadyExists.status === "PENDING") {
            return res.status(200).json({
                message: "Transaction is still processing",
            })
        }

        if (isTransactionAlreadyExists.status === "FAILED") {
            return res.status(500).json({
                message: "Transaction processing failed, please retry"
            })
        }

        if (isTransactionAlreadyExists.status === "REVERSED") {
            return res.status(500).json({
                message: "Transaction was reversed, please retry"
            })
        }
    }


     /**
     * - Check account status
     */

    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            message: "Both Admin account and toAccount must be ACTIVE to process transaction"
        })
    }



   let session;
   let transaction;
   try {
      // Start MongoDB session
      session = await mongoose.startSession();
      session.startTransaction();

      // Create transaction (PENDING)
      transaction = (await transactionModel.create([{
         fromAccount: fromUserAccount._id,
         toAccount,
         amount,
         idempotencyKey,
         status: "PENDING"
      }],{session}))[0];

      // Create debit ledger entry
      await ledgerModel.create(
         [{
               account: fromUserAccount._id,
               amount,
               transaction: transaction._id,
               type: "DEBIT"
         }],
         { session }
      );

      // Create credit ledger entry
      await ledgerModel.create(
         [{
               account: toAccount,
               amount,
               transaction: transaction._id,
               type: "CREDIT"
         }],
         { session }
      );

      // Mark transaction as completed
      transaction.status = "COMPLETED";
      await transaction.save({ session });

      // Commit all database changes
      await session.commitTransaction();

      

   } catch (error) {
      console.error(error);

      if (session) {
         await session.abortTransaction();
      }

      try {
         await sendTransactionFailedEmail(
            req.user.email,
            req.user.name,
            amount,
            toAccount
         );
      } catch (emailError) {
         console.error("Failed to send failure email:", emailError);
      }

      return res.status(500).json({
         success: false,
         message: "Initial funds transaction failed. Please try again later."
      });

   } finally {
      if (session) {
         await session.endSession();
      }
   }

   // Send email after successful commit
      try {
         await sendTransactionSuccessEmail(
            req.user.email,
            req.user.name,
            amount,
            toAccount
         );
      } catch (emailError) {
         console.error("Failed to send success email:", emailError);
      }

      return res.status(201).json({
         success: true,
         message: "Initial funds transaction completed successfully",
         transaction
      });


}

