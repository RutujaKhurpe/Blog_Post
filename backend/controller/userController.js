const User = require("../model/user");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt"); 

const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching users", error });
    }
    
    if (!users) {
        return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
};



const getUserById = async (req, res, next) => {
    const userId = req.params.id;

    // Validate userId
    if (!userId || userId === 'null') {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching user", error });
    }
};

const AddUsers = async (req, res, next) => {
    const { name, email, password } = req.body;
    
    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (error) {
        console.log("Error finding user", error);
        return res.status(500).json({ message: "Error checking existing user", error });
    }
    
    if (existingUser) {
        return res.status(400).json({ message: "User already exists, login instead" });
    }
    
    const hashedPassword = bcrypt.hashSync(password, 8);
    const user = new User({
        name,
        email,
        password: hashedPassword,
        blogs: [],
    });
    
    try {
        await user.save();
        const token = generateToken(user);
        return res.status(201).json({ message: "User created successfully", user, token });
    } catch (error) {
        console.log("Error saving user", error);
        return res.status(500).json({ message: "Error creating user", error });
    }
};

const login = async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (error) {
        console.log("Error finding user", error);
        return res.status(500).json({ message: "Error during login", error });
    }
    
    if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
    }
    
    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect password" });
    }

    const token = generateToken(existingUser);
    
    res.status(200).json({ message: "Logged in successfully", token: token ,  name: existingUser.name , userId : existingUser._id});
};

module.exports = { getAllUsers, AddUsers, login ,getUserById};
