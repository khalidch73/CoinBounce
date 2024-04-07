const mongoose = require('mongoose');
const {MONGODB_DATABASE_CONNECTION_STRING} = require('../config/index');
const connectionString = MONGODB_DATABASE_CONNECTION_STRING



const dbConnection = async()=> {
  try {
    const connection = await mongoose.connect(connectionString);
    console.log(`database connected to host : ${connection.connection.host}`);
  } catch (error) {
    console.log(`Error : ${error}`);
  }
}


module.exports = dbConnection;