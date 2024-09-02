const express = require('express');
const BlogPost = require("../model/blog");

const path = require('path')
const User = require("../model/user");
const multer = require('multer');

// Get all blog posts for landing page
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await BlogPost.find().populate('author', 'name email');
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blog posts", error: error.message });
    }
};

//gets the users all blogs
const getProfile = async (req, res) => {
    try {
        const userId = req.params.id; 
        const user = await User.findById(userId).populate('blogs'); 

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user); 
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
};


//adding blogs
const AddBlogs = async (req, res) => {
    try {
        const { title, category, bio } = req.body;
        const author = req.params.id;
        const image = req.file ? `/public/images/${req.file.filename}` : null;

        if (!title || !category || !bio || !author) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const existingUser = await User.findById(author);
        if (!existingUser) {
            return res.status(400).json({ message: "User not found" });
        }

        const newBlogPost = new BlogPost({
            title,
            category,
            image,
            bio,
            author
        });

        const savedBlog = await newBlogPost.save();
        existingUser.blogs.push(savedBlog._id);
        await existingUser.save();

        res.status(201).json({ message: "Blog post created successfully", blog: savedBlog });
    } catch (error) {
        console.error("Error in AddBlogs:", error);
        res.status(500).json({ message: "Error creating blog post", error: error.message });
    }
};

//get the blogs by id
const getBlogById = async(req,res)=>{
    const { id } = req.params; 
console.log("Fetching Blog ID:", id);
let blog;
    try {
        blog = await BlogPost.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
    } catch (error) {
        console.log("Error fetching blog:", error);
        return res.status(500).json({ message: "Error fetching blog", error: error.message });
    }
return res.status(200).json({ blog });
}

// Update a blog post
const updateBlogs = async(req,res)=>{
    try{
        const {title,category,bio}=  req.body;
        const {userId ,blogId} = req.params
        const image = req.file ? `/public/images/${req.file.filename}` : null;

        let updateData = { title, category, bio };
        if (image) {
            updateData.image = image;
        }
         let blog = await BlogPost.findByIdAndUpdate(
                    {_id : blogId, author : userId},
                    updateData,
                    { new: true, runValidators: true }
            );
            if (!blog) {
                return res.status(404).json({ message: "Blog not found" });
            }
             const updatedBlog = await BlogPost.findById(blogId)
                return res.status(200).json({message: "updated blog succesfully", updatedBlog});
        }catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Error updating the blog", error: error.message });
        }
}

const DeleteBlogs = async (req, res) => {

    try {
        const { id } = req.params;
        const deletedBlog = await BlogPost.findByIdAndDelete(id);
        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog post not found" });
        }
        res.status(200).json({ message: "Blog post deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error deleting blog post", error: error.message });
    }
};

module.exports = { getAllBlogs, AddBlogs, updateBlogs, DeleteBlogs ,getProfile ,getBlogById};


