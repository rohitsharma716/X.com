import dotenv  from 'dotenv'
dotenv.config()
import express from 'express'
import cookieParser from 'cookie-parser'
import {v2 as cloudinary} from 'cloudinary'
 

import connectMongoDB from './db/connectMongoDB.js'
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import postRoutes from './routes/post.route.js'     
import notificationRoutes from './routes/notification.route.js'           

cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
})
const app = express()

app.use(express.json({limit:"5mb"}));
app.use(cookieParser());
// app.use(express.urlencoded({extended : true}))

app.get('/', (req, res) => {
        res.send("server is working")
})

app.use('/api/auth', authRoutes )
app.use('/api/users', userRoutes )
app.use('/api/posts', postRoutes)
app.use('/api/notifications',notificationRoutes)

const PORT = process.env.PORT || 5000

app.listen(5000, () => {
        console.log(`server is running on port ${PORT}`)
        connectMongoDB();
})