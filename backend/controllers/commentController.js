const Joi = require("joi");
const Comment = require("../models/comments");
const CommentDto = require("../dto/comments");
const mongoose = require('mongoose');


const mongoDbRegExpId = /^[0-9a-fA-F]{24}$/;
const commentSchema = Joi.object({
    content: Joi.string().min(3).max(255).required(),
    blogId: Joi.string().regex(mongoDbRegExpId).required(),
    authorId: Joi.string().regex(mongoDbRegExpId).required()
});



const commentController = {

    // create comment controller 
    async createComment(req, res, next) {
        try {
            // Validate request body against the schema
            const { error } = commentSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            // Extract validated data from the request body
            const { content, blogId, userId } = req.body;

            // Create a new comment instance
            const newComment = new Comment({
                content,
                blogId,
                authorId: userId
            });

            // Save the new comment to the database
            await newComment.save();

            // Send a success response
            return res.status(201).json({ message: "Comment created successfully", comment: newComment });
        } catch (error) {
            // If an error occurs, pass it to the error-handling middleware
            return next(error);
        }
    },

    // get comment by id controller

    async getCommentById(req, res, next) {
        try {
            // Extract comment ID from request parameters
            const { id } = req.params;

            // Check if the provided ID is a valid MongoDB ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid comment ID format" });
            }

            // Find the comment by its ID in the database
            const comment = await Comment.findById(id);

            // If comment is not found, return a 404 Not Found response
            if (!comment) {
                return res.status(404).json({ message: "Comment not found" });
            }

            // Convert the retrieved comment to a DTO
            const commentDto = new CommentDto(comment);

            // Return the comment DTO as a JSON response
            return res.status(200).json({ message: "Comment retrieved successfully", comment: commentDto });
        } catch (error) {
            // If an error occurs, pass it to the error-handling middleware
            return next(error);
        }
    },

};

module.exports = commentController;
