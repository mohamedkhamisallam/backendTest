

paginations=(page,size)=>{

    if(!page || page<=0){
        page=1;
    }
    if(!size){
        size=3;
    }

    let skip=(page-1)*size;
    return {skip,limit:size}

}


module.exports=paginations