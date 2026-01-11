import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { 
  getPlantDetailByImage,
  getPlantDetailByName,
  createPlantPost,
  deletePlantPost,
  getSavedPlantPosts
} from "../controllers/plant.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router = Router()

router.route("/search-image").post(upload.single("image"),getPlantDetailByImage)
router.route("/search-name").get(getPlantDetailByName)
router.route("/save").post(verifyJWT,upload.single("image"),createPlantPost)
router.route("/:plantId").delete(deletePlantPost)
router.route("/current-user-plants").get(verifyJWT,getSavedPlantPosts)

export default router