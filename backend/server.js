import dotenv  from 'dotenv'
dotenv.config()
import express from 'express'
import cookieParser from 'cookie-parser'
import {v2 as cloudinary} from 'cloudinary'


import authRoutes from './routes/auth.routes.js'
import connectMongoDB from './db/connectMongoDB.js'
import userRoutes from './routes/user.routes.js'

cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
})
const app = express()

app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded({extended : true}))

app.get('/', (req, res) => {
        res.send("server is working")
})

app.use('/api/auth', authRoutes )
app.use('/api/users', userRoutes )

const PORT = process.env.PORT || 5000

app.listen(5000, () => {
        console.log(`server is running on port ${PORT}`)
        connectMongoDB();
})