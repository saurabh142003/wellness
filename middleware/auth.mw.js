const adminModel = require("../models/admin.model.js")
const clientModel = require("../models/client.model.js")
const userModel = require("../models/user.model.js")
const jwt = require("jsonwebtoken")
// const configSecret = require("../configs/secretMessage.config")
const verifyAllReq=async (req,res,next)=>{
   try{ if(!req.body.name){
        res.status(401).send({
            message:"you have not entered the name"
        })
    }
    if(!req.body.password){
        res.status(401).send({
            message:"you have not entered the password"
        })
    }
    if(!req.body.email){
        res.status(401).send({
            message:"you have not entered the email"
        })
    }
   
    
     const isUserAvailable = await userModel.findOne({email:req.body.email})
    if(isUserAvailable){
        res.status(401).send({
            message:"userid is already available try new one"
        })
    
    }
    next()
}catch(err){
    console.log("there is some error while checking the email")
    res.status(401).send({
        message:"checking email is giving problems"
    })
}
}

const verifyClientReq = async (req, res, next) => {
    try {
      if (!req.body.name) {
        return res.status(401).send({ message: "You have not entered the name" });
      }
      if (!req.body.email) {
        return res.status(401).send({ message: "You have not entered the email" });
      }
      if (!req.body.phone) {
        return res.status(401).send({ message: "You have not entered the phone number" });
      }
      if (!req.body.age) {
        return res.status(401).send({ message: "You have not entered the age" });
      }
      if (!req.body.goal) {
        return res.status(401).send({ message: "You have not entered the goal" });
      }
      if(req.user.role==='admin' && !req.body.coachId) return res.status(401).send({ message: "You have not entered the coachId" });
      
  
      const isClientAvailable = await clientModel.findOne({ email: req.body.email });
      if (isClientAvailable) {
        return res.status(401).send({
          message: "Client is already available. Try a new one",
        });
      }
  
      next(); // If everything is fine, proceed to the next middleware/controller
    } catch (err) {
      console.error("There is some error while checking the email:", err);
      return res.status(500).send({
        message: "Checking email is giving problems",
      });
    }
  };
  

const verifySignIn = (req,res,next)=>{

    if(!req.body.email){
        return res.status(401).send({
            message:"you have not entered the email"
        })
    }
    if(!req.body.password){
        return res.status(401).send({
            message:"you have not entered the password"
        })

    }
    next()

}
const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies['access_token']; // Get token from cookies
        console.log(token);

        if (!token) {
            return res.status(403).send({
                message: "No token found: Unauthorized",
            });
        }

        // Verify token
        jwt.verify(token, 'this is secret', async (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "Invalid token",
                });
            }

            // Check if the token belongs to a user
            let user = await userModel.findById(decoded.id);
            if (!user) {
                // If not a user, check if it's an admin
                user = await adminModel.findById(decoded.id);
                if (!user) {
                    return res.status(402).send({
                        message: "Unauthorized Token",
                    });
                }
            }

            // Token is valid, and user/admin is found
            req.user = user; // Attach user/admin to the request object
            console.log(user);
            next();
        });
    } catch (error) {
        console.error("Error in token verification:", error);
        return res.status(500).send({
            message: "Internal Server Error",
        });
    }
};

const isAdmin = (req,res,next)=>{
    const user = req.user
    
    if(user && user.role=='admin' ){
        next()
    }else{
        return res.status(401).send({
            message:"Only admin are allowed"
        })
    }
}
const isCoach = (req,res,next)=>{
    const user = req.user
    
    if(user && user.role=='coach' ){
        next()
    }else{
        return res.status(401).send({
            message:"Only coaches are allowed to make changes here."
        })
    }
}

module.exports={
    verifyAllReq:verifyAllReq,
    verifySignIn:verifySignIn,
    verifyToken:verifyToken,
    isAdmin:isAdmin,
    verifyClientReq:verifyClientReq,
    isCoach:isCoach

}