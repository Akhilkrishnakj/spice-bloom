import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        confirmPassword: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
            required: true,
        },
        role: {
            type: Number,
            default: 0,
        },
},{timestamps: true});

export default mongoose.model("User", userSchema);