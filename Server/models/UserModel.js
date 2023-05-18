const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");


const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        min:3,
        max:20
    },
    address:{
        type: String,
        required: true,
        min:3,
        max:20
    },
    password:{
        type: String,
        required: true,
        min:3
    },
    profilePicture:{
        type:String,
        default: ''
    }

},
{timestamps:true}
)
UserSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, {
		expiresIn: "7d",
	});
	return token;
};

const User = mongoose.model("users", UserSchema);


const validate = (data) => {
    const schema = Joi.object({
		name: Joi.string().required().label("name"),
		address: Joi.string().required().label("address"),
		profilePicture: Joi.string().required().label("profilePicture"),
		password: passwordComplexity().required().label("password"),
	});
	return schema.validate(data);
};



module.exports = { User, validate };