import mongoose, { Schema } from "mongoose"

const PlantSchema = new Schema(
  {
    plantName: {
      type: String,
      required: true,
    },
    scientificName: {
      type: String,
      required: true,
    },
    searchType: {
      type: String,
      enum: ["image", "text"],
      required: true
    },
    image: {
      type: String,
      required: true,
      default: 'https://res.cloudinary.com/dmxjulnzo/image/upload/v1775733095/placeholder-image_vjxhuk.png'
    },
    regionalNames: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    generalInfo: {
      type: String,
      required: true
    },
    currentCondition: {
      type: String
    },
    suggestions: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export const Plant = mongoose.model("Plant", PlantSchema)