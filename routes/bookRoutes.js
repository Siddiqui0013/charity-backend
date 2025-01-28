const express = require("express");
const router = express.Router();
const Books = require("../models/Book");

router.post("/books", async (req, res) => {
    try {
        const { title, description} = req.body
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Title and description are required.",
            });
        }
        const book = new Books({ title, description});
        await book.save();
        const response = {
            success: true,
            message: "Book created successfully",
            book,
        };
        res.status(201).json(response);
    } catch (err) {
        const response = {
            success: false,
            message: "Failed to create book",
            error: err.message,
        };
        res.status(400).json(response);
    }
    })

router.get("/books", async (req, res) => {
    try {
        const books = await Books.find();
        const totalBooks = books.length;
        const response = {
            success: true,
            message: "Books fetched successfully",
            totalBooks,
            books,
        };
        res.status(200).json(response);
    } catch (err) {
        const response = {
            success: false,
            message: "Failed to fetch books",
            error: err.message,
        };
        res.status(500).json(response);
    }
});

module.exports = router;