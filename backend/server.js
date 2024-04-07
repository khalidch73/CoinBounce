const express = require('express');
const dbConnection = require('./database/index')
const {PORT} = require('./config/index')
const port = PORT
const router = require('./routes/index') 
const errorHandler = require('./middlewares/errorHandler')
const cookieParser = require('cookie-parser')

const app = express();
app.use(cookieParser())
app.use(express.json());
dbConnection()
app.use('/storage', express.static('storage'))
app.use(router)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Backend is running on port ${port}`)
})