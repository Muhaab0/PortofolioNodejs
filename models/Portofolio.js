import mongoose from "mongoose";

const portoflioSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, required: true},
    photo: { type: String, required: true },
    link:  {type:String, required: true}
  }
);




export default mongoose.model("portofolio", portoflioSchema);
