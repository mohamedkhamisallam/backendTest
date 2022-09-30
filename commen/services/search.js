

const shady= async(model,skip,limit,search,fields)=>{
  let data;
    if (search) {
        const coloums=[
            ...fields.map((field  )=>{
            return {[field]:{$regex:search}}
        })
    ]
    console.log(coloums);
    data=await model.find({$or:coloums}).limit(limit).skip(skip).select(`-password`)
    } else {
        data=await model.find({}).limit(limit).skip(skip)
    }

return data
 
    
}

// const shady=()=>{
//     console.log(`ddd`);
// }

module.exports=shady