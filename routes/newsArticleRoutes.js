const express = require("express");
const router = express.Router();
const NewsArticle = require("../models/NewsArticles");
const verifyAdmin = require("../middleWare/verifyAdmin");
const { upload } = require("../middleWare/multer.middleware");
const { uploadOnCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

router.post("/news-article", verifyAdmin, upload.single("picture"), async (req, res) => {
  try {
      const { title, description } = req.body;

      if (!title || !description) {
          return res.status(400).json({
              success: false,
              message: "Title and description required.",
          });
      }

      let pictureUrl;
      if (req.file) {
          console.log(req.file);
          const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
          if (!cloudinaryResponse) {
              throw new Error("Failed to upload image");
          }
          pictureUrl = cloudinaryResponse.url;
      }

      const newsArticle  = new NewsArticle ({ 
          title, 
          description, 
          image: pictureUrl
      });

      const savedNewsArticle  = await newsArticle .save();

      res.status(201).json({
          success: true,
          message: "News created successfully.",
          data: savedNewsArticle,
      });
  } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({
          success: false,
          message: "Failed to create news.",
          error: err.message,
      });
  }
});

router.get("/news-articles", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const per_page = parseInt(req.query.per_page) || 10;

        const skip = (page - 1) * per_page;

        const totalArticels = await NewsArticle.countDocuments();

        const articles = await NewsArticle.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(per_page);

        res.status(200).json({
            success: true,
            message: "Articles fetched successfully.",
            current_page: page,
            per_page: per_page,
            total: totalArticels,
            total_pages: Math.ceil(totalArticels / per_page),
            data: articles,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch Books.",
            error: err.message,
        });
    }
});

router.get("/news-article/:id", async (req, res) => {
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

router.put("/news-article/:id", verifyAdmin, upload.single("picture"), async (req, res) => {
  try {
      const { title, description } = req.body;
      const newsArticle = await NewsArticle.findById(req.params.id);

      if (!newsArticle) {
          return res.status(404).json({
              success: false,
              message: `No news found with ID: ${req.params.id}`,
          });
      }

      const updateData = {
          ...(title && { title }),
          ...(description && { description }),
      };

      if (req.file) {
          if (newsArticle.picture) {
              const publicId = donation.picture.split("/").pop().split(".")[0];
              await deleteFromCloudinary(publicId);
          }
          const result = await uploadOnCloudinary(req.file.path);
          updateData.picture = result.url;
      }

      const updatedNews = await NewsArticle.findByIdAndUpdate(
          req.params.id,
          updateData,
          { new: true, runValidators: true }
      );

      res.status(200).json({
          success: true,
          message: "News updated successfully.",
          data: updatedNews,
      });
  } catch (err) {
      res.status(500).json({
          success: false,
          message: "Failed to update news.",
          error: err.message,
      });
  }
});

router.delete("/news-article/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const article = await NewsArticle.findById(id);
    if (article.picture) {
      const publicId = article.picture.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    const deletedArticle = await NewsArticle.findByIdAndDelete(id);

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
