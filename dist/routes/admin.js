"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware_1 = require("../middleware");
const zodValidation_1 = require("../zodValidation");
const db_1 = require("../db");
// const prisma = new PrismaClient()
const router = express_1.default.Router();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = zodValidation_1.signupInput.safeParse(req.body);
    if (!parsedInput.success) {
        res.status(411).json({
            error: parsedInput.error
        });
        return;
    }
    const email = req.body.email;
    const password = req.body.password;
    const secretCode = req.body.secretCode;
    const admin = yield db_1.Admin.findOne({ email });
    if (admin) {
        if (admin.password != password) {
            res.json({ message: 'Incorrect Password' });
        }
        const token = jsonwebtoken_1.default.sign({ id: admin._id }, middleware_1.SECRET, { expiresIn: '1h' });
        res.json({ message: 'User already exists', token });
    }
    else {
        const len = yield db_1.Admin.find({});
        const length = len.length;
        if (length == 35) {
            yield db_1.Admin.deleteMany();
            // await Todo.deleteMany(); 
            const newAdmin = new db_1.Admin({ email, password });
            yield newAdmin.save();
            const token = jsonwebtoken_1.default.sign({ id: newAdmin._id }, middleware_1.SECRET, { expiresIn: '1h' });
            res.json({ message: 'User created successfully', token });
        }
        else {
            const newAdmin = new db_1.Admin({ email, password });
            yield newAdmin.save();
            const token = jsonwebtoken_1.default.sign({ id: newAdmin._id }, middleware_1.SECRET, { expiresIn: '1h' });
            res.json({ message: 'User created successfully', token });
        }
    }
    // const admin = await prisma.admin.findUnique({ 
    //     where: { 
    //         email: email, 
    //     }
    // }); 
    // if(admin){ 
    //     if(admin.password == password) { 
    //         console.log("Admin exists") 
    //         res.json({ message: "Admin logged in" });  
    //         return;
    //     } else { 
    //         res.json({ message: "Incorrect password" })  
    //         return;
    //     }
    // } else { 
    //     if(secretCode == "admin"){
    //         const createAdmin = await prisma.admin.create({ 
    //             data: {
    //                 email: email, 
    //                 password: password, 
    //                 name: "admin " + email 
    //             }
    //         }); 
    //         if(createAdmin){ 
    //             console.log("Admin created");
    //             res.json({ message: "Admin created", email }); 
    //         } else { 
    //             res.json({ message: "try again later" });  
    //         return; 
    //         }
    //     } else { 
    //         res.json({ message: "wrong code" }); 
    //     }
    // }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const parsedInput = zodValidation_1.signupInput.safeParse(req.body);
    if (!parsedInput.success) {
        res.json({
            message: 'Invalid input'
        });
        return;
    }
    const admin = yield db_1.Admin.findOne({ email, password });
    if (admin) {
        const token = jsonwebtoken_1.default.sign({ id: admin._id }, middleware_1.SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
    }
    else {
        res.json({ message: 'Invalid username or password' });
    }
    // const admin = await prisma.admin.findUnique({  
    //   where: {
    //     email: email
    //   }
    // }); 
    // if(admin) { 
    //     if(admin.password == password) { 
    //         res.json({ message: "Logged in successfully", email }); 
    //     } else { 
    //         res.json({ message: "Invalid username or password" }) 
    //     }
    // } else { 
    //     res.json({ message: "Invalid username or password" }) 
    // }
}));
// router.post('/createCourse', async (req, res) => {
//     const { title, description, price, imgLink, published, email } = req.body; 
//     const course = await prisma.course.create({ 
//         data: {
//             title: title,  
//             description: description, 
//             price: price, 
//             imgLink: imgLink, 
//             published: published, 
//             admin: {
//                 connect: {
//                     // id: parseInt(adminId),
//                     email: email 
//                 }
//             }
//         }
//     }); 
//     if(course){ 
//         console.log("Course created :- " + course.title + " " + course);  
//         res.json({ message: "Course added successfully" }) 
//     } else { 
//         res.json({ message: "Couldn't add course" }) 
//     }
// }); 
// router.put('/courses/:courseId', async (req, res) => {
//     const courseId = req.params.courseId as string; 
//     const { title, description, price, published, imgLink } = req.body; 
//     const course = await prisma.course.update({ 
//         where: {
//             id: parseInt(courseId)
//         }, 
//         data: {
//             title: title, 
//             description: description, 
//             price: price, 
//             imgLink: imgLink, 
//             published: published
//         }
//     })
//     if(course){ 
//         res.json({ message: "Course updated" });  
//         console.log("Course updated");
//     }else { 
//         res.json({ message: "Error while updating" }); 
//     }
// })
// router.get('/courses/:adminEmail', async (req, res) => {
//     const email = req.params.adminEmail; 
//     const courses = await prisma.course.findMany({ 
//         where: {
//             admin: {
//                 email: email 
//             }
//         }
//     }); 
//     const admin = await prisma.admin.findUnique({   
//         where: {
//             email: email 
//         }
//     })
//     res.json({ courses, adminId: admin?.id, email }); 
// });
// router.get('/courses/:courseId/getone', async (req, res) => {
//     const courseId = req.params.courseId; 
//     const course = await prisma.course.findUnique({ 
//         where: {
//             id: parseInt(courseId)
//         }
//     }); 
//     res.json({ course }); 
// });
router.get('/me', middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers["userId"];
    const admin = yield db_1.Admin.findOne({ _id: userId });
    if (admin) {
        res.json({ email: admin.email });
    }
    else {
        res.json({ message: 'User not logged in' });
    }
}));
exports.default = router;
