const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Ledger must be associated with an account"],
      index: true,
      immutable:true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required for creating a Ledger entry"],
      min: [0, "Amount can't be negative"],
      immutable:true,
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transaction",
      required: [true, "Ledger must be associated with a transaction"],
      index: true,
      immutable:true,
    },

    type: {
      type: String,
      enum: {
        values: ["CREDIT", "DEBIT"],
        message: "Type can be either CREDIT or DEBIT",
      },
      required: [true,"Ledger type is required"],
      immutable:true,
    },
  },
  {
    timestamps: true, // createdAt and updatedAt must be same
  }
);

/**
 * - to protect mutating ledgerSchema
 */
function preventLedgerModification(){
    throw new Error("Ledger entries are immutable and can't be modified or deleted")
}

// pre middleware

ledgerSchema.pre("findOneAndUpdate",preventLedgerModification);
ledgerSchema.pre("updateOne",preventLedgerModification);
ledgerSchema.pre("updateMany",preventLedgerModification);
ledgerSchema.pre("deleteOne",preventLedgerModification);
ledgerSchema.pre("deleteMany",preventLedgerModification);
ledgerSchema.pre("findOneAndDelete", preventLedgerModification);
ledgerSchema.pre("findOneAndReplace",preventLedgerModification);

module.exports = mongoose.model("ledger", ledgerSchema);