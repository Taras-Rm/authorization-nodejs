const express = require("express")
const mongoose = require("mongoose")
const router = require("./router/router")
require("dotenv").config()

const PORT = process.env.SERVER_PORT || 8080
const DB_URL = process.env.DB_KEY

const app = express()


app.use(express.json())
app.use("/auth", router)

async function startApp() {
    try {
        await mongoose.connect(DB_URL)
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

startApp()