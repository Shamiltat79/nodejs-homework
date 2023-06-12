const {Schema, model} = require("mongoose");
const Joi = require("joi");
const {handleMongooseError} = require("../middlewares");

const contactSchema = new Schema({  
    name: {type: String,
           required: [true, "Set name for contact"]
},
    email: {type: String,
            required: [true, "Set email for contact"]},
    phone: {type: String,
            required: [true, "Set phone for contact"],
            match: /^\(\d\d\d\) \d\d\d-\d\d-\d\d$/ },
    favorite:{type: Boolean,
         default: false},
}, {versionKey: false, timestamps: true} );

contactSchema.post("save", handleMongooseError );

const contactsAddSchema = Joi.object(
    {name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean().default(false),
  });

  const updateFavoriteSchema = Joi.object(
    {favorite: Joi.boolean().required(),}
  )

const Contact = model("contact", contactSchema);
const schemas = {
    contactsAddSchema,
    updateFavoriteSchema,
 }
 
module.exports = {
    Contact,
    schemas,};