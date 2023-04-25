import  express from "express";
import Portofolio from "../models/Portofolio.js";
const router = express.Router();
import multer from "multer"


const FILE_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error("invalid image type");

        if(isValid) {
            uploadError = null
        }
      cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
      const filesName = file.originalname.split(" ").join("-");
      const extension = FILE_TYPE_MAP[file.mimetype]
      cb(null, `${filesName}-${Date.now()}.${extension}`)
    }
  })

const uploadOptions = multer({storage: storage})






router.get("/", async (req,res) => {
    const portofolio = await Portofolio.find()

    if(!portofolio) {
        res.status(500).json({success:false})
    }
    res.status(200).send(portofolio);
})




router.get("/:id", async (req,res) => {
    
    try{

        const user = await Portofolio.findById(req.params.id)
        
        if(!user) {
            res.status(500).json({success:false})
        }
        res.status(200).send(user);
    } catch (err) {
        next(err)
    }
})



//register
router.post("/",  uploadOptions.any("photo") , async (req,res , next)=>{
    console.log("req",req.files);
    console.log("req",req.body);

    const photoName = req.files[0].filename
    console.log(photoName);
        const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;
    try {
    let newPortofolio = new Portofolio({
        name: req.body.name,
        desc: req.body.desc,
        photo:  `${basePath}/${photoName}`,
        link: req.body.link
    })
    
    newPortofolio = await newPortofolio.save();
        res.send(newPortofolio)
    } catch (err) {
        next(err)
        
    } 

})


router.delete("/:id", async (req,res)=>{
    try {
      const portofolio = await Portofolio.findByIdAndRemove(req.params.id)
        if(portofolio) {
            return res.status(200).json({success: true , message:"the category is deleted"})
        } else {
            return res.status(404).json({success:false , message:"portofolio Not Found"})
        }
        
    } catch (err) {
        return res.status(400).json({succes:false, error:err})
}
})



router.put("/:id", uploadOptions.any("photo") , async (req,res)=>{
    
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;
    const portofolio = await Portofolio.findById(req.params.id)
    
        await portofolio.updateOne(
            {
                $set:req.body,
            },
            )
            
            if (req.files) {
                const photoName = req?.files[0].filename
                console.log(photoName);
              await portofolio.updateOne(
                    {
                        $set:{photo:`${basePath}/${photoName}`},
                    },
                    {new:true}
                    )
        }


        if (!portofolio) {
            return res.status(400).send("the portofolio not found!")
        }
        res.status(200).json("done");   
    }
    );




export default router;