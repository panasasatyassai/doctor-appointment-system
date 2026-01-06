const express = require("express") 
const app = express() 
app.use(express.json());
 

app.get("/student-read", (req , res) => {
    res.send("Student Read API")
})
 
 



 

app.listen("8000", () => {
    console.log("Server is Started.")
})