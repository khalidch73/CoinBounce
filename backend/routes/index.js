const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const authController = require('../controllers/authController')
const blogController = require('../controllers/blogController')
const commentController = require('../controllers/commentController')

// 00. main route

router.get('/', (req, res) => res.json({
    message : "Hello world this is a backend project"
}))

// 0. testing route

router.get('/test', (req, res) => res.json({
    message : "This is a Test route"
}))

//**********************authentication routes***********************//

// 1. register

router.post('/register', authController.register)

// 2. login

router.post('/login', authController.login)

// 3. logout

router.post('/logout', auth, authController.logout)

// 4. refresh

router.get('/refresh', authController.refresh)

// 5. forgot password

// router.post('/forgot-password', authController.forgotPassword)

// 6. reset password

// router.post('/reset-password', authController.resetPassword)

// ************************blog routes********************************//
// 1. create blog

router.post('/blog', auth, blogController.createBlog);

// 2. read all blogs

router.get('/blog/all', auth, blogController.getAllBlog);

// 3. read blog by id

router.get('/blog/:id', auth, blogController.getBlogById);

// 4. update blog

router.put('/blog/:id', auth, blogController.updateBlogById)

// 5. delete blog

router.delete('/blog/:id', auth, blogController.deleteBlogById)



// ************************comment routes********************************//

// 1. create comment

router.post('/comment', auth, commentController.createComment);

// 2. read comments by blog id

router.get('/comment/:id', auth, commentController.getCommentById);

// 3. read all comments

// router.get('/comment/all', auth, commentController.getAllComments);

// 4. update comment

// router.put('/comment/:id', auth, commentController.updateCommentById)

// 6. delete comment

// router.delete('/comment/:id', auth, commentController.deleteCommentById)



// ************************user routes********************************//

module.exports = router;