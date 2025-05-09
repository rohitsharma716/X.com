import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import {v2 as cloudinary} from 'cloudinary'
import bcrypt from "bcryptjs";

export const getUserProfile = async (req, res) => {
     const {username } = req.params;

     try{ 
           const user = await User.findOne({username}).select("-password");
           if(!user){
             return res.status(404).json({message: "User not found"});
           }

           res.status(200).json(user);

     }catch(error){
           console.log("error in getUserProfile controller", error.message);
           res.status(500).json({message: "Internal server Error"});
     }
}

export const followUnfollowUser = async (req, res) => {

      try{
          const {id} = req.params;
          const userToModify = await User.findById(id);
          const currentUser = await User.findById(req.user._id);

          if( id ===  req.user._id.toString()){
             return res.status(400).json({message: "You can't follow/unfollow yourself"});
          }

          if(!userToModify || !currentUser){
             return res.status(404).json({message: "User not found"});
          }
        
        const isFollowing = userToModify.followers.includes(req.user._id.toString());

           
          if(isFollowing){  
          await User.findByIdAndUpdate(id, {$pull: {followers: req.user._id}});
          await User.findByIdAndUpdate(req.user._id, {$pull: {following: id}});
          res.status(200).json({message: "Unfollowed successfully"});
          }else{
            //follow the user
          await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}});
          await User.findByIdAndUpdate(req.user._id, {$push: {following: id}});  
          // send notification
          const newNotification = new Notification({
            type: "follow",
            from: req.user._id,
            to: userToModify._id,
          });
          await newNotification.save();

          res.status(200).json({message: "Followed successfully"});
          }
          
      }catch(error){
          console.log("error in followUnfollowUser controller", error.message);
          res.status(500).json({message: "Internal server Error"});
      }
}

export const getsuggestedUsers = async (req, res) => {
     try{   
       const userId = req.user._id;
       const usersFollowByMe = await User.findById(userId).select("following");
       const users = await User.aggregate([
            { $match: { _id: { $ne: userId } } },
            { $sample: { size: 10 } },
       ]);

       const filterUsers = users.filter((user) =>   !usersFollowByMe.following.includes(user._id.toString()));
       const suggestedUsers = filterUsers.slice(0,4);

       // remove password when sending response on sugested users
       suggestedUsers.forEach((user) => (user.password = null));
       res.status(200).json(suggestedUsers);

     }catch(error){
          console.log("error in getsuggestedUsers controller", error.message);
          res.status(500).json({message: "Internal server Error"});
     }
}


export const updateUser =     async (req,res) =>{
        const { fullName, email, username , currentPassword,  newPassword, bio , link } = req.body;
       let {profileImg, coverImg} = req.body;

       const userId = req.user._id;

       try{
             let user = await User.findById(userId);
             if(!user)  return res.status(404).json({message: "User not found"});

             if((!newPassword && currentPassword)  ||  (!currentPassword && newPassword)){
                 return res.status(400).json({message: "Please provide both current password and new password"});
             }
             
             if(newPassword && currentPassword){
                   const isMatch = await bcrypt.compare(currentPassword, user.password);
                   if(!isMatch) return res.status(400).json({message: "Current password is incorrect"});
                   
                   if(newPassword.length < 6){
                         return res.status(400).json({message: "Password length should be greater than 6"});
                        }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
                  }

            if(profileImg){
                  // if user already has a profile img delete it
                  if(user.profileImg){
                        await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
                  }
                  const uploadResponse = await cloudinary.uploader.upload(profileImg);
                  profileImg = uploadResponse.secure_url;

                   
            }
            if(coverImg){
                  // if user already has a cover img delete it
                  if(user.coverImg){
                        await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);    
                  }
                  const uploadResponse = await cloudinary.uploader.upload(coverImg);
                  coverImg = uploadResponse.secure_url;

            }

            user.fullName = fullName || user.fullName;
            user.email = email || user.email;
            user.username = username || user.username;
            user.bio = bio || user.bio;
            user.link = link || user.link;
            user.profileImg = profileImg || user.profileImg;
            user.coverImg = coverImg || user.coverImg;
            user = await user.save();
           //pasword should not be sent in response
            user.password = null;
            return  res.status(200).json(user);
                
      }catch(error){
          console.log("error in updateUser controller", error.message);
          res.status(500).json({message: "Internal server Error"});      
      }
}