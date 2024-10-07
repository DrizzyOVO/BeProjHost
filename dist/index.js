"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// "@repo/ui": "*",
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const admin_1 = __importDefault(require("./routes/admin"));
const user_1 = __importDefault(require("./routes/user"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
// import dotenv from 'dotenv'; 
// dotenv.config();
const PORT = 3000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/admin", admin_1.default);
app.use("/user", user_1.default);
app.use(express_1.default.static("public"));
app.use("/*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "/public/index.html"));
});
mongoose_1.default.connect(`mongodb+srv://dizzywebbeb:qnx9XCPIV0uFYu0I@cluster0.dsyhp.mongodb.net/`, { dbName: "Try1" });
app.listen(PORT, () => {
    console.log(`Example app is listening at http://localhost:${PORT}`);
});
// dizzywebbeb
// qnx9XCPIV0uFYu0I
// mongodb+srv://dizzywebbeb:<db_password>@cluster0.dsyhp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
