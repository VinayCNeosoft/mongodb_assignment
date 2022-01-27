const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    age:{
        type:String,
        required:true
    },
    city:{
        type:String
    }
})

module.exports = mongoose.model("userData",userSchema)


/* const mongoose = require('mongoose')
const catSchema = new mongoose.Schema({
    cname:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model("category",catSchema) */