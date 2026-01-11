import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
    })
    console.log("file is uploaded on cloudinary", response.url)
    fs.unlinkSync(localFilePath)
    return response;
  } catch (error) {
    console.log(error)
    fs.unlinkSync(localFilePath)
    return null;
  }
}

const deleteFromCloudinary = async (url) => {
  try {
    const avatarOldPublicId = url?.split("/")[7]?.split(".")[0]
    // delete file from cloudinary
    const response = await cloudinary.uploader.destroy(avatarOldPublicId)
    if (response.result === "ok") {
      console.log("File deleted successfully.")
    } else if (result.result === "not found") {
      console.log("File not found.")
    }
  } catch (error) {
    console.log("Error deleting file:", error)
  }
}

export { uploadOnCloudinary, deleteFromCloudinary }