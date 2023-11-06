const { default: mongoose } = require("mongoose");
const  Mongoose = require("mongoose");

const Category=new Mongoose.Schema({
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
    }
});

module.exports=mongoose.model('category',Category);