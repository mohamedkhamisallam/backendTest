const { roles } = require("../../middleWear/auth");


const endPoint={
    creatPost:[roles.admin,roles.user],
    likePosts:[roles.admin,roles.user],
}

module.exports=endPoint