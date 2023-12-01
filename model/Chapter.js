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
        type:Array,
        required:true
    },
    time_upload: {
        type:Date,
    },
    author_id: {
        type:String,
        required:true
    },
    chapnumber:{
        type: Number,
        bigint: true,
        required:true
    },
    view :{
        type: Number,
    }
});

module.exports=mongoose.model('Chapter',chapterSchema);