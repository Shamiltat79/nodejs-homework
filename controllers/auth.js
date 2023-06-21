const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const {nanoid} = require("nanoid");

const fs = require('fs/promises');
const path = require('path');
const {User} = require("../models/user");

const {ctrlWrapper, HttpError, sendEmail} = require("../helpers");

const {SECRET_KEY, PROJECT_URL} = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");



const register = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (user) {
       throw HttpError (409, "Email already in use");
    }

const hashPassword = await bcrypt.hash(password, 10);
const verificationToken = nanoid();

const avatarURL = gravatar.url(email);

    const newUser = await User.create({...req.body, password: hashPassword, avatarURL, verificationToken});

    

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${PROJECT_URL}/api/auth/verify/${verificationToken}">Click to verify email</a>`
    };
    
    await sendEmail(verifyEmail);

    const {_id: id} = newUser;
    const payload = {
        id,
    }
    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});

    res.status(201).json({
        token,
        user: {
            name: newUser.name,
            email: newUser.email,
        }
    })

}

const verify = async(req, res)=> {
    const {verificationToken} = req.params;
    const user = await User.findOne({verificationToken});
    if(!user) {
        throw HttpError(404);
    }
    await User.findByIdAndUpdate(user._id, {verify: true, verificationCToken: ""});

    res.json({
        message: "Verification successful"
    })
}

const resendVerifyEmail = async(req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(404, "User not found");
    }
    if(user.verify){
        throw HttpError(400, "Verification has already been passed")
    }
    
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${PROJECT_URL}/api/auth/verify/${user.verificationToken}">Click to verify email</a>`
    };

    await sendEmail(verifyEmail);

    res.json({
        message: "Verification email send"
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
    if (!user || !user.verify) {
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

const updateAvatar = async (req, res) => {
    const {_id} = req.user;
    const {path: tempUpload, originalname} = req.file;

    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);
    
    const avatarURL = path.join("public", "avatars", filename);
    const resizedAvatar =  Jimp.read(resultUpload)
    .then(img => {return img.resize(250, 250).write(avatarURL);
    })
    .catch(error => {
        throw new HttpError(404, `${error.message}`);
    });
    
    
   
    await User.findByIdAndUpdate(_id, resizedAvatar);

    res.json({
        avatarURL,
    })
};
module.exports = {
    register: ctrlWrapper(register),
    verify: ctrlWrapper(verify),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
}