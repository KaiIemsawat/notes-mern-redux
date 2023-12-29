import express from "express";

import {
    createNewNote,
    getAllNotes,
    updateNote,
    deleteNote,
} from "../controllers/NoteController.js";

const router = express.Router();

router
    .route("/")
    .get(getAllNotes)
    .post(createNewNote)
    .patch(updateNote)
    .delete(deleteNote);

export default router;
