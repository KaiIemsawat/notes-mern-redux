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

const createNewNote = asyncHandler(async (req, res) => {});

const updateNote = asyncHandler(async (req, res) => {});

const deleteNote = asyncHandler(async (req, res) => {});

export { getAllNotes, createNewNote, updateNote, deleteNote };
