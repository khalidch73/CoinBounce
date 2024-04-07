const mongoose = require('mongoose');
const {Schema} = mongoose;

const userComment = new Schema({
    content: {type: String, required: true},
    blog: {type: mongoose.SchemaTypes.ObjectId, ref: 'blogs'},
    author: {type: mongoose.SchemaTypes.ObjectId, ref: 'users'},
},
   {timestamps: true}
)

module.exports = mongoose.model('comment', userComment, 'comments');