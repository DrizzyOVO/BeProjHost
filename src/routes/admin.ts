import { PrismaClient } from '@prisma/client'
import express from "express"; 
import jwt from "jsonwebtoken"
import { authenticateJwt, SECRET } from "../middleware";
import { signupInput } from '../zodValidation';
import { User, Admin } from "../db"; 

// const prisma = new PrismaClient()
const router = express.Router(); 


router.post("/signup", async (req, res) => { 

    const parsedInput = signupInput.safeParse(req.body);  

    if(!parsedInput.success){ 
        res.status(411).json({ 
            error: parsedInput.error 
        }); 
        return; 
    }

    const email = req.body.email; 
    const password = req.body.password; 
    const secretCode = req.body.secretCode; 

        
    const admin = await Admin.findOne({ email }); 
    if(admin){ 
        if(admin.password != password) { 
            res.json({ message: 'Incorrect Password'}); 
        }
        const token = jwt.sign({ id: admin._id}, SECRET, {expiresIn: '1h'}); 
        res.json({ message: 'User already exists' , token}); 
    } else { 
        const len = await Admin.find({ }); 
        const length = len.length; 
        if(length == 35) {
            await Admin.deleteMany();
            // await Todo.deleteMany(); 
            const newAdmin = new Admin({ email, password }); 
            await newAdmin.save(); 
            const token = jwt.sign({ id: newAdmin._id}, SECRET, {expiresIn: '1h'}); 
            res.json({ message: 'User created successfully' , token});  
        } else {
            const newAdmin = new Admin({ email, password }); 
            await newAdmin.save(); 
            const token = jwt.sign({ id: newAdmin._id}, SECRET, {expiresIn: '1h'}); 
            res.json({ message: 'User created successfully' , token}); 
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

    const admin = await Admin.findOne({ email, password }); 
    if(admin) { 
        const token = jwt.sign({ id: admin._id}, SECRET, {expiresIn: '1h'}); 
        res.json({ message: 'Logged in successfully', token}); 
    } else { 
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

})



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

router.get('/me', authenticateJwt, async (req: any, res: any) => { 
    const userId = req.headers["userId"]; 
    const admin = await Admin.findOne({ _id: userId }); 
    if(admin) { 
        res.json({ email: admin.email }); 
    } else { 
        res.json({ message: 'User not logged in' }); 
    }
}); 

export default router; 



