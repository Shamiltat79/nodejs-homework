const express = require('express');

const router = express.Router();
const ctrl= require("../../controllers/contacts-controller");
// const schemas = require("../../models/contact");
// const {validateBody} = require("../../decorators");




router.get('/', ctrl.getContacts);

// router.get('/:contactId', ctrl.getContactById)

// router.post('/', validateBody(schemas.contactsAddSchema), ctrl.addContact);

// router.put('/:contactId', validateBody(schemas.contactsAddSchema), ctrl.updateContact);


// router.delete('/:contactId', ctrl.removeContact);


module.exports = router;
