const bcrypt = require('bcrypt');
const userModel = require('../Models/users');
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');

const userRegister = async (req, res) => {
    try {
        const { username, email, password, userType, secretID } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(409).json({ error: "User already exists" });
        }

        let role = 'user';
        if (userType === 'admin') {
            if (secretID === process.env.SECRET_CODE) {
                role = 'admin';
            } else {
                return res.status(401).json({ error: "Secret code doesn't match" });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({ username, email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const userLogin = async (req, res) => {
    const { email, password, userType } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isLoggedin = await bcrypt.compare(password, user.password);
        if (!isLoggedin) {
            return res.status(401).json({ error: "Password doesn't match" });
        }

        if (userType !== user.role) {
            return res.status(401).json({ error: "Role doesn't match" });
        }

        const token = jwt.sign({ id: user._id }, 'secret');
        res.status(200).json({ username: user.username, role: user.role, token, userID: user._id });

    } catch (err) {
        console.error("Internal Server Error: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const allUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        const userList = users.filter(user => user.role !== 'admin');
        res.status(200).json(userList);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deleteUser = async (req, res) => {
    const { userID } = req.body;

    if (!userID) {
        return res.status(400).json({ error: "UserID is required" });
    }

    try {
        const removedUser = await userModel.findByIdAndDelete(userID);
        if (!removedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(removedUser);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const editUser = async (req, res) => {
    const { userID } = req.params;
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ error: "Username and email are required" });
    }

    try {
        const findUser = await userModel.findById(userID);
        if (!findUser) {
            return res.status(404).json({ error: "User not found" });
        }

        findUser.username = username;
        findUser.email = email;

        const editedUser = await findUser.save();
        res.status(200).json(editedUser);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const findUser = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: "UserID is required" });
    }

    try {
        const userDetails = await userModel.findById(id);
        if (!userDetails) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ username: userDetails.username });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" })
    }
};




module.exports = { userRegister, userLogin, allUsers, deleteUser, editUser, findUser };
