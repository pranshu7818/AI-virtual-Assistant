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
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));
const port = process.env.PORT || 8000
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
    res.status(200).json({ message: "Backend is running" });
});
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);




app.listen(port,()=>{
    connectDb();
    console.log(`Server running on port ${port}`);
})
