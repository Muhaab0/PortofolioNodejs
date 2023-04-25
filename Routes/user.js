import User from "../models/Users.js";
import  express from "express";
const router = express.Router();
import bcrypt from "bcryptjs"
import {createError} from "../utils/error.js"
import jwt from "jsonwebtoken";

//get 

router.get("/", async (req,res) => {
    const user = await User.find().select("-password")

    if(!user) {
        res.status(500).json({success:false})
    }
    res.status(200).send(user);
})

router.get("/:id", async (req,res) => {
    try {
        
        const user = await User.findById(req.params.id)
        
        if(!user) {
            res.status(500).json({success:false})
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).json(error)
    }
})

//register
router.post("/register", async (req,res , next)=>{
    try {
    const user = await User.findOne({email:req.body.email})
    if (user) {
     return next(createError(400,"user already exist"))
    }
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password,10),
    })
    
        newUser = await newUser.save();
        res.send(newUser)
        
    } catch (err) {
         next(err)
        
    } 

})

//login


router.post("/login", async (req,res,next)=> {
    const secret = process.env.secret;
    try {
        const user = await User.findOne({email:req.body.email})
        if (!user) {
            return next(createError(404,"user not found"))
        }
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            const token  = jwt.sign(
                {
                    userId: user.id,
                    isAdmin: user.isAdmin,
                    emails:user.email,
                    name:user.name

                },
                secret,
            )
            res.status(200).send({userEmail: user.email , userName:user.name , token : token});
        } else {
            next(createError(400,"password is wrong"))
        }
    } catch (err) {
        next(err)
    }

    
})



router.delete("/:id", async (req,res)=>{
    try {
      const user = await User.findByIdAndRemove(req.params.id)
        if(user) {
            return res.status(200).json({success: true , message:" user is deleted"})
        } else {
            return res.status(404).json({success:false , message:"user Not Found"})
        }
        
    } catch (err) {
        return res.status(400).json({succes:false, error:err})
}
})



router.put("/:id" , async (req,res,next)=>{
    
    try {
        
        const updatedUser = await User.findById(req.params.id)
        
        const user = await User.findOne({email:req.body.email})
        if (user) {
            return next(createError(400,"user already exist"))
    }
    
        await updatedUser.updateOne(
            {
                $set:req.body,
            },
            )
            
            if (!updatedUser) {
                return res.status(400).send("user not found")
            }
            res.status(200).json("done");   
        } catch (error) {
           next(error)
        }
    }
    );

export default router;