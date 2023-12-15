const { default: mongoose } = require("mongoose");
const  Mongoose = require("mongoose");

const sourceSchema=new Mongoose.Schema({
    id: {
        type: Number,
        bigint: true,
        auto: true,
        primaryKey: true
    },
    linksorce: {
        type:String,
        required:true  
    },
    titlesource: {
        type:String,
        required:true
    },
    listchapter: {
        type:String,
        required:true
    },
    linkimg: {
        type:String,
        required:true
    },
    chapter: {
        type:String,
        required:true
    },
    number:{
        type: Number,
        bigint: true,
        required:true
    }
});

module.exports=mongoose.model('Source',sourceSchema);