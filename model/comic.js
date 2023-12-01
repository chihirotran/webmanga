const { default: mongoose } = require("mongoose");
const  Mongoose = require("mongoose");

const comicSchema=new Mongoose.Schema({
    id: {
        type: Number,
        bigint: true,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type:String,
        required:true
    },
    description: {
        type:String,
        required:true
    },
    linkimg: {
        type:String,
        required:true
    },
    time_upload: {
        type:Date,
    },
    author_id: {
        type:String,
        required:true
    },
    chapter_comic: {
        type: Array
    },
    tag: {
        type: Array
    }
});

module.exports=mongoose.model('comic',comicSchema);