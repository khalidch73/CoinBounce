// this is a model to store refresh token

const mongoose = require('mongoose');
const { Schema } = mongoose;

const refreshTokenSchema = new Schema({
    token: {type: String, required: true},
    userId: {type: mongoose.SchemaTypes.ObjectId, ref: 'users'}
},
{timestamps: true}
)

module.exports = mongoose.model('RefreshToken', refreshTokenSchema, 'tokens');
