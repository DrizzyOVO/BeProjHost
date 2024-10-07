"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    email: String,
    password: String,
});
const adminSchema = new mongoose_1.default.Schema({
    email: String,
    password: String,
});
exports.User = mongoose_1.default.models.User || mongoose_1.default.model('User', userSchema);
exports.Admin = mongoose_1.default.models.Admin || mongoose_1.default.model('Admin', adminSchema);
