const { json } = require("express");
const sendEmail = require("../../../commen/email");
const { postModel } = require("../../../DataBase/model/post");
const userModel = require("../../../DataBase/model/user.model");

const populateList=[
    {
        path:`userId`,
        select:`email userName`

    }
]


const creatPost=async(req,res)=>{
  
 
        
    let imagUrl=[];
    if(req.files){
        for (let i = 0; i < req.files.length; i++) {
            let imageUrl=`${req.protocol}://${req.headers.host}/${req.files[i].destination}/${req.files[i].filename}`
            imagUrl.push(imageUrl)
            
        }
    }

        const {desc,tagsList}=req.body;
           let tageEmails=[];
           let validTagID=[];
           for (let i = 0; i < tagsList.length; i++) {
            const findUser=await userModel.findOne({_id:tagsList[i]}).select("email")
            
            if(findUser){
                validTagID.push(findUser._id)
                
                if(tageEmails){
                    tageEmails=tageEmails+` , `+findUser.email;
                }else{
                    tageEmails=findUser.email;
                }
            }
            
           }
          
           const newPost=  new postModel({desc:desc,images:imagUrl,userId:req.user._id,tage:validTagID})
           const savedPost=await newPost.save(); 
        // console.log(`tagsemail`,tageEmails,savedPost);
        if(tageEmails.length>0){
            const message=`<p>hello post</p><br><a href="${req.protocol}://${req.headers.host}/post/${savedPost._id}">follow</a>`
            await sendEmail(tageEmails,message)
        }
        res.json({message:`success post added`,savedPost})
    }

    const getPost=async (req,res)=>{
        const{id}=req.params;
        const post=await postModel.findOne({_id:id}).populate([
            {
                path:`userId`,
                select:`email userName`
            }
        ]);
        if(post){
            res.json({message:`success`,post})
        }else{
            res.json({message:`wrong post`})
        }
    }

const likePost=async(req,res)=>{
 const{id}=req.params;
 const post = await postModel.findOne({_id:id}).populate([{
    path:`userId`,
    select:`email userName`
 }])
if(post){
    const findUser=post.likes.find((ele)=>{
        return ele.toString()==req.user._id.toString()
    })
    if(findUser){
         res.json({message:`can no tlike`})
    }else{
       post.likes.push(req.user._id);
       const updatePost=await postModel.findByIdAndUpdate({_id:post._id},{likes:post.likes},{new:true}).populate([{

        path:`likes`,
        select:`email userName`
       }])
       res.json({message:`success`,updatePost})
    }
}

} 

const creatComment=async(req,res)=>{
 let imageUrl=[]
 if(req.files){
    for (let i = 0; i < req.files.length; i++) {
        let imagePath=`${req.protocol}://${req.headers.host}/${req.files[i].destination}/${req.files[i].filename}`
        imageUrl.push(imagePath)
        
    }

 }

    const {desc,tagList}=req.body;
    const {id}=req.params;
      let tageEmails=``;
      let validTagID=[];
    for (let i = 0; i < tagList.length; i++) {
        const findUser=await userModel.findOne({_id:tagList[i]}).select("email");
        if(findUser){
              validTagID.push(findUser._id);
              if(tageEmails.length>0){
                tageEmails=tageEmails+` , `+findUser.email
              }else{
                tageEmails=findUser.email;
              }
        }
        
    }
     
    if(!desc){
        desc=``;
    }

      const post=await postModel.findOne({_id:id})
      if (post) {
        post.comment.push({userId:req.user._id,desc,images:imageUrl,tage:validTagID});
        const updtedPost=await postModel.findByIdAndUpdate({_id:post._id},{comment:post.comment},{new:true}).populate([{

            path:`comment.userId`,
            select:`email userName`
        }])
       let message=`<p>hello bello</p> <br>
       <a href="${req.protocol}://${req.headers.host}/post/${updtedPost._id}/"></a>
       `
        await sendEmail(tageEmails,message)

        res.json({message:`success`,updtedPost})
      } else {
        res.status(200).json({message:`invalid`})
      }


}















    module.exports={creatPost,getPost,likePost,creatComment};