

const { auth } = require("../../middleWear/auth");
const { creatPost, getPost, likePost, creatComment } = require("./controller/post.controller");

const endPoint = require("./endPoint");

const router = require(`express`).Router();


router.post(`/post`,auth(endPoint.creatPost),creatPost);

router.get(`/post/:id`,getPost);

router.patch(`/post/like/:id`,auth(endPoint.likePosts),likePost);

router.patch(`/post/:id/comment`,auth(endPoint.likePosts),creatComment)







module.exports=router;