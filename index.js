import express from "express";
import bootstarp from "./Src/index.router.js";
const app = express()
const port = process.env.port || 5000
import path from "path";
import { fileURLToPath } from "url";
const __dirname = fileURLToPath(import.meta.url)
app.use("/uploads", express.static(path.join(__dirname, "./src/uploads")))
bootstarp(app, express)
app.listen(port, () => {
    console.log('app is running in port ' + port)
})
