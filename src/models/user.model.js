const mongoose=require("mongoose");
const bcrypt=require("bcrypt");

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required for creating an account"],
        trim:true,
        lowercase:true,
        match:[ /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"Email is invalid"],
        unique:[true,"Email is already exist"],
    },
    name:{
        type:String,
        required:[true,"Name is required"],
        trim:true
    },
    role:{
        type:String,
        enum:{
            values:["USER","ADMIN"],
            message:"role must be user or admin"
        },
        default:"USER"
    },
    password:{
        type:String,
        required:[true,"Password is required for creating an account"],
        minlength:[6,"Password must greater than 5 character"],
        select:false,
    }
},{
    timestamps:true,
});


userSchema.pre("save",async function(){
    if(!this.isModified("password")){
        return;
    }
    this.password=await bcrypt.hash(this.password,10);
    return;
});

userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}


module.exports=mongoose.model("user",userSchema);