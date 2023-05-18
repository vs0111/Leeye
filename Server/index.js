const express =   require("express");
const mongoose =  require("mongoose");
const cors = require("cors");
const helmet =  require("helmet");
const dotenv =  require('dotenv')
const morgan =  require("morgan");
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const router = require('express').Router();

const app = express();
dotenv.config()

//Database
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true})
.then(()=>{
    console.log('Database Connected Successfully')
})
.catch((err)=>{
    console.log('err = ',err.message)
}) 

//Middleware
app.use(express.json())
app.use(cors());
app.use(helmet())
app.use(morgan('common'))

// routes
app.use('/api/user',userRoute)
app.use('/api/auth',authRoute)


// console.log(process.env.PORT); 
const server = app.listen(process.env.PORT || 8800, () => {
  console.log(`Server is ready at ${process.env.PORT}`);
});
