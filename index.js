import express from "express";
import bootstarp from "./Src/index.router.js";
const app = express()
const port = process.env.PORT || 5000

bootstarp(app, express)
app.listen(port, () => {
    console.log('app is running in port ' + port)
})
