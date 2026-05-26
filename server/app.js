import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // Must come first

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dbConnection from "./config/db.js";
import fileUpload from "express-fileupload";

import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";
import chatRouter from "./routes/chat.route.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({           
    origin: [process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);                      

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

// API Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/message', messageRouter);
app.use('/api/v1/chat', chatRouter);

dbConnection();

export default app;
