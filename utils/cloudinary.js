const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({

    cloud_name: "ddrsqsm14",
    api_key: "467176669363966",
    api_secret: "iuFvMVUklmu9mDr6fC6RUWUeiOs"

    // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    // api_key: process.env.CLOUDINARY_API_KEY,
    // api_secret: process.env.CLOUDINARY_API_SECRET

});

const deleteFromCloudinary = async (publicId, url) => {
    try {
        try {
            const rawResponse = await cloudinary.uploader.destroy(publicId, {
                resource_type: 'raw'
            });
            if (rawResponse.result === 'ok') {
                return rawResponse;
            }
        } catch (rawError) {
            console.log("Raw deletion failed, trying as image");
        }
        const imageResponse = await cloudinary.uploader.destroy(publicId, {
            resource_type: 'image'
        });
        return imageResponse;

    } catch (error) {
        console.error("Error deleting file from Cloudinary:", error.message);
        console.error("Public ID:", publicId);
        console.error("URL:", url);
        return null;
    }
};

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.error("Error uploading file to Cloudinary:", error.message);
        return null;
    }
}

module.exports = { uploadOnCloudinary, deleteFromCloudinary };