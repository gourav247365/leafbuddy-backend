import { asyncHandler } from "../../utils/asyncHandler.js"
import { Plant } from "../models/plant.model.js"
import { getPlantInfoByImageAi, getPlantInfoByNameAi } from "../../utils/ai.js"
import { ApiError } from "../../utils/ApiError.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../../utils/cloudinary.js"
import fs from "fs"

const getPlantDetailByName = asyncHandler(async (req, res) => {

  const { plantName } = req.query
  const region = req.user?.region || "india"

  const plantDetail = await getPlantInfoByNameAi(plantName, region)

  if (!plantDetail) {
    throw new ApiError(401, "Something Went Wrong while Fetching Plant Information")
  }

  plantDetail.searchType = "text"

  return res
    .status(200)
    .json({
      statusCode: 200,
      success: true,
      message: "Plant Info Fetched Successfully",
      data: plantDetail
    })
})

const getPlantDetailByImage = asyncHandler(async (req, res) => {

  const imageFilePath = req.file?.path
  const { region = "india" } = req.body

  if (!imageFilePath) {
    throw new ApiError(404, "Image File is Missing")
  }

  const imageBuffer = fs.readFileSync(imageFilePath)
  const base64Image = imageBuffer.toString("base64")

  const plantDetail = await getPlantInfoByImageAi(base64Image, region)

  if (!plantDetail) {
    throw new ApiError(401, "Something Went Wrong while Fetching Plant Information")
  }

  fs.unlinkSync(imageFilePath)
  plantDetail.searchType = "image"

  return res
    .status(200)
    .json({
      success: true,
      message: "Plant Info Fetched Successfully",
      data: plantDetail
    })
})

const createPlantPost = asyncHandler(async (req, res) => {

  const { plantDetail } = req.body

  let plant = JSON.parse(plantDetail)
  plant.owner = req.user?._id

  if (plant.searchType === "image") {

    const imageFilePath = req.file?.path

    if (!imageFilePath) {
      throw new ApiError(404, "Image File is Missing")
    }

    const uploadedImage = await uploadOnCloudinary(imageFilePath)

    if (!uploadedImage) {
      throw new ApiError(401, "Something Went Wrong while Uploading the File")
    }

    plant.image = uploadedImage.secure_url
  }

  const plantPost = await Plant.create(plant)

  return res
    .status(200)
    .json({
      success: true,
      message: "Plant Info Saved Successfully",
      data: plantPost
    })
})

const deletePlantPost = asyncHandler(async (req, res) => {

  const { plantId } = req.params

  const deletedPost = await Plant.findByIdAndDelete(plantId)

  if (!deletedPost) {
    throw new ApiError(401, "Sothething Went Wrong while Deleting PlantInfo Post")
  }
  
  if(deletedPost.searchType === "image") {
    deleteFromCloudinary(deletedPost.image)
  }

  return res
    .status(200)
    .json({
      success: true,
      message: "Plant Info Post deleted Successfully",
      data: deletedPost
    })
})

const getSavedPlantPosts = asyncHandler(async (req, res) => {

  const userId = req.user?._id
  
  const saved = await Plant.find({ owner: userId }).sort({createdAt: -1})

  return res
    .status(200)
    .json({
      success: true,
      message: "Saved Plant Info Fetched Successfully",
      data: saved
    })
})

export {
  getPlantDetailByName,
  getPlantDetailByImage,
  createPlantPost,
  deletePlantPost,
  getSavedPlantPosts
}