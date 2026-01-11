import mongoose, { Schema } from "mongoose"

const PlantSchema = new Schema(
  {
    plantName: {
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
    },
    regionalNames: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
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
  }
)

export const Plant = mongoose.model("Plant", PlantSchema)