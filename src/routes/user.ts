import { PrismaClient } from '@prisma/client'
import express from "express"; 
import jwt from "jsonwebtoken"
import { authenticateJwt, SECRET } from "../middleware";
import { signupInput } from '../zodValidation';
import { User, Admin } from "../db"; 

// const prisma = new PrismaClient()
const router = express.Router(); 

router.post('/signup', async (req, res) => {
  const parsedInput = signupInput.safeParse(req.body);  

  if(!parsedInput.success){ 
      console.log("Errorrrr");
      res.json({ 
          error: parsedInput.error 
      }); 
      return; 
  }

  const email = req.body.email; 
  const password = req.body.password; 

  const user = await User.findOne({ email }); 
    if(user){ 
        const token = jwt.sign({ id: user._id}, SECRET, {expiresIn: '1h'}); 
        res.json({ message: 'User already exists' , token}); 
        console.log(email, password, 1);
    } else { 
        const len = await User.find({ }); 
        const length = len.length; 
        if(length == 35) {
            await User.deleteMany();
            // await Todo.deleteMany(); 
            const newUser = new User({ email, password }); 
            await newUser.save(); 
            const token = jwt.sign({ id: newUser._id}, SECRET, {expiresIn: '1h'}); 
            res.json({ message: 'User created successfully' , token});  
            console.log(email, password, 2);
        } else {
            const newUser = new User({ email, password }); 
            await newUser.save(); 
            const token = jwt.sign({ id: newUser._id}, SECRET, {expiresIn: '1h'}); 
            res.json({ message: 'User created successfully' , token}); 
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

}); 




router.post("/login", async (req, res) => {
  const { email, password } = req.body; 

  const parsedInput = signupInput.safeParse(req.body); 

    if(!parsedInput.success) { 
        res.json({ 
            message: 'Invalid input'
        }); 
        return; 
    } 

    const user = await User.findOne({ email, password }); 
    if(user) { 
        const token = jwt.sign({ id: user._id}, SECRET, {expiresIn: '1h'}); 
        res.json({ message: 'Logged in successfully', token}); 
    } else { 
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


})





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


router.get('/me', authenticateJwt, async (req: any, res: any) => { 
    const userId = req.headers["userId"]; 
    const user = await User.findOne({ _id: userId }); 
    if(user) { 
        res.json({ email: user.email }); 
    } else { 
        res.json({ message: 'User not logged in' }); 
    }
}); 


export default router; 
