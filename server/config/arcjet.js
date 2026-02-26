const aj = require('../middleware/arcjetMiddleware.js');

const arcjetMiddleware = async (req , res, next) => {
  try {
    const  decision = await aj.protect(req, { requested : 1});
    if(decision.isDenied()){
      if(decision.reason.isRateLimit()){
        return res.status(429).json({
          message : "Rate limit excessed"
        })
      }
      if(decision.reason.isBot()){
        return res.status(403).json({
          message : "Bot detected"
        })
      }

      return res.status(403).json({
        message : "Access Denied"
      })
    }

    next();

  }catch (e) {
    console.log(`Arcjet middleware error ${e}`);
    next(e);
  }
}

module.exports = arcjetMiddleware;