const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt= require('bcrypt');
const saltRounds = 10 ;

const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    // confirmPassword : {
    //     type : String,
    //     required : true
    // }

});

userSchema.pre("save",function(next){
    this.password = bcrypt.hashSync(this.password,saltRounds)
    next();
});

module.exports = mongoose.model("users",userSchema);