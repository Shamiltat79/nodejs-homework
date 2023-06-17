const {Contact} = require("../models/contact");

const {HttpError, ctrlWrapper} = require("../helpers");





const getContacts = async (req, res) => {
  const {_id: owner} = req.user;
  const {page = 1, limit = 10} = req.query;
  const skip = (page - 1) * limit;
  const result  = await Contact.find({owner}, "-createdAt -updatedAt", {skip, limit}).populate("owner", "email name");
    res.json(result);
    
}

  const getContactById = async (req, res) => {
    
      const {id} = req.params;
    const result = await Contact.findById(id);
    if(!result){
      
      throw HttpError(404, `Contact with ${id} not found` )
    }
    res.json(result);
    
  
}

const addContact = async (req, res) => {
    
      const {_id: owner} = req.params;
      const result = await Contact.create({...req.body, owner});
      res.status(201).json(result);
    
    
  }

  const updateContact = async (req, res) => {
    
      
      const {id} = req.params;
      const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
      if(!result){
        throw HttpError(404, `Contact with ${id} not found` ) 
      }
      res.json(result);
    
  
  
  }


  const updateFavorite = async (req, res) => {
    
      
    const {id} = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
    if(!result){
      throw HttpError(404, `Contact with ${id} not found` ) 
    }
    res.json(result);
  


}

  const removeContact = async (req, res) => {
    
      const {id} = req.params;
      const result = await Contact.findByIdAndRemove(id);
      if(!result){
        throw HttpError(404, `Contact with ${id} not found` ) 
      }
      res.status(204).json({
        message : `Contact with ID ${result.id} was deleted!`})
    
    
  }

  module.exports = {
    getContacts: ctrlWrapper(getContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    updateContact: ctrlWrapper(updateContact),
    updateFavorite: ctrlWrapper(updateFavorite),
    removeContact: ctrlWrapper(removeContact)
  }