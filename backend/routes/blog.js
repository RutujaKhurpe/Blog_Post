const express = require("express");
const { getAllBlogs, AddBlogs , updateBlogs,DeleteBlogs,getProfile,getBlogById} = require("../controller/blogController");
const protect = require("../protect")
const multer = require('multer')

const router = express.Router();
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => 
        cb(null, path.join(__dirname, '../public/images')),
    filename: (req, file, cb) => 
        cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage: storage });

router.get('/', getAllBlogs); // Route to get all users, protected route
router.post('/:id/addblog',protect, upload.single('image'), AddBlogs);//add blogs
router.put('/:userId/:blogId/update',protect, upload.single('image'), updateBlogs); // Route for user login
router.delete('/:id/delete',protect,  DeleteBlogs); // Route for user login
router.get("/:id",getProfile )
router.get("/:id/get",getBlogById )

module.exports = router;
