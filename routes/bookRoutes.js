const express = require("express");
const router = express.Router();
const Books = require("../models/Book");
const verifyAdmin = require("../middleWare/verifyAdmin");
const { upload } = require("../middleWare/multer.middleware");
const { uploadOnCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

router.post("/book", verifyAdmin, upload.single("picture"), async (req, res) => {
    try {
        console.log(req.formData);
        const { title, description } = req.body;
        console.log("req.file", req.file);
        console.log("title", title);
        

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Both title and description are required.",
            });
        }

        const newBook = new Books({ title, description });

        if (req.file) {
            const result = await uploadOnCloudinary(req.file.path);
            newBook.image = result.url;
        }

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
        const page = parseInt(req.query.page) || 1;
        const per_page = parseInt(req.query.per_page) || 10;

        const skip = (page - 1) * per_page;

        const totalBooks = await Books.countDocuments();

        const books = await Books.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(per_page);

        res.status(200).json({
            success: true,
            message: "Books fetched successfully.",
            current_page: page,
            per_page: per_page,
            total: totalBooks,
            total_pages: Math.ceil(totalBooks / per_page),
            data: books,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch Books.",
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

router.put("/book/:id", verifyAdmin, upload.single("picture"), async (req, res) => {
    try {
        console.log(req.formData);
        
        const { title, description } = req.body;
        const book = await Books.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: `No book found with ID: ${req.params.id}`,
            });
        }

        const updateData = {
            ...(title && { title }),
            ...(description && { description }),
        };

        if (req.file) {
            if (book.image) {
                const publicId = book.image.split("/").pop().split(".")[0];
                await deleteFromCloudinary(publicId);
            }
            const result = await uploadOnCloudinary(req.file.path);
            updateData.image = result.url;
        }

        const updatedBook = await Books.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        console.log("updatedBook", updatedBook);
        

        res.status(200).json({
            success: true,
            message: "Book updated successfully.",
            data: updatedBook,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update book.",
            error: err.message,
        });
    }
});

router.delete("/book/:id", verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Books.findById(id);
        if (book.image) {
            const publicId = book.image.split("/").pop().split(".")[0];
            await deleteFromCloudinary(publicId, book.image);
        }

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
