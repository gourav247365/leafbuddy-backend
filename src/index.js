import { app } from "./app.js"
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config({
  path: "./.env"
})

const db_name = "LeafBuddy"

mongoose.connect(`${process.env.MONGO_URI}/${db_name}`)
  .then((res) => {
    console.log("MongoDB Connected Sucessfully, Host:", res.Connection)

    app.listen(process.env.PORT, () => {
      console.log("app is listening 4000")
    })

  })
  .catch((error) => {
    console.log("MongoDB Connection Failed!", error)
    process.exit(1)
  })