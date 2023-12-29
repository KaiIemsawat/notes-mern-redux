import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

import Note from "../models/NoteModel.js";
import User from "../models/UserModel.js";

// Description - GET - "/users" - Get all users
// Access - Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password").lean();

    if (!users) {
        return res.status(400).json({ message: "No user found" });
    }

    res.json(users);
});

// Description - POST - "/users" - Create new usaer
// Access - Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body;

    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check duplicate
    const isDup = await User.findOne({ username }).lean().exec();
    if (isDup) {
        return res.status(409).json({ message: "Duplicate username" });
    }

    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and store new user
    const userObj = { username, password: hashedPassword, roles };
    const user = await User.create(userObj);
    if (user) {
        res.status(201).json({ message: `New user ${username} created` });
    } else {
        res.status(400).json({ message: "Invalid user data received" });
    }
});

// Description - PATCH - "/users" - Update a usaer
// Access - Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, roles, active, password } = req.body;

    if (
        !id ||
        !username ||
        !Array.isArray(roles) ||
        !roles.length ||
        typeof active !== "boolean"
    ) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    // Check duplicate
    const isDup = await User.findOne({ username }).lean().exec();
    // Allow updates to the original user
    if (isDup && isDup?._id.toString() !== id) {
        return res.status(409).json({ message: "Duplicate username" });
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }

    const updetedUser = await user.save();

    res.json({ message: `${updetedUser.username} update` });
});

// Description - DELETE - "/users" - Delete a usaer
// Access - Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    // Check user
    // - case no id
    if (!id) {
        return res.status(400).json({ message: "User ID required" });
    }
    // - case still hae note assigned
    const notes = await Note.findOne({ user: id }).lean().exec();
    if (notes?.length) {
        return res.status(400).json({ message: "User has assigned notes" });
    }
    // - case id not match
    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const result = await user.deleteOne();

    const reply = `Username ${result.username} with ID ${result._id} is deleted`;
    res.json(reply);
});

export { getAllUsers, createNewUser, updateUser, deleteUser };
