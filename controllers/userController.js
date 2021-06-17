const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const defaultPic = "";

async function addNewUser ({name, email, password, avatar}) {
    console.log(name, email, password, avatar);
    if(!avatar) {
        photUrl = defaultPic;
    }

    let emailRegex = /\S+@\S+\.\S+/;

    if(!emailRegex.test(email)) {
        return {status: false, result: 'Invalid Email'};
    }

    if(!password) {
        return {status: false, result: 'Password is required'};
    }

    let hash = await bcrypt.hash(password, 10);

    try {
        let user = new userModel({name: name, email: email, password: hash, avatar: avatar});
        let savedUser = await user.save();
        return {status: true, result: savedUser};
    }
    catch(err) {
        return err.message;
    }
} 

async function signIn({email, password}) {
    try {
        let user = await userModel.findOne({email: email});
        
        if(user === null) {
            return {status: false, result: {message: "Invalid Email"}};
        }

        let result = await bcrypt.compare(password, user.password);
        
        if(!result) {
            return {status: false, result: {message: "Invalid Password"}};
        }
        else {
            return {status: true, result: user};
        }
    }
    catch(err) {
        return {status: false, result: {message: err.message}}
    }
}

module.exports = {
    addNewUser,
    signIn
}