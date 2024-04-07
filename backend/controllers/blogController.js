const Joi = require("joi");
const fs = require("fs");
const Blog = require("../models/blog")
const BACKEND_SERVER_PATH = require("../config/index")
const BlogDto = require("../dto/blog")
const mongoose = require('mongoose');


const mongoDbRegExpId = /^[0-9a-fA-F]{24}$/

const blogController = {

    // create blog

    async createBlog(req, res, next) {

        // create blog schema

        const createBlogSchema = Joi.object({
            title: Joi.string().min(3).max(30).required(),
            content: Joi.string().min(3).max(30).required(),
            photoPath: Joi.string().required(),  // client side -> based64 encoded string -> decode in backend -> stor -> save photos path in data base 
            author: Joi.string().regex(mongoDbRegExpId).required(),
        });

        // validate request body

        const { error } = createBlogSchema.validate(req.body);

        // if error in validation return error via a middleware
        if (error) {
            return next(error);
        }

        const { title, content, photoPath, author } = req.body;

        // photo handle 

        // read as buffer 
        const buffer = Buffer.from(photoPath.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');
        // allot a random name 
        const imageName = `blog-${Date.now()}.${photoPath.split(';')[0].split('/')[1]}.png`;
        // save locally
        try {
            fs.writeFileSync(`storage/${imageName}`, buffer);
        } catch (error) {
            return next(error);
        }

        // save blog in to database 
        let newBlog;
        try {
            newBlog = new Blog({
                title,
                content,
                photoPath: `${BACKEND_SERVER_PATH}/storage/${imageName}`,
                author,
            })
            await newBlog.save();
        } catch (error) {
            return next(error)
        }
      const blogDto = new BlogDto(newBlog);
      // send response back
      return res.status(201).json({
        message: "Blog created successfully",
        blog: blogDto
      })
    },

    // getAllBlog,

    async getAllBlog(req, res, next) {
        try {
            // Retrieve all blogs from the database
            const blogs = await Blog.find();

            // Map retrieved blogs to DTOs for response
            const blogDtos = blogs.map(blog => new BlogDto(blog));

            // Send response with the list of blogs
            return res.status(200).json({
                message: "Blogs retrieved successfully",
                blogs: blogDtos
            });
        } catch (error) {
            // If an error occurs, pass it to the error-handling middleware
            return next(error);
        }
    },

    // get blog by id 

    async getBlogById(req, res, next) {
        try {
            // Retrieve the blog ID from the request parameters
            const { id } = req.params;

            // Check if the provided ID is a valid MongoDB ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid blog ID format" });
            }

            // Find the blog in the database by its ID
            const blog = await Blog.findById(id);

            // If the blog doesn't exist, return a 404 Not Found response
            if (!blog) {
                return res.status(404).json({ message: "Blog not found" });
            }

            // Convert the retrieved blog to a DTO
            const blogDto = new BlogDto(blog);

            // Send response with the blog DTO
            return res.status(200).json({
                message: "Blog retrieved successfully",
                blog: blogDto
            });
        } catch (error) {
            // If an error occurs, pass it to the error-handling middleware
            return next(error);
        }
    },

    // update blog by id 

    async updateBlogById(req, res, next) {
        try {
            // Retrieve the blog ID from the request parameters
            const { id } = req.params;

            // Check if the provided ID is a valid MongoDB ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid blog ID format" });
            }

            // Retrieve the updated blog data from the request body
            const { title, content, photoPath, author } = req.body;

            // Find the blog in the database by its ID and update its fields
            const updatedBlog = await Blog.findByIdAndUpdate(id, { title, content, photoPath, author }, { new: true });

            // If the blog doesn't exist, return a 404 Not Found response
            if (!updatedBlog) {
                return res.status(404).json({ message: "Blog not found" });
            }

            // Convert the updated blog to a DTO
            const blogDto = new BlogDto(updatedBlog);

            // Send response with the updated blog DTO
            return res.status(200).json({
                message: "Blog updated successfully",
                blog: blogDto
            });
        } catch (error) {
            // If an error occurs, pass it to the error-handling middleware
            return next(error);
        }
    },

    // delete Blog By Id
    async deleteBlogById(req, res, next) {
        try {
            // Retrieve the blog ID from the request parameters
            const { id } = req.params;

            // Check if the provided ID is a valid MongoDB ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid blog ID format" });
            }

            // Find the blog in the database by its ID and delete it
            const deletedBlog = await Blog.findByIdAndDelete(id);

            // If the blog doesn't exist, return a 404 Not Found response
            if (!deletedBlog) {
                return res.status(404).json({ message: "Blog not found" });
            }

            // Send response with a success message
            return res.status(200).json({ message: "Blog deleted successfully" });
        } catch (error) {
            // If an error occurs, pass it to the error-handling middleware
            return next(error);
        }
    },

}

module.exports = blogController;