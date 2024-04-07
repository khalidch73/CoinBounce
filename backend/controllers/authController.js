const Joi = require("joi");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const UserDto = require("../dto/user");
const JwtService = require('../services/jwtService');
const RefreshToken = require('../models/token'); // Import RefreshToken model


const authController = {
  async register(req, res, next) {
    // validation user input by joi library
    const userRegisterSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      email: Joi.string().required(),
      name: Joi.string().min(3).max(30).required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });
    const { error } = userRegisterSchema.validate(req.body);

    // if error in validation return error via a middleware
    if (error) {
      return next(error);
    }
    // if email or username is already registered return an error
    const { username, email } = req.body;
    try {
      const emailInUse = await User.exists({ email });
      const usernameInUse = await User.exists({ username });
      if (emailInUse) {
        const error = {
          status: 409,
          message: "Email already in use, try another email:",
        };
        return next(error);
      }
      if (usernameInUse) {
        const error = {
          status: 409,
          message: "Username already in use, try another username:",
        };
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
    // password hash bcryptjs
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // save user in database
    let accessToken;
    let refreshToken;
    let registeredUser;
    try {
      const userToRegister = new User({
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        password: hashedPassword,
        confirmPassword: hashedPassword,
      });

      registeredUser = await userToRegister.save();
      //jwt access token generation

      accessToken = JwtService.signAccessToken({
          id: registeredUser.id,
        //   username: registeredUser.username,
        //   email: registeredUser.email,
        //   name: registeredUser.name,
      }, '30m');
      //jwt refresh token generation

      refreshToken = JwtService.signRefreshToken(
        {
          id: registeredUser.id,
        //   username: registeredUser.username,
        //   email: registeredUser.email,
        //   name: registeredUser.name,
        },
        "60m"
      );
    } catch (error) {
      return next(error);
    }
    // store refresh token in database
    await JwtService.storeRefreshToken(refreshToken, registeredUser.id);

    // send cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    const userDto = new UserDto(registeredUser);
    // response send
    res.status(200).json({
      message: "User registered successfully",
      user: userDto,
      auth: true,
    });
  },

  async login(req, res, next) {
    // validation user input by joi library
    const userLoginSchema = Joi.object({
      username: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern).required(),
    });
    const { error } = userLoginSchema.validate(req.body);

    // if error in validation return error via a middleware
    if (error) {
      return next(error);
    }
    const { username, password } = req.body;

    try {
      // match username
      const userToLogin = await User.findOne({ username: req.body.username });
      if (!userToLogin) {
        const error = {
          status: 404,
          message: "invalid username",
        };
        return next(error);
      }
      // match password
      const isPasswordCorrect = await bcrypt.compare(
        password,
        userToLogin.password
      );
      if (!isPasswordCorrect) {
        const error = {
          status: 401,
          message: "invalid password",
        };
        return next(error);
      }

      //jwt access token generation
      const accessToken = JwtService.signAccessToken({
        id: userToLogin.id,
      }, '30m');
      
      //jwt refresh token generation
      const refreshToken = JwtService.signRefreshToken(
        {
          id: userToLogin.id,
        },
        "60m"
      );

      // update refresh token in database
      try {
        await RefreshToken.updateOne(
          { userId: userToLogin.id },
          { token: refreshToken },
          { upsert: true }
        );
      } catch (error) {
        return next(error);
      }
      
      res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });
      res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      });
    
      const userDto = new UserDto(userToLogin);
      // response send
      res.status(200).json({
        message: "User logged in successfully",
        user: userDto,
        auth: true
      });
    } catch (error) {
      // Handle errors here
      console.error(error);
      return next(error);
    }
  },

  async logout(req, res, next) {
    // delete refresh token from database
    const { refreshToken } = req.cookies;
    try {
      await RefreshToken.deleteOne({ token: refreshToken });
    } catch (error) {
      return next(error);
    }

    // delete cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // response send
    res.status(200).json({
      message: "User logged out successfully",
      auth: false,
    });
  },

  async refresh(req, res, next) {
    // Get refresh token from cookies
    const originalRefreshToken = req.cookies.refreshToken;
    let refreshTokenMatch;

    // Verify refresh token
    let id;
    try {
        id = JwtService.verifyRefreshToken(originalRefreshToken).id;
    } catch (error) {
        const err = {
            status: 401,
            message: "Invalid refresh token"
        };
        return next(err);
    }

    // Get refresh token from database
    try {
        refreshTokenMatch = await RefreshToken.findOne({
            userId: id,
            token: originalRefreshToken
        });
        if (!refreshTokenMatch) {
            const err = {
                status: 401,
                message: "Invalid refresh token"
            };
            return next(err);
        }
    } catch (error) {
        return next(error);
    }

    // Generate new access token
    try {
        const accessToken = JwtService.signAccessToken({
            id: refreshTokenMatch.userId
        }, '30m');
        const refreshToken = JwtService.signRefreshToken({
            id: refreshTokenMatch.userId
        }, '60m');
        await RefreshToken.updateOne(
            { userId: refreshTokenMatch.userId },
            { token: refreshToken }
        );

        // Set new tokens as cookies
        res.cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });
        res.cookie("refreshToken", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });

        // Send response
        res.status(200).json({
            message: "User refreshed successfully",
            auth: true
        });
    } catch (error) {
        return next(error);
    }
   },
};

module.exports = authController;
