import dotenv  from 'dotenv'
dotenv.config()
import express from 'express'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'
import connectMongoDB from './db/connectMongoDB.js'


const app = express()

app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded({extended : true}))

app.get('/', (req, res) => {
        res.send("server is working")
})

app.use('/api/auth', authRoutes )

const PORT = process.env.PORT || 5000

app.listen(5000, () => {
        console.log(`server is running on port ${PORT}`)
        connectMongoDB();
})