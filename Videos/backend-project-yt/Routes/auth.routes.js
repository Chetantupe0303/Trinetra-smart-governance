import express from 'express';
const Router = express.Router;

const authRouter = Router();

authRouter.get("/",(req,res) => {
  res.json({
    title : "Get all Users"
  })
})

authRouter.get("/:id",(req,res) => {
  res.json({
    title : "Get user details"
  })
})

authRouter.post("/",(req,res) => {
  res.json({
    title : "CREATE new User:"
  })
})

authRouter.put("/:id",(req,res) => {
  res.json({
    title : "UPDATE specific User"
  })
})

authRouter.delete("/:id",(req,res) => {
  res.json({
    title : "DELETE specific User"
  })
})

export default authRouter;