const express = require('express');
const ctrl = require("../../controllers/contacts-controller");
const {validateBody, isValidId, authenticate} = require("../../middlewares");
const {schemas} = require("../../models/contact");
const router = express.Router();





router.get("/", authenticate, ctrl.getContacts);

router.get("/:id", authenticate, isValidId, ctrl.getContactById)

router.post("/", authenticate, validateBody(schemas.contactsAddSchema), ctrl.addContact);

router.put("/:id", authenticate, isValidId, validateBody(schemas.contactsAddSchema), ctrl.updateContact);

router.patch("/:id", authenticate, isValidId, validateBody(schemas.updateFavoriteSchema), ctrl.updateFavorite);

router.delete("/:id", authenticate, isValidId, ctrl.removeContact);


module.exports = router;
