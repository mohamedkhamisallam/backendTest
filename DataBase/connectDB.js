
const mongoose = require(`mongoose`);
 const connectDB=()=>{
    return mongoose.connect(`mongodb+srv://shadyCluster:1234@cluster0.fbqgg9e.mongodb.net/insta`).then((result)=>{
        console.log(`connected to DB`);
    }).catch((err)=>{
        console.log(`server error`,err
        );
    })
 }


 module.exports=connectDB