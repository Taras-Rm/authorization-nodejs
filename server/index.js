const express = require("express")
require("dotenv").config()

const PORT = process.env.SERVER_PORT || 5000

const app = express()

app.listen(5000, () => {
    console.log(`Server running on port ${PORT}`)
})