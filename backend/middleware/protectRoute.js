import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
      try{
         const token =  req.cookies.jwt;
        //  console.log(token);
         if(!token){
             return res.status(401).json({message: "Unauthorized: no token is present"});
         }
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         console.log(decoded);

         if(!decoded){
             return res.status(401).json({message: "Unauthorized: invalid token"});
         }
         const user = await User.findById(decoded.userId).select("-password");
         if(!user){
             return res.status(401).json({message: "Unauthorized: user not found"});
         }
         
         req.user = user;         
         next();
         
         
      }catch(error){
          console.log("error in protectRoute middleware", error.message);
          return res.status(500).json({message: "Internal server Error"});
      }
}