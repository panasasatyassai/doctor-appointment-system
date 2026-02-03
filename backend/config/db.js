const mongoose = require("mongoose") 
const colors = require("colors") 


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MANGODB_URL)
        console.log(`Mongo Db Conneted at  ${mongoose.connection.host}`.bgGreen.white)
    } catch(error) {
        console.log(`Mongodb Srver Issues ${error}`.bgRed.white)
    }
}

module.exports = connectDB  