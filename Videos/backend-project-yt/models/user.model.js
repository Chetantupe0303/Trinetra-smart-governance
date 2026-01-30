import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name : {
    type : String,
    required : [true, "User name is required"],
    trim : true,
    minLength : 2,
    maxLength : 50
  },
  email : {
    type : String,
    required : [true, "Email is required"],
    unique : true,
    lowercase : true,
    trim : true,
    match : [/\S+@\S+\.\S+/, "Please use a valid email address"]
  },
  password : {
    type : String,
    required : [true,"password is required"],
    minLength : 6
  }
}, {timestamps : true});

const User = mongoose.model('user',userSchema);

export default User;