import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try{
        const userId = req.user._id;
        
        const notification = await Notification.find({to: userId}).sort({createdAt: -1}).populate({path:"from",select:"-password"});
        
        await Notification.updateMany({to: userId}, {read: true})
        res.status(200).json(notification);
}
catch(error){
    console.log("error in getNotifications controller", error.message);
    res.status(500).json({message: "Internal server Error"});       
}
}

export const deleteNotification = async (req, res) => {
     try{
        const  userId = req.user._id;
        await Notification.deleteMany({to: userId});
        res.status(200).json({message: "Notifications deleted successfully"});
     }      
     catch(error){           
        console.log("error in deleteNotification controller", error.message);       
        res.status(500).json({message: "Internal server Error"});
     }
}