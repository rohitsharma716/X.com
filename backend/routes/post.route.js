import express  from "express"; 
import { protectRoute } from "../middleware/protectRoute.js";
import { createPost,deletePosts , commentOnPost,likeUnlikePost , getAllPosts ,
     getLikedPosts , getFollowingPosts , getUserPosts} from "../controllers/post.controller.js";

const router = express.Router();

//post routes
router.post("/create",protectRoute,createPost);  
router.post("/like/:id",protectRoute,likeUnlikePost);
router.post("/comment/:id",protectRoute,commentOnPost);

//delete routes
router.delete("/:id",protectRoute,deletePosts);

//get routes
router.get("/all",protectRoute,getAllPosts);
router.get("/liked/:id", protectRoute,getLikedPosts);
router.get("/following",protectRoute,getFollowingPosts);
router.get("/user/:username",protectRoute,getUserPosts);



export default router;