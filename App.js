import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
dotenv.config();

import userRouter from "./Routes/user.js"
import PortofolioRoute from "./Routes/portofolio.js";
import ContactForm from "./Routes/contact.js";
import PlatForm from "./Routes/platform.js";

const secret = process.env.secret;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
app.use(cors());
app.options("#",cors())


//middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use("/public/uploads",express.static(__dirname+"/public/uploads"))



//routers
app.use("/api/user", userRouter  )
app.use("/api/portofolio", PortofolioRoute  )
app.use("/api/contact", ContactForm  )
app.use("/api/platform", PlatForm  )


app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
      success: false,
      status: errorStatus,
      message: errorMessage,
    });
  });



// Connecting
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI).then(console.log("DB Connected"))



var server = app.listen(process.env.PORT || 3000, function () {
  var port = server.address().port;
  console.log("Express is working on port" + port)
})