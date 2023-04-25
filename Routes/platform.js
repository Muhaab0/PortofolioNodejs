import  express from "express";
import PlatForm from "../models/PlatForms.js";
const router = express.Router();


router.get("/", async (req,res) => {
    const plat = await PlatForm.find()

    if(!plat) {
        res.status(500).json({success:false})
    }
    res.status(200).send(plat);
})

//register
router.post("/", async (req,res , next)=>{
    try {
    let newPlat = new PlatForm({
        facebook: req.body.facebook,
        linkedin: req.body.linkedin,
        github:  req.body.github,
        whatsup: req.body.whatsup
    })
    
    newPlat = await newPlat.save();
        res.send(newPlat)
        
    } catch (err) {
        next(err)
    } 

})



router.delete("/:id", async (req,res)=>{
    try {
      const platForm = await PlatForm.findByIdAndRemove(req.params.id)
        if(platForm) {
            return res.status(200).json({success: true , message:"the platform is deleted"})
        } else {
            return res.status(404).json({success:false , message:"platform Not Found"})
        }
        
    } catch (err) {
        return res.status(400).json({succes:false, error:err})
}
})






export default router;