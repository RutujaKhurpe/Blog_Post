const express = require("express");
const { getAllUsers, AddUsers, login, getUserById} = require("../controller/userController");
const protect = require("../protect")

const router = express.Router();

router.get('/',protect, getAllUsers); // Route to get all users, protected route
router.get('/:id', protect, getUserById)
router.post('/signup', AddUsers); // Route to sign up a new user
router.post('/login', login); // Route for user login




module.exports = router;
