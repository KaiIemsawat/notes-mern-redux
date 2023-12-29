import asyncHandler from "express-async-handler";

import Note from "../models/NoteModel.js";
import User from "../models/UserModel.js";

const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean();

    if (!notes?.length) {
        return res.status(400).json({ message: "No note found" });
    }

    res.json(notes);
});

const createNewNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body;
    // console.log(user, title, text); // user will need user id

    if (!user || !title || !text) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const isDup = await Note.findOne({ title }).lean().exec();
    if (isDup) {
        return res.status(409).json({ message: "Duplicate title" });
    }

    const newNote = await Note.create({ user, title, text });
    if (newNote) {
        return res
            .status(201)
            .json({ message: `New note - ${title} - created` });
    } else {
        return res.status(400).json({ message: "Invalid data received" });
    }
});

const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body;
    console.log(id, user, title, text, completed);

    if (!id || !user || !title || !text || typeof completed !== "boolean") {
        return res.status(400).json({ message: "All fileds are required" });
    }

    const note = await Note.findById(id).exec();
    if (!note) {
        return res.status(400).json({ message: "Note not found" });
    }

    const isDup = await Note.findOne({ title }).lean().exec();
    if (isDup && isDup?._id.toString() !== id) {
        return res.status(409).json({ message: "Duplicate title" });
    }

    note.user = user;
    note.title = title;
    note.text = text;
    note.completed = completed;

    await note.save();

    res.json({ message: `${note.title}'s been updated` });
});

const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Note ID required" });
    }

    const note = await Note.findById(id).exec();

    if (!note) {
        return res.status(404).json({ message: "Note not found" });
    }

    await note.deleteOne();
    res.json({
        message: `Note - ${note.title} - with ID #${note.id} has been deleted`,
    });
});

export { getAllNotes, createNewNote, updateNote, deleteNote };
