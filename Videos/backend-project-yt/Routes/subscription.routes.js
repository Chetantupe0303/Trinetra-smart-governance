import { Router } from 'express';

const subscriptionRouter = Router();

subscriptionRouter.get("/",(req,res) => {
  res.json({
    message : "Get all Subscription:"
  })
})

subscriptionRouter.get("/:id",(req,res) => {
  res.json({
    message : "Get Subscription details:"
  })
})

subscriptionRouter.post("/",(req,res) => {
  res.json({
    message : "CREATE subscription:"
  })
})

subscriptionRouter.put("/:id",(req,res) => {
  res.json({
    message : "UPDATE subscription:"
  })
})

subscriptionRouter.delete("/:id",(req,res) => {
  res.json({
    message : "DELETE subscription:"
  })
})

subscriptionRouter.get("/user/:id",(req,res) => {
  res.json({
    message : "Get all user subscription:"
  })
})

subscriptionRouter.put("/:id/cancle",(req,res) => {
  res.json({
    message : "CANCLE subscription:"
  })
})

subscriptionRouter.put("/upcoming-renewals",(req,res) => {
  res.json({
    message : "GET upcoming renewals:"
  })
})

export default subscriptionRouter;

