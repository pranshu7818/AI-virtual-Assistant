import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import connectDb from './config/db.js';
import authRouter from './routes/auth.routes.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js';
import geminiResponse from './gemini.js';


const app = express()
app.use(cors({
    origin:[process.env.CORS_ORIGIN || "http://localhost:5173",
    "https://ai-voice-assistant-frontend-y1n9.onrender.com"
    ],
    credentials:true,
    methods: ["GET","POST","PUT","DELETE"]
}));
const port = process.env.PORT || 8000
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);




app.listen(port,()=>{
    connectDb();
    console.log(`Server running on port ${port}`);
})

