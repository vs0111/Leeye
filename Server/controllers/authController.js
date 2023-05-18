var Loginvalidate = require('../utils/validate')
const { User, validate } = require("../models/UserModel");
const TokenModel = require("../models/TokenModel");
const crypto = require('crypto')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const authController = {
    UserSignup: async (req, res) => {
      console.log('jehjeheh ',req.body);
    try {
      const { error } = validate(req.body);
      if (error){
        console.log(error);
        return res.status(401).send({ message: error.details[0].message });
      }

      let name = await User.findOne({ username: req.body.name });
      if (name)
        return res
          .status(409)
          .send({ message: "Username is taken!", usernameExists: true });


      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const hashPassword = await bcrypt.hash(req.body.password, salt);

      let user = await new User({ ...req.body, password: hashPassword }).save();

      //send email
      const token = await new TokenModel({
        userId: user._id,
        token: crypto.randomBytes(32).toString('hex')
      }).save(); 
      console.log('user = ',user);
      res.status(201).json({token,user});
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
    },



    userLogin:  async (req, res) => {
      try {
        var { error } = Loginvalidate(req.body);
        if (error)
          return res.status(400).send({ message: error.details[0].message });
        

        var user = await User.findOne({ email: req.body.email });
        if (!user)
          return res.status(401).send({ message: "Invalid Email or Password" });

        var validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword)
          return res.status(401).send({ message: "Invalid Email or Password" });

        var token = user.generateAuthToken();

        res.status(200).json({ token, user });
      } catch (error) {
        res.status(500).send({ message: "Internal Server Error",error });
      }


    },
    verifyToken: async (req, res,next) => {
      try {
        const authHeader = req.headers.authorization;
        const Token = authHeader ? authHeader.split(' ')[1].trim() : null;
        const decoded = jwt.verify(Token, process.env.JWT_SECRET_KEY);
        const name = decoded.name;
        const user = await User.findOne({ name: name });
        next();
      } catch (error) {
        res.json({ status: "error", error: "invalid token "+error });
      }
    },


    // verifyUserBlocked : async (req,res) =>{
    //   try{
    //     const {userId} = req.body;
    //     const result = await User.findById(userId);
    //     res.status(200)
    //   }catch(error){
    //     res.status(500)

    //   }
    // }
}

module.exports = authController;