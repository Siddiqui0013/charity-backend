const cloudinary = require('cloudinary').v2;

cloudinary.config({

    cloud_name: "dxao2uisw",
    api_key: "954972892625372",
    api_secret: "qJSClFC_8QQVrSeCuT9Z6RxC7hY"

    // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    // api_key: process.env.CLOUDINARY_API_KEY,
    // api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        return response;
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        throw error;
    }
};

const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Cloudinary delete failed:", error);
        throw error;
    }
};

module.exports = { uploadOnCloudinary, deleteFromCloudinary };