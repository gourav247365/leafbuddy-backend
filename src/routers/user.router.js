import { Router } from "express"
import { 
  sendEmailVerificationCode,
  registerUser,
  login,
  logout,
  resetPassword,
  refreshAccessToken
} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/send-verification-code").post(sendEmailVerificationCode)
router.route("/signup").post(registerUser)
router.route("/login").post(login)
router.route("/logout").post(verifyJWT,logout)
router.route("/reset-password").post(resetPassword)
router.route("/refresh").post(refreshAccessToken)

export default router