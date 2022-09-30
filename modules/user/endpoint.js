const { roles } = require("../../middleWear/auth");


const endpoint={
    profile:[roles.admin,roles.user]
}

module.exports=endpoint