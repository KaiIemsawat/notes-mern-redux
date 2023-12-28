import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

const AutoIncrement = mongooseSequence(mongoose);

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

noteSchema.plugin(AutoIncrement, {
    inc_field: "ticket",
    id: "ticketNums",
    start_seq: 500,
});

const Note = mongoose.model("Note", noteSchema);
export default Note;

// instead of
// const AutoIncrement = require("mongoose-sequence")(mongoose)
// use
// import AutoIncrement from "mongoose-sequence";
// const AutoIncrement = mongooseSequence(mongoose);
// for "type" : "module"
