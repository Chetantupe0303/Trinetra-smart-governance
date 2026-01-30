import mongoose from 'mongoose';
import { DB_URL, NODE_ENV } from "../config/env.js";

if(!DB_URL){
  throw new Error('Please define the DB_URL in .env.<development/production/.local');
}


const connectMongodb = async() => {
  try {
    await mongoose.connect(DB_URL);

    console.log(`connected to mongodb database in ${NODE_ENV} mode`);
  }catch(e){
    console.log("Unable to connect MongoDB database", e);
    process.exit(1);
  }
}

export default connectMongodb;