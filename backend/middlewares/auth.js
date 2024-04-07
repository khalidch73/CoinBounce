const JwtService = require('../services/jwtService');
const User = require('../models/user'); // Renamed user to User
const UserDto = require('../dto/user');

const auth = async (req, res, next) => {
    try {
        const { refreshToken, accessToken } = req.cookies;
        if (!refreshToken || !accessToken) {
            const error = {
                status: 401,
                message: 'Refresh token and access token are required'
            };
            return next(error);
        }
    
        let decodedToken;
        try {
            decodedToken = JwtService.verifyAccessToken(accessToken);
        } catch (error) {
            return next(error);
        }
    
        let currentUser;
        try {
            currentUser = await User.findOne({
                _id: decodedToken.id
            });
        } catch (error) {
            return next(error);
        }
    
        if (!currentUser) {
            const error = {
                status: 404,
                message: 'User not found'
            };
            return next(error);
        }
    
        const userDto = new UserDto(currentUser);
        req.user = userDto; // Renamed req.users to req.user
    
        next();
    } catch (error) {
        return next(error);
    }
}
module.exports = auth;
