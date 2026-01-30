import express from 'express';
import { PORT } from "./config/env.js";
import connectMongodb  from './Database/mongodb.js';


import userRouter from "./Routes/user.routes.js"
import authRouter from "./Routes/auth.routes.js"
import subscriptionRouter from "./Routes/subscription.routes.js"
import { connect } from 'mongoose';

const app = express(); 

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/users",userRouter);
app.use("/api/v1/subscriptions",subscriptionRouter);

app.get("/",(req,res) => {
  res.send("Welcome to this server:");
})

app.listen(PORT , async () => {
  console.log(`Server running on http://localhost:${PORT} port`)
  await connectMongodb();
})
 
export default app;