const mongoose= require(`mongoose`);

const replySchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:`user`},
    desc:String,
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:`user`}],
    tage:[{type:mongoose.Schema.Types.ObjectId,ref:`user`}],
    images:Array,
},{
    timestamps:true
});
const replyModel=mongoose.model(`reply`,replySchema)

const commentSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:`user`},
   desc:String,
   likes:[{type:mongoose.Schema.Types.ObjectId,ref:`user`}],
   images:Array,
   tage:[{type:mongoose.Schema.Types.ObjectId,ref:`user`}],
   isDeleted:{type:Boolean,default:false},
   deletedBy:{type:mongoose.Schema.Types.ObjectId,ref:`user`},
   deletedAt:String,
   reply:[replySchema]
},{
    timestamps:true
})
const commentModel=mongoose.model(`comment`,commentSchema)


const postSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:`user`},
    title:{type:String},
    desc:{type:String},
    images:{type:Array},
    tage:[{type:mongoose.Schema.Types.ObjectId,ref:`user`}],
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:`user`}],
    comment:[commentSchema],
    isBlocked:{type:Boolean,default:`false`},

},{
    timestamps:true
})

const postModel=mongoose.model(`post`,postSchema);

module.exports={postModel,commentModel,replyModel}