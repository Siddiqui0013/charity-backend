const express = require("express");
const router = express.Router();
const Books = require("../models/Book");

router.post("/book", async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Both title and description are required.",
            });
        }

        const newBook = new Books({ title, description });
        const savedBook = await newBook.save();

        res.status(201).json({
            success: true,
            message: "Book created successfully.",
            data: savedBook,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "An error occurred while creating the book.",
            error: err.message,
        });
    }
});

router.get("/books", async (req, res) => {
    try {
        const books = await Books.find();
        if (books.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No books found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Books fetched successfully.",
            total: books.length,
            data: books,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching books.",
            error: err.message,
        });
    }
});

router.get("/book/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Books.findById(id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: `No book found with ID: ${id}`,
            });
        }

        res.status(200).json({
            success: true,
            message: "Book fetched successfully.",
            data: book,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching the book.",
            error: err.message,
        });
    }
});

router.put("/book/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        if (!title && !description) {
            return res.status(400).json({
                success: false,
                message: "At least one field (title or description) must be provided to update.",
            });
        }

        const updatedBook = await Books.findByIdAndUpdate(
            id,
            { title, description },
            { new: true, runValidators: true }
        );

        if (!updatedBook) {
            return res.status(404).json({
                success: false,
                message: `No book found with ID: ${id}`,
            });
        }

        res.status(200).json({
            success: true,
            message: "Book updated successfully.",
            data: updatedBook,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "An error occurred while updating the book.",
            error: err.message,
        });
    }
});

router.delete("/book/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBook = await Books.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).json({
                success: false,
                message: `No book found with ID: ${id}`,
            });
        }

        res.status(200).json({
            success: true,
            message: "Book deleted successfully.",
            data: deletedBook,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "An error occurred while deleting the book.",
            error: err.message,
        });
    }
});

module.exports = router;
