const {auth} = require("../../middleWear/auth");
const handleValidation = require("../../middlewear/HandleValidation");
const { signup, confirmEmail, signin, profile, editProfile, editCoverPic,  resendEmail, searchUser } = require("./controller/user.controller");
const endpoint = require("./endpoint");
const { signupValidator } = require("./user.validation");
const shady=require(`../../commen/services/search.js`)
const router = require(`express`).Router();


//sign up
router.post(`/user/signup`,signupValidator,handleValidation(),signup);
//confirm email
router.get(`/user/confirm/:token`,confirmEmail);
router.get(`/user/confirm/re_send/:token`,confirmEmail)
//signin
router.post(`/user/signin`,signin)
router.get(`/user/profile`,auth(endpoint.profile),profile)
router.patch(`/user/profile/pic`,auth(endpoint.profile),editProfile);
router.patch(`/user/profile/coverpic`,auth(endpoint.profile),editCoverPic)
//all users
// router.get(`/user/all`,allUser);
//login with google
// router.post(`/user/google`,loginWithGoogle)


// router.get(`/user/search/:searchKey`,allUser)

router.get(`/user/search/:searchkey`,searchUser)






module.exports=router