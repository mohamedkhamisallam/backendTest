const userModel = require("../../../DataBase/model/user.model");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const shady=require(`../../../commen/services/search`)
const paginations=require(`../../../commen/services/pagination.js`)
const {search}=require(`../../../commen/services/search.js`)
// const {OAuth2Client} = require('google-auth-library');
// const client=new OAuth2Client(process.env.client_id)
const sendEmail = require("../../../commen/email");

const  signup=async(req,res)=>{
    try {
        const{userName,email,password}=req.body;
        const user = await userModel.findOne({email:email});
        if(user == undefined || user==null || user<=0){
             const newUser=new userModel({userName,email,password});
             const savedUser=await newUser.save();
             const token =  jwt.sign({_id:savedUser._id},process.env.secret_key,{expiresIn:60})
             const refreshToken =  jwt.sign({_id:savedUser._id},process.env.secret_key,{expiresIn:60})
             res.json({message:`success`,savedUser})
             const message=`<a href="${req.protocol}://${req.headers.host}/user/confirm/${token}">clickme</a> <br>
             <a href="${req.protocol}://${req.headers.host}/user/confirm/re_send/${refreshToken}">clickme 2</a>
             `
             sendEmail(email,message)
        }else{
            res.status(400).json({message:`email already exist`})
        }
    } catch (error) {
        res.status(500).json({message:`catch error`,error})
    }

}
const resendEmail=async(req,res)=>{
    const{token}=req.params;
    if(!token){
        res.json({message:`invalid token`})
    }else{
        const decoded=jwt.verify(token,process.env.secret_key);
        const user=await userModel.findOne({_id:decoded._id,confirmed:false});
        if(user){
            const token=jwt.sign({_id:user._id},process.env.secret_key,{expiresIn:60});
            const refreshToken=jwt.sign({_id:user._id},process.env.secret_key);
            
            const message=`<a href="${req.protocol}://${req.headers.host}/user/confirm/${token}">click me</a> <br>
            <a href="${req.protocol}://${req.headers.host}/user/confirm/re_send/${refreshToken}">click me 22 </a>
            `
            await sendEmail(user.email,message)
            res.json({message:`confirmed second`})
        }else{
            res.json({message:`invalid link`})
        }
    }
}

const confirmEmail= async(req,res,next)=>{
    const {token}=req.params;
    if(!token){
        res.status(400).json({message:`token error`})
    }else{
        const decoded=jwt.verify(token,process.env.secret_key);
        console.log(decoded);
        const user = await userModel.findOneAndUpdate({_id:decoded._id,confirmed:false},{confirmed:true},{new:true})
         if(user){
            res.json({message:`success signup`,user})
         }else{
            res.json({message:`not valid user`,user})
         }
    }
}

const signin=async(req,res)=>{
    const{email,password}=req.body;
      const user = await userModel.findOne({email});
      if(user==null || user==undefined || user<=0){
        res.status(400).json({message:`invalid user`})
      }else{
             if(user.confirmed){
                console.log(user.password);
               const match = await bcrypt.compare(password,user.password);
               if(match){
                const token = jwt.sign({_id:user._id,isLogged:true},process.env.secret_key,{expiresIn:3600})
                  res.json({message:`success`,token})
               }else{
                     res.json({message:`wrong password`})
               }
             }else{
                res.json({message:`invalid user`})

             }
      }

}
const profile=async(req,res)=>{
const user = await userModel.findOne({_id:req.user._id}).select(`-password`);
if(!user){
    res.json({message:`invalid user`})
}else{
    res.json({message:`success`,user})
}
}
const editProfile=async (req,res)=>{
    // try {
       
        if(!req.files){
            res.json({message:`invalid images ext`})
        }else{
            const imageUrl=`${req.protocol}://${req.headers.host}/${req.files[0].destination}/${req.files[0].filename}`
            console.log(req.user,`lol`);
            const user = await userModel.findOneAndUpdate({_id:req.user._id},{profilePic:imageUrl},{new:true});
            res.json({message:`success`,user})
            
        }
    // } catch (error) {
    //     res.json({message:`catch error`})
    // }
}
const editCoverPic=async (req,res)=>{
    // try {
       
        if(!req.files){
            res.json({message:`invalid images ext`})
        }else{
            let imageArray=[]
            for (let i = 0; i < req.files.length; i++) {
                let imageUrl=`${req.protocol}://${req.headers.host}/${req.files[i].destination}/${req.files[i].filename}`
                imageArray.push(imageUrl)
                
            }
            
            
            const user = await userModel.findOneAndUpdate({_id:req.user._id},{coverPic:imageArray},{new:true});
            res.json({message:`success`,imageArray})
            
        }
    // } catch (error) {
    //     res.json({message:`catch error`})
    // }
}
// const allUser=async (req,res)=>{
//     // try {
//          let {searchKey}=req.params
//         let{page,size}=req.query;
//        const {skip,limit}=paginations(page,size)
//        search(userModel,skip,limit,searchKey,[
//         "userName","email"
//        ])
//         // const user = await userModel.find({}).select(`-password`).limit(limit).skip(skip);
//         res.json({message:`success`,user})
//     // } catch (error) {
        
//     // }
// }


// const loginWithGoogle=async()=>{
//     const {name,photoUrl,firstName,lastName,response}=req.body;
//     const idToken=response.id_token;
//     client.verifyIdToken({idToken,audience:process.env.client_id}).then(async(response)=>{
//         const{email_verified,email}=req.payload;
//         if(email_verified){
//             const user = await userModel.findOne({email});
//             if(user){
//                 console.log(`cool login`);
//                 const token =jwt.sign({_id:user._id,isLogged:true},process.env.secret_key)
//                 res.json({message:`success`,token})
//             }else{
//                 const newUser=await userModel.insertMany({userName:name,profilePic:photoUrl,firstName:firstName,lastName:lastName})
//                 const token =jwt.sign({_id:newUser._id,isLogged:true},process.env.secret_key)
//                 res,json({message:`success`,token})
//             }
//         }else{
//             res.json({message:`invalid googole sign`})
//         }
//     })
//     console.log(req.body);
//     res.end()
// }


const searchUser=async(req,res)=>{
    const{searchkey}=req.params
    const{page,size}=req.query
    const{skip,limit}=paginations(page,size)

   const data=await  shady(userModel,skip,limit,searchkey,["userName","email"])
    // const user=await userModel.find({}).select(`-password`).limit(limit).skip(skip)
    res.json({message:`success`,data})

}

module.exports={signup,confirmEmail,signin,profile,editProfile,editCoverPic,resendEmail,searchUser}