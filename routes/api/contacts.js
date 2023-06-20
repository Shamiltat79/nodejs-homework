const express = require('express');
const ctrl = require("../../controllers/contacts-controller");
const {validateBody, isValidId, authenticate} = require("../../middlewares");
const {schemas} = require("../../models/contact");
const router = express.Router();



router.use(authenticate);

router.get("/", ctrl.getContacts);

router.get("/:id", isValidId, ctrl.getContactById)

router.post("/", validateBody(schemas.contactsAddSchema), ctrl.addContact);

router.put("/:id", isValidId, validateBody(schemas.contactsAddSchema), ctrl.updateContact);

router.patch("/:id", isValidId, validateBody(schemas.updateFavoriteSchema), ctrl.updateFavorite);

router.delete("/:id", isValidId, ctrl.removeContact);


module.exports = router;
