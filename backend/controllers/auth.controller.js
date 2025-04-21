import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signup =  async (req, res) => {
     try{
          const {username, fullname, password, email} = req.body;

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          if (!emailRegex.test(email)) {
              return res.status(400).json({ message: "Invalid email format" });
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
          const hashedPassword = await bcrypt.hashedPassword(password, salt);

          const newUser = new User({
               username,
               fullname,
               email,   
               password: hashedPassword
          });

          if(newUser){
             generateTokeAndSetCookie(newUser, res);
             await newUser.save();
             return res.status(201).json({ 
                 _id: newUser._id,
                 username: newUser.username,
                 fullname: newUser.fullname ,
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
            return res.status(500).json({ message: "Internal server error" });
     }
 }

 export const login =  async (req, res) => {
    res.json({message : "hit the login route"});
 }
 export const logout =  async (req, res) => {
    res.json({message : "hit the logout route"});
 }

