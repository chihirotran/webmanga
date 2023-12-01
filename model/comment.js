const  Mongoose = require("mongoose");

const commentSehema=new Mongoose.Schema({
    content:{
        type:Array,
    },
    name:{
        type:String,
        required:true
    },
    chapter_id:{
        type:String,
        required:true
    },
    date: {
        type:Date
    },
    like:{
        type:Number
    },
    dislike:{
        type:Number
    }
});

module.exports=Mongoose.model('comment',commentSehema);