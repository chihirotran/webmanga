const { default: mongoose } = require("mongoose");
const  Mongoose = require("mongoose");

const chapterSchema=new Mongoose.Schema({
    id: {
        type: Number,
        bigint: true,
        auto: true,
        primaryKey: true
    },
    chapter_id: {
        type: Number,
        bigint: true,
        auto: true,     
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
    author_id: {
        type:String,
        required:true
    },
    chapnumber:{
        type: Number,
        bigint: true,
        required:true
    }
});

module.exports=mongoose.model('Chapter',chapterSchema);