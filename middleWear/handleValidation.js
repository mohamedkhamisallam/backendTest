const {validationResult}=require(`express-validator`)
const handleValidation=()=>{
    return (req,res,next)=>{
        const validatioError=validationResult(req);
        if(validatioError.isEmpty()){
           next()
        }else{
            res.json(200).jsin({message:`validation error`,error:validationResult.errors})
        }
    }
}

module.exports=handleValidation;