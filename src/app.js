import express from "express"
import userRouter from "./routers/user.router.js"
import plantRouter from "./routers/plant.router.js"
import cors from 'cors'

const app = express()

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", (req, res) => res.sendStatus(200));


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({limit: "16kb"}))
app.use(express.static("public"))

app.use("/api/users",userRouter)
app.use("/api/plants",plantRouter)

export {app}