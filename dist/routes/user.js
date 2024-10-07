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
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedInput = zodValidation_1.signupInput.safeParse(req.body);
    if (!parsedInput.success) {
        console.log("Errorrrr");
        res.json({
            error: parsedInput.error
        });
        return;
    }
    const email = req.body.email;
    const password = req.body.password;
    const user = yield db_1.User.findOne({ email });
    if (user) {
        const token = jsonwebtoken_1.default.sign({ id: user._id }, middleware_1.SECRET, { expiresIn: '1h' });
        res.json({ message: 'User already exists', token });
        console.log(email, password, 1);
    }
    else {
        const len = yield db_1.User.find({});
        const length = len.length;
        if (length == 35) {
            yield db_1.User.deleteMany();
            // await Todo.deleteMany(); 
            const newUser = new db_1.User({ email, password });
            yield newUser.save();
            const token = jsonwebtoken_1.default.sign({ id: newUser._id }, middleware_1.SECRET, { expiresIn: '1h' });
            res.json({ message: 'User created successfully', token });
            console.log(email, password, 2);
        }
        else {
            const newUser = new db_1.User({ email, password });
            yield newUser.save();
            const token = jsonwebtoken_1.default.sign({ id: newUser._id }, middleware_1.SECRET, { expiresIn: '1h' });
            res.json({ message: 'User created successfully', token });
            console.log(email, password, 3);
        }
    }
    // const user = await prisma.user.findUnique({ 
    //     where: {
    //         email: email, 
    //     }        
    // }); 
    // if(user){ 
    //   if (user.password == password){
    //     res.json({ message: 'User already exists', email, userId: user.id }); 
    //   } else {
    //     res.json({ message: "Incorrect password" }); 
    //   }
    //     res.json({ message: 'User already exists', email, userId: user.id }); 
    // } else { 
    //     const newUser = await prisma.user.create({ 
    //         data: {
    //             email: email, 
    //             password: password, 
    //             name: "user " + email,
    //         }
    //     }); 
    //     res.json({ message: 'Created user sucessfully', email, userId: newUser.id }); 
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
    const user = yield db_1.User.findOne({ email, password });
    if (user) {
        const token = jsonwebtoken_1.default.sign({ id: user._id }, middleware_1.SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
    }
    else {
        res.json({ message: 'Invalid username or password' });
    }
    // const user = await prisma.user.findUnique({ 
    //   where: {
    //     email: email
    //   }
    // }); 
    // if(user){ 
    //   if(user.password == password){ 
    //     console.log("User exists");
    //     res.json({ message: "Logged in successfully", email }); 
    //     return 
    //   } else { 
    //     console.log("wrong password"); 
    //     res.json({ message: "Incorrect password" }) 
    //     return 
    //   }
    // } else { 
    //   console.log("invalid"); 
    //   res.json({ message: 'Invalid username or password' });  
    //   return 
    // }
}));
// router.get('/courses/:userEmail', async (req, res) => {
//   const email = req.params.userEmail; 
//   const courses = await prisma.course.findMany({ 
//     where: {
//       published: true 
//     }
//   }); 
//   const user = await prisma.user.findUnique({ 
//     where: {
//       email: email 
//     }
//   }); 
//   if(courses){ 
//     res.json({ courses, user }); 
//   }else{ 
//     res.json({ message: "courses not found" }) 
//   }
// });
// router.get("/courses/:courseId/:userEmail", async (req, res) => {
//   const courseId = req.params.courseId; 
//   const userEmail = req.params.userEmail; 
//   const course = await prisma.course.findUnique({ 
//     where: {
//       id: parseInt(courseId) 
//     }, 
//     include: {
//       users: true
//     }
//   }); 
//   const users = course?.users; 
//   let theUser = null; 
//   users?.map(user => {
//     if(user.email == userEmail){ 
//       theUser = user.id
//     }
//   }); 
//   if(course) { 
//     res.json({ message: "course found", course, theUser }); 
//   } else { 
//     res.json({ message: "course not found" })
//   }
// })
// router.get("/findid/:userEmail", async (req, res) => { 
//   const email = req.params.userEmail;  
//   const user = await prisma.user.findUnique({ 
//     where: { 
//       email: email
//     }
//   }); 
//   if(user){ 
//     res.json({ message: "success", user }); 
//   } else { 
//     res.json({ message: "filed" })  
//   }
// })
// router.post("/courses/:courseId/buy", async (req, res) => {
//   console.log("reached in backend");
//   const courseId = req.params.courseId; 
//   const { email } = req.body; 
//   const course = await prisma.course.findUnique({ 
//     where: {
//       id: parseInt(courseId) 
//     }
//   }); 
//   console.log(course);
//   if(course){ 
//     const user = await prisma.user.findUnique({ 
//       where: { 
//         email: email, 
//       }
//     }); 
//     if(user){ 
//       await prisma.course.update({ 
//         where: {
//           id: parseInt(courseId)
//         }, 
//         data: {
//           users: {
//             connect: {
//               email: email 
//             }
//           }
//         }
//       })
//       res.json({message: "Bought it" })
//     } else { 
//       res.status(403).json({ message: 'user not found' });
//     }
//   } else { 
//     res.status(404).json({ message: 'course not found' });
//   }
// })
// router.get('/purchasedCourses/:userEmail', async (req, res) => {
//   const email = req.params.userEmail; 
//   const user = await prisma.user.findUnique({ 
//     where: {
//       email: email
//     }, 
//     include: { 
//       courses: true 
//     }
//   }); 
//   const userId = user?.id
//   if(user) { 
//     res.json({ user, userId, email, courses: user.courses }); 
//   }
// });
router.get('/me', middleware_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers["userId"];
    const user = yield db_1.User.findOne({ _id: userId });
    if (user) {
        res.json({ email: user.email });
    }
    else {
        res.json({ message: 'User not logged in' });
    }
}));
exports.default = router;
