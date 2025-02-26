const dotenv = require('dotenv').config()
const PORT = process.env.PORT
const MONGODB_DATABASE_CONNECTION_STRING = process.env.MONGODB_DATABASE_CONNECTION_STRING
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
const BACKEND_SERVER_PATH = process.env.BACKEND_SERVER_PATH
module.exports = {
    PORT,
    MONGODB_DATABASE_CONNECTION_STRING,
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET,
    BACKEND_SERVER_PATH
}
