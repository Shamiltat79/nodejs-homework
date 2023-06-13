const {Schema, model} = require("mongoose");
const Joi = require("joi");
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
    required: true,
},

password: {
    type: String,
    minlength: 6,
    required: true,
}}, {versionKey: false, timestamps: true});

userSchema.post("save", handleMongooseError );

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
    register: registerSchema,
    login: loginSchema,
    user: userSchema,
};

const User = model('User', userSchema);

module.exports = {
    schemas,
    User,
};