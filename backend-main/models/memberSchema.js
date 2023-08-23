import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
    uname: { type: String, required: true },
    role: { type: String, required: true },
    uemail: { type: String, required: true },
    phone: { type: String, required: true }
});

const Member = mongoose.model("members", memberSchema);

export default Member;