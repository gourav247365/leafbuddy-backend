import { User } from "../models/user.model.js"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { sendMail } from "../../utils/mailer.js"
import { Otp } from "../models/otp.model.js"
import { generateOtp } from "../../utils/generateOtp.js"
import { ApiError } from "../../utils/ApiError.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async function (userId) {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }

  } catch (error) {
    console.error(error)
    throw new Error("Something went Wrong while generating Access and Refresh Token")
  }
}

const sendEmailVerificationCode = asyncHandler(async (req, res) => {

  const { email, otpType } = req.body

  if (otpType === "resetPassword") {
    const user = await User.findOne({ email })
    if (!user) {
      throw new ApiError(401, "User does not Exist with Entered Email")
    }
  }
  else if (otpType === "registerUser") {
    const user = await User.findOne({ email })
    if (user) {
      throw new ApiError(401, "User Already Exist with Entered Email")
    }
  }

  const verificationCode = generateOtp(6)
  const otp = await Otp.create({ email, code: verificationCode, otpType })

  const data = await sendMail({
    to: email,
    subject: "Email Verification",
    text: `
    🌱 WELCOME TO LEAF BUDDY 🌱
    Here is your Verification Code: ${verificationCode}

    This one time password is only valid for 10 minutes
    `
  })

  return res
    .status(200)
    .json({
      succes: true,
      message: "Verification Code Sent Successfully",
    })
})

const registerUser = asyncHandler(async (req, res) => {

  const { email, password, fullname, region, otp } = req.body

  let user = await User.findOne({ email })

  if (user) {
    throw new ApiError(401, "User with Entered Email Already Exists")
  }

  const dbOtp = await Otp.findOne({
    email,
    otpType: "registerUser"
  })

  if (!dbOtp) {
    throw new ApiError(401, "Verification Code is Either Expired or Incorrect")
  }

  const isOtpCorrect = await dbOtp.isOtpCorrect(otp)

  if (!isOtpCorrect) {
    throw new ApiError(401, "Verification Code is Either Expired or Incorrect")
  }

  user = await User.create({
    email,
    fullname,
    password,
    region
  })

  await dbOtp.deleteOne()

  return res
    .status(200)
    .json({
      success: true,
      message: "User Registered Successfully",
      data: user
    })
})

const login = asyncHandler(async (req, res) => {

  const { email, password } = req.body
  let user = await User.findOne({ email })

  if (!user) {
    throw new ApiError(404, "User does not exist for entered Email")
  }

  const isCorrect = await user.isPasswordCorrect(password)

  if (!isCorrect) {
    throw new ApiError(401, "Incorrect Password")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

  return res
    .status(200)
    .json({
      success: true,
      message: "User Logged In Successfully",
      data: { accessToken, refreshToken, user }
    })
})

const logout = asyncHandler(async (req, res) => {

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1
      }
    },
    {
      new: true
    }
  )

  console.log(user)

  return res
    .status(200)
    .json({
      success: true,
      message: "User Logged Out Successfully"
    })
})

const resetPassword = asyncHandler(async (req, res) => {
  const { otp, newPassword, email } = req.body

  const dbOtp = await Otp.findOne({
    email,
    otpType: "resetPassword"
  })

  if (!dbOtp) {
    throw new ApiError(401, "Verification Code is Either Expired or Incorrect")
  }

  const isOtpCorrect = await dbOtp.isOtpCorrect(otp)

  if (!isOtpCorrect) {
    throw new ApiError(401, "Verification Code is Either Expired or Incorrect")
  }

  const user = await User.findOne({ email })

  user.password = newPassword
  await user.save({ validateBeforeSave: false })

  await dbOtp.deleteOne()

  return res
    .status(200)
    .json({
      success: true,
      message: "Password Changed Successfully"
    })
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.header("Authorization").replace("Bearer ", "")
  const decodedRereshToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
  console.log(incomingRefreshToken);

  const userId = decodedRereshToken._id
  const user = await User.findById(userId).select("-password")

  if (!user) {
    throw new ApiError(403, "Invalid Access Token")
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(403, "Refresh Token is Expired or Used")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(userId)

  return res
    .status(200)
    .json({
      success: true,
      message: "accessToken Refreshed Successfully",
      data: { accessToken, refreshToken, user }
    })
})

export {
  registerUser,
  login,
  logout,
  sendEmailVerificationCode,
  resetPassword,
  refreshAccessToken
}