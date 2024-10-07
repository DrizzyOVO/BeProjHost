// "@repo/ui": "*",
import express from "express";
import cors from "cors"; 
import adminRoutes from "./routes/admin"; 
import userRoutes from "./routes/user"; 
import mongoose from "mongoose";
import path from "path";
// import dotenv from 'dotenv'; 
// dotenv.config();

const PORT = 3000; 
const app = express(); 
app.use(cors()); 
app.use(express.json());  
app.use("/admin", adminRoutes); 
app.use("/user", userRoutes); 

app.use(express.static("public"));
app.use("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})

mongoose.connect(`mongodb+srv://dizzywebbeb:qnx9XCPIV0uFYu0I@cluster0.dsyhp.mongodb.net/`, { dbName: "Try1" }); 

app.listen(PORT, () => {
    console.log(`Example app is listening at http://localhost:${PORT}`)
}); 




// dizzywebbeb
// qnx9XCPIV0uFYu0I
// mongodb+srv://dizzywebbeb:<db_password>@cluster0.dsyhp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0