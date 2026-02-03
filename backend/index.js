const express = require("express") 
const cors = require("cors")
const colors =  require("colors") 
const morgan = require("morgan");
const dotenv = require("dotenv") 
const connectDB = require("./config/db")

 

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

dotenv.config();

connectDB();

require("./utils/appointmentReminder");
require("./utils/sendEmail");
console.log(process.env.MANGODB_URL);

app.use("/api/v2/user", require("./routes/userRoutes"));
app.use("/api/v2/doctor", require("./routes/doctorRoutes"));
app.use("/api/v2/appointment", require("./routes/appointmentRoutes"));
app.use("/api/v2/admin", require("./routes/adminRoutes"));
//app.use("/api/v2/doctor-profile", require("./routes/doctorProfile"));
//app.use("/api/v2/appointment", require("./routes/appointmentRoutes"));
app.use("/api/v3/doctor", require("./routes/doctorProfileRoutes"));
app.use("/api/v2/doctor-details", require("./routes/userProfileRoutes"));



const port = process.env.PORT || 5000
app.listen(port , () => {
    console.log(`Server is running at http://localhost:${port}`.bgCyan.white)
})