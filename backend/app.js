import express from "express";
import mongoose from "mongoose";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { CustomerRoutes } from "./routes/customer.routes.js";
dotenv.config(); 


const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT;
const app = express();

const _filename = fileURLToPath(import.meta.url);
const _dirName = path.dirname(_filename)

app.use(express.static(path.join(_dirName, "../client")))
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(_dirName, "../client", "index.html"));
})

app.use("/api/customer", CustomerRoutes);

mongoose.connect(mongoURI, {
}).then(() => {
    console.log("connnected to mongo db")
    app.listen(port, () => {
        console.log("Server is listening on port 3000")
    })
})
 .catch((error) => {
        console.log("error in connecting to mongo db", error);
    })

