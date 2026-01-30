import express from 'express';
const Router = express.Router;

const userRouter = Router();

userRouter.post("/signup",(req,res) => {
  res.json({
    message : "You Signup:"
  })
})

userRouter.post("/signin",(req,res) => {
  res.json({
    message : "You Signin:"
  })
})

userRouter.post("/signout",(req,res) => {
  res.json({
    message : "You Signout:"
  })
})

export default userRouter;