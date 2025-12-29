const express = require("express") 
const cors = require("cors")
const colors =  require("colors") 
const morgan = require("morgan");
const dotenv = require("dotenv") 
const connectDB = require("./config/db")
const nodeMailer = require("nodemailer") 

const app = express()



app.use(express.json())
app.use(morgan("dev")); 
app.use(cors())

dotenv.config();


connectDB()

const x = nodeMailer.createTransport({
    service : "gmail", 
    auth : {
        user : process.env.gmail , 
        pass : process.env.pass 
    }
})
const y = {
    from: 'panasasatyasai@gmail.com',
    to: 'panasasatyasai@gmail.com',
    subject: 'Testing',
    text: 'Hello, Please provide the feedback.!'
};

x.sendMail(y, (error, info) => {
    if (error) {
        console.log('Error:', error);
    } else {
        console.log('Email sent:', info.response);
    }
});
 


const port = process.env.PORT || 5000
app.listen(port , () => {
    console.log(`Server is running at http://localhost:${port}`.bgCyan.white)
})