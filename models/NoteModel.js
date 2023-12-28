import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User", // refering to 'User schema'
        },
        title: { type: String, required: true },
        text: { type: String, required: true },
        completed: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);
export default Note;