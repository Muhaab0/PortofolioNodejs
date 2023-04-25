import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    emailName: { type: String, required: true},
    phone: { type: String, required: true },
    message:{type:String, required:true}
  }
);




export default mongoose.model("contact", contactSchema);
