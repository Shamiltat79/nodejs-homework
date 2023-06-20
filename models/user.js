const {Schema, model} = require("mongoose");
const Joi = require("joi");

// const {handleMongooseError} = require("../middlewares");

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
subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
token: {
    type: String,
    default: ""
},
verify: {
    type: Boolean,
    default: false,
},
verificationCode: {
    type: String,
},

avatarURL: {
    type: String,
    required: true,
  },

}, {versionKey: false, timestamps: true});



userSchema.post("save", function handleMongooseError(error, data, next){
    const {name, code} = error;
    error.status = (name === "MongoServerError" && code === 11000) ? 409 : 400;
    
    next();
}

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

const userEmailSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
});

const schemas = {
     registerSchema,
     loginSchema,
    userEmailSchema
};

const User = model('user', userSchema);

module.exports = {
   User, 
    schemas,
    
};