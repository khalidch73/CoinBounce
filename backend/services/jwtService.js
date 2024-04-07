const jwt = require('jsonwebtoken');
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = require('../config/index');
const RefreshToken = require('../models/token'); // Import RefreshToken model

class JwtService {
    static signAccessToken(payload, expiryTime) {
        return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: expiryTime });
    }

    static verifyAccessToken(token) {
        return jwt.verify(token, JWT_ACCESS_SECRET);
    }

    static signRefreshToken(payload, expiryTime) {
        return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: expiryTime });
    }

    static verifyRefreshToken(token) {
        return jwt.verify(token, JWT_REFRESH_SECRET);
    }

    static async storeRefreshToken(token, userId) {
        try {
            const newToken = new RefreshToken({
                token: token,
                userId: userId
            });
            // Store in the database
            await newToken.save();
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = JwtService;
