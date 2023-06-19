const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");

// const fs = require('fs/promises');
// const path = require('path');
const {User} = require("../models/user");

const {ctrlWrapper, HttpError} = require("../helpers");

const {SECRET_KEY} = process.env;




const register = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (user) {
       throw HttpError (409, "Email already in use");
    }

const hashPassword = await bcrypt.hash(password, 10);

const avatarURL = gravatar.url(email);

    const newUser = await User.create({...req.body, password: hashPassword, avatarURL});

    res.status(201).json({    
        email: newUser.email,
        name: newUser.name,
    })

}

// const addAvatar = async (req, res, next) => {
//     const {path: oldPath, filename} = req.file;
//     const newPath = path.join(avatarsPath, filename);
//     await fs.rename(oldPath, newPath);
//     const avatar = path.join("avatars", filename);
//     res.json({avatar});

// }

const login = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) {
        throw HttpError (401, "Email or password invalid");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError (401, "Email or password invalid");
    }

    const {_id: id} = user;

    const payload = {
        id,
    }

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});

    await User.findByIdAndUpdate(id, {token});

    res.json({
        token,
        user: {
                email: user.email,
                subscription: user.subscription,
        }
        
    });
}

const getCurrent = async (req, res) => {
    const {token, email, subscription} = req.user;
    res.json({
        token,
        user: {
            email,
         subscription,
        }
        
        });
};

const logout = async (req, res) => {
    const{_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});

    res.json({
        message: "Logout success"
    })
};
module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
}