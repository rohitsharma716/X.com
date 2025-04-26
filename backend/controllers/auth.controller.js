import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie  } from "../lib/utils/generateToken.js";
export const signup =  async (req, res) => {
     try{
          const {username, fullName, password, email} = req.body;

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          
  
          if (!emailRegex.test(email)) {
              return res.status(400).json({ message: "Invalid email format" });
          }

          if(password.length < 6){
              res.status(400).json({message:"password length should be greater than 6"})
          }

          const existingUser = await User.findOne({ username });
          if(existingUser){
               return res.status(400).json({ message: "User already exists" });
          }

          const existingEmail = await User.findOne({ email });
          if(existingEmail){
             return res.status(400).json({ messafe:"Email already exits"});
          }

          const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);

          console.log("User created successfully:", username);
          const newUser = new User({
               username,
               fullName,
               email,   
               password: hashedPassword
          });
         

          if(newUser){
            generateTokenAndSetCookie(newUser, res);
             await newUser.save();
             console.log("User saved successfully:", newUser.username);
             return res.status(201).json({ 
                 _id: newUser._id,
                 username: newUser.username,
                 fullName: newUser.fullName ,
                 email: newUser.email,
                 followers: newUser.followers,
                 following: newUser.following,
                 profileImg :newUser.profileImg,
                 coverImg :newUser.coverImg
             });
          }else{
              res.status(400).json({error : "Invalid user data"});
          }


         }catch(error){
            console.log("error in signup controller",  error.message);
            return res.status(500).json({ message: "Internal server error" });
     }
 }

 export const login =  async (req, res) => {
     try{
            const {username , password } =  req.body;
            const user  = await  User.findOne({username});
            const isMatch = await bcrypt.compare(password,user?.password || "");

           if(!user || !isMatch){
             return res.status(404).json({message : "Invalid username and password"}); 
           }

        generateTokenAndSetCookie(user._id, res);
        return res.status(200).json({
            _id: user._id,
            username: user.username,           
            fullName: user.fullName,           
            email: user.email,           
            followers: user.followers,           
            following: user.following,           
            profileImg :user.profileImg,
            coverImg :user.coverImg           
        })
     }catch(error){
         console.log("error in login controller", error);
         res.status(500).json({message: "Internal server Error"});

     }
 }
 export const logout =  async (req, res) => {
     try{
        res.clearCookie("jwt");
        return res.status(200).json({message: "Logout successful"});
        
     }catch(error){
        console.log("error in logout controller",  error.message);
        res.status(500).json({message: "Internal server Error"})
     }
 }

 export const getMe =  async(req,res) =>{
      try{
          const user  = await  User.findById(req.user._id).select("-password");
          res.status(200).json(user);
      }catch(error){
           console.log("error in getMe controller",  error.message)
           res.status(500).json({message: "Internal server Error"})
      }
 }
