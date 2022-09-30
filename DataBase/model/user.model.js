const mongoose=require(`mongoose`);
const bcrypt = require('bcrypt');
const userSchema=new mongoose.Schema({
userName:{type:String,required:true},
firstName:String,
lastName:String,
email:{type:String,required:true},
password:{type:String,required:true},
phone:String,
age:Number,
gender:{type:String,default:`male`},
confirmed:{type:Boolean,default:false},
role:{type:String,default:`user`},
shareProfileLink:{type:String},
profilePic:String,
coverPic:Array,
socialLink:Array,
followers:Array,
accountStatus:{type:String,default:`offline`},
pdfLink:String,
story:String
},{
    timestamps:true
})

userSchema.pre(`save`,async function(next){
    this.password=await bcrypt.hash(this.password,parseInt(process.env.saltRounds));
    next();
})






const userModel=mongoose.model(`user`,userSchema);
module.exports=userModel;
