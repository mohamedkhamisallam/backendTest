
var jwt = require('jsonwebtoken');
const userModel = require('../DataBase/model/user.model');

const roles={
    user:`user`,
    admin:`admin`,
    hr:`hr`
}


const auth=(data)=>{
    return async(req,res,next)=>{
        const headerToken=req.headers['authorization'];
        console.log(headerToken);
        if(headerToken==null || headerToken==undefined || headerToken<=0 || !headerToken || !headerToken.startsWith('Bearer')){
            res.status(400).json({message:`invalid headerToken`})
        }else{
            const token = headerToken.split(` `)[1];
            const decoded=jwt.verify(token,process.env.secret_key);
            const user=await userModel.findOne({_id:decoded._id});
            if(!user){
                res.json({message:`invalid user`})
            }else{
                if(data.includes(user.role)){
                    req.user=user;
                next();
                }else{
                    res.json({message:`you are not authorized`})
                }
                
            }
        }
    }
}

module.exports={auth,roles};