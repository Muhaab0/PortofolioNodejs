import  express from "express";
import Contact from "../models/ContactForm.js";
const router = express.Router();


router.get("/", async (req,res) => {
    const contact = await Contact.find()

    if(!contact) {
        res.status(500).json({success:false})
    }
    res.status(200).send(contact);
})

//register
router.post("/", async (req,res , next)=>{
    try {
    let newForm = new Contact({
        name: req.body.name,
        emailName: req.body.email,
        phone:  req.body.phone,
        message: req.body.message
    })
    
    newForm = await newForm.save();
        res.send(newForm)
        
    } catch (err) {
        next(err)
    } 

})


router.delete("/:id", async (req,res)=>{
    try {
      const contact = await Contact.findByIdAndRemove(req.params.id)
        if(contact) {
            return res.status(200).json({success: true , message:"the form is deleted"})
        } else {
            return res.status(404).json({success:false , message:"form Not Found"})
        }
        
    } catch (err) {
        return res.status(400).json({succes:false, error:err})
}
})





export default router;