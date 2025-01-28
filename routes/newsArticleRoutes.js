const express = require("express");
const router = express.Router();
const NewsArticle = require("../models/NewsArticles");

router.post("/news-articles", async (req, res) => {
  try {
    const { title, description, link } = req.body;

    if (!title || !description || !link) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and link are required.",
      });
    }

    const newsArticle = new NewsArticle({ title, description, link });
    await newsArticle.save();

    res.status(201).json({
      success: true,
      message: "News article created successfully",
      newsArticle,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to create news article",
      error: err.message,
    });
  }
});

router.get("/news-articles", async (req, res) => {
  try {
    const newsArticles = await NewsArticle.find();
    res.status(200).json({
      success: true,
      message: "News articles fetched successfully",
      totalArticles: newsArticles.length,
      newsArticles,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch news articles",
      error: err.message,
    });
  }
});

router.get("/news-articles/:id", async (req, res) => {
  try {
    const newsArticle = await NewsArticle.findById(req.params.id);

    if (!newsArticle) {
      return res.status(404).json({
        success: false,
        message: "News article not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "News article fetched successfully",
      newsArticle,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch news article",
      error: err.message,
    });
  }
});

router.put("/news-articles/:id", async (req, res) => {
  try {
    const { title, description, link } = req.body;

    const updatedArticle = await NewsArticle.findByIdAndUpdate(
      req.params.id,
      { title, description, link },
      { new: true, runValidators: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({
        success: false,
        message: "News article not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "News article updated successfully",
      updatedArticle,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to update news article",
      error: err.message,
    });
  }
});

router.delete("/news-articles/:id", async (req, res) => {
  try {
    const deletedArticle = await NewsArticle.findByIdAndDelete(req.params.id);

    if (!deletedArticle) {
      return res.status(404).json({
        success: false,
        message: "News article not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "News article deleted successfully",
      deletedArticle,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete news article",
      error: err.message,
    });
  }
});

module.exports = router;
