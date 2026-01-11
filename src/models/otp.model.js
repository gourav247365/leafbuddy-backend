import bcrypt from "bcryptjs"
import mongoose,{ Schema } from "mongoose"

const otpSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 
  },
  otpType: {
    type: String,
    enum: ["registerUser","resetPassword"]
  }
})

otpSchema.methods.isOtpCorrect = function(code) {
  return bcrypt.compare(code,this.code)
}

otpSchema.pre("save",async function (next) {
  if(this.isNew) {
    this.code = await bcrypt.hash(this.code,10)
    next()
  }
})

export const Otp = mongoose.model("Otp",otpSchema)