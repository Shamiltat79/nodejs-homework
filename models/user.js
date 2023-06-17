const {Schema, model} = require("mongoose");
const Joi = require("joi");
// const {handleMongooseError} = require("../middlewares/handleMogooseError");
const {handleMongooseError} = require("../middlewares");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
    name: {
        type: String,
         required: true,
},
email: {
    type: String,
    match: emailRegexp,
    unique: true,
    required: true,
},

password: {
    type: String,
    minlength: 6,
    required: true,
},
token: {
    type: String,
    default: ""
}

}, {versionKey: false, timestamps: true});

console.log(handleMongooseError);

userSchema.post("save", handleMongooseError

);


const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().required().min(6),
});

const loginSchema = Joi.object({
        email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().required().min(6),
});

const schemas = {
     registerSchema,
     loginSchema,
    
};

const User = model('user', userSchema);

module.exports = {
   User, 
    schemas,
    
};