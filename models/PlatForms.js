import mongoose from "mongoose";

const platformSchema = new mongoose.Schema(
  {
    facebook: { type: String},
    linkedin: { type: String},
    github:  {type:String},
    whatsup: {type:String}
  }
);




export default mongoose.model("platform", platformSchema);
