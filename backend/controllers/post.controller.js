import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from 'cloudinary';
import Notification from "../models/notification.model.js";

export const createPost = async (req, res) => {

    try{
         const { text } =  req.body;
         let {img } =  req.body;    
         const userId = req.user._id.toString();

         //find user Id 
         const user = await User.findById(userId);
         if(!user) return res.status(404).json({message: "User not found"});    

         if(!text && !img) return res.status(400).json({message: "Please provide text or image"});
          
         if(img){
            const uploadedImage = await cloudinary.uploader.upload(img);
            img = uploadedImage.secure_url;
         }

         const newPost =  new Post ({user: userId, text, img});
         await newPost.save();

         res.status(201).json({message: "Post created successfully", post: newPost});

    }catch(error){
        console.log("error in createPost controller", error.message);
        res.status(500).json({message: "Internal server Error"});
        }


}

export const deletePosts = async (req, res) => {

    try{     
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({message: "Post not found"});
        // check if the post belongs to the user
        if(post.user.toString() !== req.user._id.toString()) return res.status(403).json({message: "You can't delete this post"});

        if(post.img){ 
            const imgId  = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Post deleted successfully"});
    }
    catch(error){
        console.log("error in deletePosts controller", error.message);
        res.status(500).json({message: "Internal server Error"});
    }
}

export const commentOnPost = async (req, res) => {

    try{
        const {text } = req.body;
        const postId =  req.params.id;
        const userId = req.user._id;

        if(!text) return res.status(400).json({message: "Please provide text"});

        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message: "Post not found"});

        const comment = {user: userId, text};
        post.comments.push(comment);
        await post.save();

        res.status(200).json({message: "Comment added successfully", post});
    }
    catch(error){
        console.log("error in commentOnPost controller", error.message);
        res.status(500).json({message: "Internal server Error"});
    }
}

export const likeUnlikePost = async (req, res) => { 
    try{
        const userId = req.user._id;
        const {id:postId} = req.params;

        const post = await Post.findById(postId);
        if(!post) return res.status(404).json({message: "Post not found"});

        const isLiked = post.likes.includes(userId);
        if(isLiked){
            // if the user has already liked the post
            await User.updateOne({_id: userId}, {$pull: {likedPosts: postId}});
            await Post.findByIdAndUpdate(postId, {$pull: {likes: userId}});
            res.status(200).json({message: "Post unliked successfully"});
        }else{
            // if the user has not liked the post 
            await User.updateOne({_id: userId}, {$push: {likedPosts: postId}});
            await Post.findByIdAndUpdate(postId, {$push: {likes: userId}});
            
            const notification =  new Notification({
                from: userId,
                to: post.user,
                type: "like",
            })
            await notification.save();

            res.status(200).json({message: "Post liked successfully"});
        }
         
    }catch(error){
        console.log("error in likeUnlikePost controller", error.message);
        res.status(500).json({message: "Internal server Error"});    
    }
}

export const getAllPosts = async (req, res) => {
    try{
        const posts = await Post.find().sort({createdAt: -1}).populate({path:"user",select:"-password"}).populate({path:"comments.user",select:"-password"});
        if(posts.length === 0) return res.status(200).json([]);
        res.status(200).json({posts});
    }catch(error){
        console.log("error in getAllPosts controller", error.message);
        res.status(500).json({message: "Internal server Error"});    
    }
}

export const getLikedPosts = async (req, res) => {
     const userId = req.user.id;

    try{
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: "User not found"});

        const likedPosts = await Post.find({ _id: {$in: user.likedPosts}}).sort({createdAt: -1}).populate({path:"user",select:"-password"}).populate({path:"comments.user",select:"-password"});

        res.status(200).json({likedPosts});
        
    

    }
    catch(error){
        console.log("error in getLikedPosts controller", error.message);
        res.status(500).json({message: "Internal server Error"});    
    }
}   

export const getFollowingPosts = async (req, res) => {
    try{
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: "User not found"});
        const following = user.following;
        const followingPosts = await Post.find({user: {$in: following}}).sort({createdAt: -1}).populate({path:"user",select:"-password"}).populate({path:"comments.user",select:"-password"});
        res.status(200).json({followingPosts});
    }
    catch(error){
        console.log("error in getFollowingPosts controller", error.message);
        res.status(500).json({message: "Internal server Error"});    
    }
}

export const getUserPosts = async (req, res) => {
    try{
        const username = req.params.username;
        const user = await User.findOne({username});
        if(!user) return res.status(404).json({message: "User not found"});
        const posts = await Post.find({user: user._id}).sort({createdAt: -1}).populate({path:"user",select:"-password"}).populate({path:"comments.user",select:"-password"});
        res.status(200).json({posts});
    }
    catch(error){
        console.log("error in getUserPosts controller", error.message);
        res.status(500).json({message: "Internal server Error"});    
    }
}